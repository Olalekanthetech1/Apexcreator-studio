import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyCCwfhn3uf-neGn5QuLXEjysTOcIM7ssSM",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "apexcreator-studio.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "apexcreator-studio",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "apexcreator-studio.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "601802716684",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:601802716684:web:de5e7d1af7fef0801c6029"
};

const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestoreDb = getFirestore(firebaseApp, "(default)");

// Local resilient fallback storage file
const DATA_DIR = path.join(process.cwd(), 'data');
const LOCAL_DB_FILE = path.join(DATA_DIR, 'db-fallback-store.json');

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create data dir:', err);
  }
}

interface LocalStoreData {
  settings: Record<string, any>;
  orders: any[];
  chatSessions?: any[];
  chatMessages?: any[];
}

function loadLocalStore(): LocalStoreData {
  try {
    if (fs.existsSync(LOCAL_DB_FILE)) {
      const raw = fs.readFileSync(LOCAL_DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        settings: parsed.settings || {},
        orders: parsed.orders || [],
        chatSessions: parsed.chatSessions || [],
        chatMessages: parsed.chatMessages || []
      };
    }
  } catch (e) {
    console.warn('Could not read fallback store:', e);
  }
  return { settings: {}, orders: [], chatSessions: [], chatMessages: [] };
}

function saveLocalStore(data: LocalStoreData) {
  try {
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write fallback store:', e);
  }
}

let pool: Pool | null = null;
let isConnected = false;
let connectionError: string | null = null;
let customRuntimeUrl: string = '';

export function getDatabaseUrl(): string {
  if (customRuntimeUrl) return customRuntimeUrl;
  return (
    process.env.DATABASE_URL ||
    process.env.DATABASE_URI ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRESQL_URL ||
    process.env.RENDER_POSTGRES_URL ||
    ''
  ).trim();
}

export function setDatabaseUrl(url: string) {
  customRuntimeUrl = url.trim();
  pool = null;
  isConnected = false;
  connectionError = null;
  initDb();
}

export function getPool(): Pool | null {
  let dbUrl = getDatabaseUrl();
  if (!dbUrl) {
    return null;
  }

  // Remove surrounding quotes if Render or env injected them
  dbUrl = dbUrl.replace(/^["']|["']$/g, '').trim();

  // Ensure SSL parameters for Neon / Render / cloud Postgres
  if (!dbUrl.includes('localhost') && !dbUrl.includes('127.0.0.1')) {
    if (!dbUrl.includes('sslmode=')) {
      dbUrl += (dbUrl.includes('?') ? '&' : '?') + 'sslmode=require';
    }
  }

  if (!pool) {
    try {
      pool = new Pool({
        connectionString: dbUrl,
        ssl: dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1') ? false : { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 15000
      });

      pool.on('error', (err) => {
        console.error('Unexpected Neon Postgres pool error:', err);
        isConnected = false;
        connectionError = err.message;
      });
    } catch (e: any) {
      console.error('Failed to instantiate PG pool:', e);
      connectionError = e.message;
      return null;
    }
  }

  return pool;
}

export async function initDb(): Promise<{ success: boolean; message: string }> {
  const currentPool = getPool();
  if (!currentPool) {
    return {
      success: false,
      message: 'DATABASE_URL is not set. Using persistent local fallback storage.'
    };
  }

  try {
    const client = await currentPool.connect();
    try {
      // 1. Create App Settings table
      await client.query(`
        CREATE TABLE IF NOT EXISTS app_settings (
          key VARCHAR(100) PRIMARY KEY,
          value JSONB NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 2. Create Orders table
      await client.query(`
        CREATE TABLE IF NOT EXISTS client_orders (
          id VARCHAR(100) PRIMARY KEY,
          customer_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          category VARCHAR(100),
          service_id VARCHAR(100),
          service_title VARCHAR(255),
          package_type VARCHAR(50),
          price NUMERIC(12, 2) NOT NULL,
          offered_price NUMERIC(12, 2),
          is_negotiated_price BOOLEAN DEFAULT FALSE,
          negotiation_note TEXT,
          social_url TEXT,
          project_description TEXT,
          preferred_delivery_date VARCHAR(100),
          expected_delivery_date VARCHAR(100),
          payment_status VARCHAR(50) DEFAULT 'Pending',
          payment_method VARCHAR(100),
          payment_reference VARCHAR(255),
          status VARCHAR(50) DEFAULT 'Pending',
          deliverables JSONB DEFAULT '[]'::jsonb,
          messages JSONB DEFAULT '[]'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 3. Create Webhook Events Log table
      await client.query(`
        CREATE TABLE IF NOT EXISTS payment_webhook_logs (
          id VARCHAR(100) PRIMARY KEY,
          event_type VARCHAR(100),
          reference VARCHAR(255),
          amount NUMERIC(12, 2),
          currency VARCHAR(20),
          customer_email VARCHAR(255),
          status VARCHAR(50),
          payload JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 4. Create Services table
      await client.query(`
        CREATE TABLE IF NOT EXISTS services (
          id VARCHAR(100) PRIMARY KEY,
          category VARCHAR(100) NOT NULL,
          title VARCHAR(255) NOT NULL,
          short_desc TEXT NOT NULL,
          full_desc TEXT NOT NULL,
          icon_name VARCHAR(100) NOT NULL,
          delivery_info TEXT NOT NULL,
          what_is_included JSONB NOT NULL,
          packages JSONB NOT NULL,
          faqs JSONB NOT NULL,
          popular BOOLEAN DEFAULT FALSE,
          display_order INT DEFAULT 0,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 5. Create Case Studies table
      await client.query(`
        CREATE TABLE IF NOT EXISTS case_studies (
          id VARCHAR(100) PRIMARY KEY,
          client_name VARCHAR(255) NOT NULL,
          client_handle VARCHAR(255),
          platform VARCHAR(100),
          service_category VARCHAR(100),
          title VARCHAR(255) NOT NULL,
          summary TEXT NOT NULL,
          challenge TEXT,
          strategy TEXT,
          execution JSONB,
          metrics JSONB,
          testimonial_quote TEXT,
          before_image TEXT,
          after_image TEXT,
          timeframe VARCHAR(100),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 6. Create Team Members table
      await client.query(`
        CREATE TABLE IF NOT EXISTS team_members (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(255) NOT NULL,
          specialty VARCHAR(255),
          bio TEXT,
          avatar TEXT,
          experience_years VARCHAR(100),
          social_link TEXT,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 7. Create Insights table
      await client.query(`
        CREATE TABLE IF NOT EXISTS insights (
          id VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          category VARCHAR(100),
          author VARCHAR(255),
          read_time VARCHAR(100),
          date VARCHAR(100),
          summary TEXT,
          key_takeaways JSONB,
          content JSONB,
          cover_image TEXT,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 8. Create Proofs table
      await client.query(`
        CREATE TABLE IF NOT EXISTS proofs (
          id VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          platform VARCHAR(100),
          category VARCHAR(100),
          service_provided TEXT,
          before_image TEXT,
          after_image TEXT,
          result_image TEXT,
          description TEXT,
          date_completed VARCHAR(100),
          hidden BOOLEAN DEFAULT FALSE,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 9. Create Testimonials table
      await client.query(`
        CREATE TABLE IF NOT EXISTS testimonials (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          handle VARCHAR(255),
          role VARCHAR(255),
          text TEXT NOT NULL,
          rating INT DEFAULT 5,
          avatar TEXT,
          platform VARCHAR(100),
          hidden BOOLEAN DEFAULT FALSE,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 10. Create FAQs table
      await client.query(`
        CREATE TABLE IF NOT EXISTS faqs (
          id VARCHAR(100) PRIMARY KEY,
          category VARCHAR(100),
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          hidden BOOLEAN DEFAULT FALSE,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 11. Create Chat Sessions table
      await client.query(`
        CREATE TABLE IF NOT EXISTS chat_sessions (
          id VARCHAR(100) PRIMARY KEY,
          customer_name VARCHAR(255),
          email VARCHAR(255),
          last_message_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 12. Create Chat Messages table
      await client.query(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id VARCHAR(100) PRIMARY KEY,
          session_id VARCHAR(100) REFERENCES chat_sessions(id) ON DELETE CASCADE,
          sender VARCHAR(50) NOT NULL,
          text TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      isConnected = true;
      connectionError = null;
      console.log('✅ Successfully connected to Neon PostgreSQL and verified schemas.');
      return { success: true, message: 'Connected to Neon PostgreSQL successfully.' };
    } finally {
      client.release();
    }
  } catch (err: any) {
    isConnected = false;
    connectionError = err.message;
    console.warn('⚠️ Neon PostgreSQL connection attempt failed, continuing with local store:', err.message);
    return { success: false, message: err.message };
  }
}

// -------------------------------------------------------------
// Database Operations (with automatic seamless fallback)
// -------------------------------------------------------------

export async function getSetting<T = any>(key: string, defaultValue: T): Promise<T> {
  const currentPool = getPool();
  if (currentPool && isConnected) {
    try {
      const res = await currentPool.query('SELECT value FROM app_settings WHERE key = $1', [key]);
      if (res.rows.length > 0) {
        return res.rows[0].value as T;
      }
    } catch (err) {
      console.error(`Error reading setting ${key} from Neon:`, err);
    }
  }

  // Fallback
  const local = loadLocalStore();
  return (local.settings[key] !== undefined ? local.settings[key] : defaultValue) as T;
}

export async function getAllSettings(): Promise<Record<string, any>> {
  const currentPool = getPool();
  if (currentPool && isConnected) {
    try {
      const res = await currentPool.query('SELECT key, value FROM app_settings');
      const map: Record<string, any> = {};
      for (const row of res.rows) {
        map[row.key] = row.value;
      }
      return map;
    } catch (err) {
      console.error('Error reading all settings from Neon:', err);
    }
  }

  const local = loadLocalStore();
  return local.settings || {};
}

export async function saveSetting(key: string, value: any): Promise<boolean> {
  // Always update local fallback
  const local = loadLocalStore();
  local.settings[key] = value;
  saveLocalStore(local);

  const currentPool = getPool();
  if (currentPool) {
    try {
      await currentPool.query(
        `INSERT INTO app_settings (key, value, updated_at) 
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (key) 
         DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
        [key, JSON.stringify(value)]
      );
      return true;
    } catch (err) {
      console.error(`Error saving setting ${key} to Neon:`, err);
    }
  }
  return true;
}

export async function getAllOrders(): Promise<any[]> {
  const currentPool = getPool();
  if (currentPool && isConnected) {
    try {
      const res = await currentPool.query(`
        SELECT 
          id,
          customer_name as "customerName",
          email,
          category,
          service_id as "serviceId",
          service_title as "serviceTitle",
          package_type as "packageType",
          price::float,
          offered_price::float as "offeredPrice",
          is_negotiated_price as "isNegotiatedPrice",
          negotiation_note as "negotiationNote",
          social_url as "socialUrl",
          project_description as "projectDescription",
          preferred_delivery_date as "preferredDeliveryDate",
          expected_delivery_date as "expectedDeliveryDate",
          payment_status as "paymentStatus",
          payment_method as "paymentMethod",
          payment_reference as "paymentReference",
          status,
          deliverables,
          messages,
          created_at as "createdAt"
        FROM client_orders
        ORDER BY created_at DESC
      `);
      return res.rows;
    } catch (err) {
      console.error('Error fetching orders from Neon:', err);
    }
  }

  const local = loadLocalStore();
  return local.orders || [];
}

export async function saveOrder(order: any): Promise<boolean> {
  const local = loadLocalStore();
  const existingIdx = local.orders.findIndex((o: any) => o.id === order.id);
  if (existingIdx >= 0) {
    local.orders[existingIdx] = order;
  } else {
    local.orders.unshift(order);
  }
  saveLocalStore(local);

  const currentPool = getPool();
  if (currentPool) {
    try {
      await currentPool.query(
        `INSERT INTO client_orders (
          id, customer_name, email, category, service_id, service_title,
          package_type, price, offered_price, is_negotiated_price,
          negotiation_note, social_url, project_description,
          preferred_delivery_date, expected_delivery_date, payment_status,
          payment_method, payment_reference, status, deliverables, messages
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        ON CONFLICT (id) DO UPDATE SET
          customer_name = EXCLUDED.customer_name,
          email = EXCLUDED.email,
          payment_status = EXCLUDED.payment_status,
          payment_method = EXCLUDED.payment_method,
          payment_reference = EXCLUDED.payment_reference,
          status = EXCLUDED.status,
          deliverables = EXCLUDED.deliverables,
          messages = EXCLUDED.messages,
          updated_at = CURRENT_TIMESTAMP`,
        [
          order.id,
          order.customerName,
          order.email,
          order.category || 'Graphics & Branding',
          order.serviceId || '',
          order.serviceTitle || '',
          order.packageType || 'BASIC',
          order.price || 0,
          order.offeredPrice || null,
          !!order.isNegotiatedPrice,
          order.negotiationNote || null,
          order.socialUrl || '',
          order.projectDescription || '',
          order.preferredDeliveryDate || '',
          order.expectedDeliveryDate || '',
          order.paymentStatus || 'Pending',
          order.paymentMethod || null,
          order.paymentReference || null,
          order.status || 'Pending',
          JSON.stringify(order.deliverables || []),
          JSON.stringify(order.messages || [])
        ]
      );
      return true;
    } catch (err) {
      console.error('Error saving order to Neon:', err);
    }
  }
  return true;
}

export async function getAllServices(): Promise<any[]> {
  const currentPool = getPool();
  if (currentPool && isConnected) {
    try {
      const res = await currentPool.query('SELECT * FROM services ORDER BY display_order ASC, title ASC');
      if (res.rows.length > 0) {
        return res.rows.map(row => ({
          ...row,
          shortDesc: row.short_desc,
          fullDesc: row.full_desc,
          iconName: row.icon_name,
          deliveryInfo: row.delivery_info,
          whatIsIncluded: row.what_is_included,
        }));
      }
    } catch (err) {
      console.error('Error fetching services from Neon:', err);
    }
  }

  // Query live Firestore database directly
  try {
    const snap = await getDocs(collection(firestoreDb, 'services'));
    const services: any[] = [];
    snap.forEach(d => services.push({ ...d.data(), id: d.id }));
    if (services.length > 0) {
      return services;
    }
  } catch (err) {
    console.error('Error fetching services from Firestore:', err);
  }

  return [];
}

export async function saveServiceToDb(service: any): Promise<boolean> {
  try {
    await setDoc(doc(firestoreDb, 'services', service.id), service, { merge: true });
  } catch (err) {
    console.warn('Could not save service to Firestore:', err);
  }

  const currentPool = getPool();
  if (currentPool && isConnected) {
    try {
      await currentPool.query(
        `INSERT INTO services (id, category, title, short_desc, full_desc, icon_name, delivery_info, what_is_included, packages, faqs, popular, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)
         ON CONFLICT (id) DO UPDATE SET
           category = EXCLUDED.category,
           title = EXCLUDED.title,
           short_desc = EXCLUDED.short_desc,
           full_desc = EXCLUDED.full_desc,
           icon_name = EXCLUDED.icon_name,
           delivery_info = EXCLUDED.delivery_info,
           what_is_included = EXCLUDED.what_is_included,
           packages = EXCLUDED.packages,
           faqs = EXCLUDED.faqs,
           popular = EXCLUDED.popular,
           updated_at = CURRENT_TIMESTAMP`,
        [
          service.id,
          service.category,
          service.title,
          service.shortDesc || '',
          service.fullDesc || '',
          service.iconName || 'Sparkles',
          service.deliveryInfo || '',
          JSON.stringify(service.whatIsIncluded || []),
          JSON.stringify(service.packages || {}),
          JSON.stringify(service.faqs || []),
          service.popular || false
        ]
      );
    } catch (e) {
      console.warn('Neon saveService error:', e);
    }
  }
  return true;
}

export async function deleteServiceFromDb(serviceId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(firestoreDb, 'services', serviceId));
  } catch (err) {
    console.warn('Could not delete service from Firestore:', err);
  }

  const currentPool = getPool();
  if (currentPool && isConnected) {
    try {
      await currentPool.query('DELETE FROM services WHERE id = $1', [serviceId]);
    } catch (e) {
      console.warn('Neon deleteService error:', e);
    }
  }
  return true;
}

export async function getAllCaseStudies(): Promise<any[]> {
  const currentPool = getPool();
  if (currentPool && isConnected) {
    try {
      const res = await currentPool.query('SELECT * FROM case_studies ORDER BY updated_at DESC');
      if (res.rows.length > 0) {
        return res.rows.map(row => ({
          ...row,
          clientName: row.client_name,
          clientHandle: row.client_handle,
          serviceCategory: row.service_category,
          testimonialQuote: row.testimonial_quote,
          beforeImage: row.before_image,
          afterImage: row.after_image,
        }));
      }
    } catch (err) {
      console.error('Error fetching case studies from Neon:', err);
    }
  }

  try {
    const snap = await getDocs(collection(firestoreDb, 'case_studies'));
    const list: any[] = [];
    snap.forEach(d => list.push({ ...d.data(), id: d.id }));
    if (list.length > 0) return list;
  } catch (err) {
    console.error('Error fetching case studies from Firestore:', err);
  }

  return [];
}

export async function getAllTeamMembers(): Promise<any[]> {
  const currentPool = getPool();
  if (currentPool && isConnected) {
    try {
      const res = await currentPool.query('SELECT * FROM team_members ORDER BY id ASC');
      if (res.rows.length > 0) {
        return res.rows.map(row => ({
          ...row,
          experienceYears: row.experience_years,
          socialLink: row.social_link,
        }));
      }
    } catch (err) {
      console.error('Error fetching team members from Neon:', err);
    }
  }

  try {
    const snap = await getDocs(collection(firestoreDb, 'team'));
    const list: any[] = [];
    snap.forEach(d => list.push({ ...d.data(), id: d.id }));
    if (list.length > 0) return list;
  } catch (err) {
    console.error('Error fetching team from Firestore:', err);
  }

  return [];
}

export async function getAllInsights(): Promise<any[]> {
  const currentPool = getPool();
  if (currentPool && isConnected) {
    try {
      const res = await currentPool.query('SELECT * FROM insights ORDER BY updated_at DESC');
      if (res.rows.length > 0) {
        return res.rows.map(row => ({
          ...row,
          readTime: row.read_time,
          keyTakeaways: row.key_takeaways,
          coverImage: row.cover_image,
        }));
      }
    } catch (err) {
      console.error('Error fetching insights from Neon:', err);
    }
  }

  try {
    const snap = await getDocs(collection(firestoreDb, 'insights'));
    const list: any[] = [];
    snap.forEach(d => list.push({ ...d.data(), id: d.id }));
    if (list.length > 0) return list;
  } catch (err) {
    console.error('Error fetching insights from Firestore:', err);
  }

  return [];
}

export async function getAllProofs(): Promise<any[]> {
  const currentPool = getPool();
  if (currentPool && isConnected) {
    try {
      const res = await currentPool.query('SELECT * FROM proofs WHERE hidden = FALSE ORDER BY date_completed DESC');
      if (res.rows.length > 0) {
        return res.rows.map(row => ({
          ...row,
          serviceProvided: row.service_provided,
          beforeImage: row.before_image,
          afterImage: row.after_image,
          resultImage: row.result_image,
          dateCompleted: row.date_completed,
        }));
      }
    } catch (err) {
      console.error('Error fetching proofs from Neon:', err);
    }
  }

  try {
    const snap = await getDocs(collection(firestoreDb, 'proofs'));
    const list: any[] = [];
    snap.forEach(d => list.push({ ...d.data(), id: d.id }));
    if (list.length > 0) return list;
  } catch (err) {
    console.error('Error fetching proofs from Firestore:', err);
  }

  return [];
}

export async function getAllTestimonials(): Promise<any[]> {
  const currentPool = getPool();
  if (currentPool && isConnected) {
    try {
      const res = await currentPool.query('SELECT * FROM testimonials WHERE hidden = FALSE ORDER BY updated_at DESC');
      if (res.rows.length > 0) return res.rows;
    } catch (err) {
      console.error('Error fetching testimonials from Neon:', err);
    }
  }

  try {
    const snap = await getDocs(collection(firestoreDb, 'testimonials'));
    const list: any[] = [];
    snap.forEach(d => list.push({ ...d.data(), id: d.id }));
    if (list.length > 0) return list;
  } catch (err) {
    console.error('Error fetching testimonials from Firestore:', err);
  }

  return [];
}

export async function getAllFaqs(): Promise<any[]> {
  const currentPool = getPool();
  if (currentPool && isConnected) {
    try {
      const res = await currentPool.query('SELECT * FROM faqs WHERE hidden = FALSE ORDER BY category ASC, updated_at ASC');
      if (res.rows.length > 0) return res.rows;
    } catch (err) {
      console.error('Error fetching faqs from Neon:', err);
    }
  }

  try {
    const snap = await getDocs(collection(firestoreDb, 'faqs'));
    const list: any[] = [];
    snap.forEach(d => list.push({ ...d.data(), id: d.id }));
    if (list.length > 0) return list;
  } catch (err) {
    console.error('Error fetching faqs from Firestore:', err);
  }

  return [];
}

// --- Chat Operations ---

export async function createChatSession(id: string, name?: string, email?: string): Promise<boolean> {
  const currentPool = getPool();
  if (currentPool) {
    try {
      await currentPool.query(
        `INSERT INTO chat_sessions (id, customer_name, email) VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE SET customer_name = EXCLUDED.customer_name, email = EXCLUDED.email`,
        [id, name || null, email || null]
      );
    } catch (err) {
      console.error('Error creating chat session in Postgres:', err);
    }
  }

  // Local store sync
  const store = loadLocalStore();
  const sessions = store.chatSessions || [];
  const existingIdx = sessions.findIndex((s: any) => s.id === id);
  const now = new Date().toISOString();
  if (existingIdx >= 0) {
    sessions[existingIdx] = {
      ...sessions[existingIdx],
      customer_name: name || sessions[existingIdx].customer_name,
      email: email || sessions[existingIdx].email,
      last_message_at: now
    };
  } else {
    sessions.push({
      id,
      customer_name: name || 'Guest User',
      email: email || '',
      created_at: now,
      last_message_at: now
    });
  }
  store.chatSessions = sessions;
  saveLocalStore(store);
  return true;
}

export async function saveChatMessage(id: string, sessionId: string, sender: string, text: string): Promise<boolean> {
  const currentPool = getPool();
  if (currentPool) {
    try {
      await currentPool.query(
        `INSERT INTO chat_messages (id, session_id, sender, text) VALUES ($1, $2, $3, $4)`,
        [id, sessionId, sender, text]
      );
      await currentPool.query(
        `UPDATE chat_sessions SET last_message_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [sessionId]
      );
    } catch (err) {
      console.error('Error saving chat message in Postgres:', err);
    }
  }

  // Local store sync
  const store = loadLocalStore();
  const messages = store.chatMessages || [];
  const sessions = store.chatSessions || [];
  const now = new Date().toISOString();

  messages.push({
    id,
    session_id: sessionId,
    sender,
    text,
    created_at: now
  });

  const sessionIdx = sessions.findIndex((s: any) => s.id === sessionId);
  if (sessionIdx >= 0) {
    sessions[sessionIdx].last_message_at = now;
  } else {
    sessions.push({
      id: sessionId,
      customer_name: 'Guest User',
      email: '',
      created_at: now,
      last_message_at: now
    });
  }

  store.chatMessages = messages;
  store.chatSessions = sessions;
  saveLocalStore(store);
  return true;
}

export async function getChatMessages(sessionId: string): Promise<any[]> {
  const currentPool = getPool();
  if (currentPool && isConnected) {
    try {
      const res = await currentPool.query(
        'SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC',
        [sessionId]
      );
      if (res.rows && res.rows.length > 0) {
        return res.rows;
      }
    } catch (err) {
      console.error('Error fetching chat messages from Postgres:', err);
    }
  }

  const store = loadLocalStore();
  const messages = (store.chatMessages || []).filter((m: any) => m.session_id === sessionId);
  return messages.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export async function getAllChatSessions(): Promise<any[]> {
  const currentPool = getPool();
  if (currentPool && isConnected) {
    try {
      const res = await currentPool.query(
        'SELECT * FROM chat_sessions ORDER BY last_message_at DESC'
      );
      if (res.rows && res.rows.length > 0) {
        return res.rows;
      }
    } catch (err) {
      console.error('Error fetching all chat sessions from Postgres:', err);
    }
  }

  const store = loadLocalStore();
  const sessions = store.chatSessions || [];
  return sessions.sort((a: any, b: any) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
}

export async function seedInitialData(
  services: any[],
  caseStudies: any[],
  team: any[],
  insights: any[],
  proofs: any[],
  testimonials: any[],
  faqs: any[],
  orders: any[]
): Promise<void> {
  const currentPool = getPool();
  if (!currentPool || !isConnected) return;

  const client = await currentPool.connect();
  try {
    // Seed Services
    const sCount = await client.query('SELECT count(*) FROM services');
    if (parseInt(sCount.rows[0].count) === 0) {
      console.log('🌱 Seeding services...');
      for (const s of services) {
        await client.query(
          `INSERT INTO services (id, category, title, short_desc, full_desc, icon_name, delivery_info, what_is_included, packages, faqs, popular)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [s.id, s.category, s.title, s.shortDesc, s.fullDesc, s.iconName, s.deliveryInfo, JSON.stringify(s.whatIsIncluded), JSON.stringify(s.packages), JSON.stringify(s.faqs), !!s.popular]
        );
      }
    }

    // Seed Case Studies
    const csCount = await client.query('SELECT count(*) FROM case_studies');
    if (parseInt(csCount.rows[0].count) === 0) {
      console.log('🌱 Seeding case studies...');
      for (const cs of caseStudies) {
        await client.query(
          `INSERT INTO case_studies (id, client_name, client_handle, platform, service_category, title, summary, challenge, strategy, execution, metrics, testimonial_quote, before_image, after_image, timeframe)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
          [cs.id, cs.clientName, cs.clientHandle, cs.platform, cs.serviceCategory, cs.title, cs.summary, cs.challenge, cs.strategy, JSON.stringify(cs.execution), JSON.stringify(cs.metrics), cs.testimonialQuote, cs.beforeImage, cs.afterImage, cs.timeframe]
        );
      }
    }

    // Seed Team
    const tCount = await client.query('SELECT count(*) FROM team_members');
    if (parseInt(tCount.rows[0].count) === 0) {
      console.log('🌱 Seeding team members...');
      for (const t of team) {
        await client.query(
          `INSERT INTO team_members (id, name, role, specialty, bio, avatar, experience_years, social_link)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [t.id, t.name, t.role, t.specialty, t.bio, t.avatar, t.experienceYears, t.socialLink || null]
        );
      }
    }

    // Seed Insights
    const iCount = await client.query('SELECT count(*) FROM insights');
    if (parseInt(iCount.rows[0].count) === 0) {
      console.log('🌱 Seeding insights...');
      for (const i of insights) {
        await client.query(
          `INSERT INTO insights (id, title, slug, category, author, read_time, date, summary, key_takeaways, content, cover_image)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [i.id, i.title, i.slug, i.category, i.author, i.readTime, i.date, i.summary, JSON.stringify(i.keyTakeaways), JSON.stringify(i.content), i.coverImage]
        );
      }
    }

    // Seed Proofs
    const pCount = await client.query('SELECT count(*) FROM proofs');
    if (parseInt(pCount.rows[0].count) === 0) {
      console.log('🌱 Seeding proofs...');
      for (const p of proofs) {
        await client.query(
          `INSERT INTO proofs (id, title, platform, category, service_provided, before_image, after_image, result_image, description, date_completed)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [p.id, p.title, p.platform, p.category, p.serviceProvided, p.beforeImage, p.afterImage, p.resultImage, p.description, p.dateCompleted]
        );
      }
    }

    // Seed Testimonials
    const testCount = await client.query('SELECT count(*) FROM testimonials');
    if (parseInt(testCount.rows[0].count) === 0) {
      console.log('🌱 Seeding testimonials...');
      for (const t of testimonials) {
        await client.query(
          `INSERT INTO testimonials (id, name, handle, role, text, rating, avatar, platform)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [t.id, t.name, t.handle, t.role, t.text, t.rating, t.avatar, t.platform]
        );
      }
    }

    // Seed FAQs
    const faqCount = await client.query('SELECT count(*) FROM faqs');
    if (parseInt(faqCount.rows[0].count) === 0) {
      console.log('🌱 Seeding faqs...');
      for (const f of faqs) {
        await client.query(
          `INSERT INTO faqs (id, category, question, answer)
           VALUES ($1, $2, $3, $4)`,
          [f.id, f.category, f.question, f.answer]
        );
      }
    }

    // Seed Initial Orders
    const oCount = await client.query('SELECT count(*) FROM client_orders');
    if (parseInt(oCount.rows[0].count) === 0) {
      console.log('🌱 Seeding initial orders...');
      for (const o of orders) {
        await saveOrder(o);
      }
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    client.release();
  }
}

export async function getDbStatus(): Promise<{
  connected: boolean;
  databaseUrlConfigured: boolean;
  provider: string;
  error: string | null;
  ordersCount: number;
  settingsCount: number;
}> {
  const currentPool = getPool();
  let ordersCount = 0;
  let settingsCount = 0;

  if (currentPool && isConnected) {
    try {
      const oRes = await currentPool.query('SELECT count(*) FROM client_orders');
      ordersCount = parseInt(oRes.rows[0].count, 10) || 0;

      const sRes = await currentPool.query('SELECT count(*) FROM app_settings');
      settingsCount = parseInt(sRes.rows[0].count, 10) || 0;
    } catch (e) {
      console.error('Failed to get Neon table counts:', e);
    }
  } else {
    const local = loadLocalStore();
    ordersCount = local.orders?.length || 0;
    settingsCount = Object.keys(local.settings || {}).length;
  }

  return {
    connected: isConnected,
    databaseUrlConfigured: !!getDatabaseUrl(),
    provider: isConnected ? 'Neon Serverless PostgreSQL' : 'Resilient File Store (Awaiting Neon Connection)',
    error: connectionError,
    ordersCount,
    settingsCount
  };
}
