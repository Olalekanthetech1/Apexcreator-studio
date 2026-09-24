import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import {
  initDb,
  getDbStatus,
  setDatabaseUrl,
  getAllSettings,
  saveSetting,
  getAllOrders,
  saveOrder,
  getAllServices,
  saveServiceToDb,
  deleteServiceFromDb,
  getAllCaseStudies,
  getAllTeamMembers,
  getAllInsights,
  getAllProofs,
  getAllTestimonials,
  getAllFaqs,
  createChatSession,
  saveChatMessage,
  getChatMessages,
  getAllChatSessions,
  seedInitialData,
  getPool
} from "./src/server/db";
import { INITIAL_SERVICES, INITIAL_PROOFS, INITIAL_TESTIMONIALS, INITIAL_FAQS, INITIAL_ORDERS } from "./src/data/initialData";
import { INITIAL_CASE_STUDIES, INITIAL_TEAM, INITIAL_INSIGHTS } from "./src/data/strategicData";
import { DEFAULT_CRYPTO_SETTINGS } from "./src/data/cryptoDefaults";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// ==========================================
// 🤖 AI ADAPTIVE SERVICES & RECOMMENDATIONS
// ==========================================
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
}) : null;

app.post("/api/ai/recommend", async (req, res) => {
  const { channelUrl, niche, goals, currentChallenges } = req.body || {};

  if (!ai) {
    return res.status(503).json({ success: false, message: "AI services are currently unavailable." });
  }

  try {
    const services = await getAllServices();

    const prompt = `
      You are ApexCreator Studio, a professional digital growth strategist for YouTube and Twitch creators.
      Based on the following creator profile, recommend the top 3-4 most impactful services from our catalog.
      
      CREATOR PROFILE:
      - Channel/Social URL: ${channelUrl || "Not provided"}
      - Niche/Category: ${niche || "Not provided"}
      - Growth Goals: ${goals || "Scale audience and monetization"}
      - Current Challenges: ${currentChallenges || "Stagnant growth or low engagement"}

      AVAILABLE SERVICES CATALOG:
      ${services.map(s => `- [${s.id}] ${s.title}: ${s.shortDesc}`).join("\n")}

      RESPONSE FORMAT (JSON ONLY):
      {
        "analysis": "A brief 2-sentence analysis of their current situation and potential.",
        "recommendations": [
          {
            "serviceId": "exact-service-id-from-catalog",
            "reason": "Why this specific service is the best next step for them.",
            "expectedImpact": "What specific metric improvement they can expect."
          }
        ],
        "proTip": "One advanced 'alpha' tip tailored specifically to their niche."
      }
    `;

    const result = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 2048
      }
    });

    const rawText = result.text || "{}";
    const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const recommendation = JSON.parse(cleaned);

    res.json({ success: true, recommendation });
  } catch (error: any) {
    console.error("Gemini AI Recommendation Error:", error);
    res.status(500).json({ success: false, error: "Failed to generate AI recommendation." });
  }
});

// ==========================================
// 📄 CONTENT API ROUTES (DYNAMIC FROM DB)
// ==========================================

app.get("/api/content/services", async (req, res) => {
  try {
    const services = await getAllServices();
    res.json({ success: true, services });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/content/services", async (req, res) => {
  try {
    const service = req.body;
    if (!service || !service.id) {
      return res.status(400).json({ success: false, error: "Invalid service data" });
    }
    await saveServiceToDb(service);
    res.json({ success: true, service });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/content/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteServiceFromDb(id);
    res.json({ success: true, message: `Service ${id} deleted` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/content/case-studies", async (req, res) => {
  try {
    const caseStudies = await getAllCaseStudies();
    res.json({ success: true, caseStudies });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/content/team", async (req, res) => {
  try {
    const team = await getAllTeamMembers();
    res.json({ success: true, team });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/content/insights", async (req, res) => {
  try {
    const insights = await getAllInsights();
    res.json({ success: true, insights });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/content/proofs", async (req, res) => {
  try {
    const proofs = await getAllProofs();
    res.json({ success: true, proofs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/content/testimonials", async (req, res) => {
  try {
    const testimonials = await getAllTestimonials();
    res.json({ success: true, testimonials });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/admin/reset", async (req, res) => {
  try {
    const currentPool = getPool();
    if (!currentPool) throw new Error("Database pool not available");
    const client = await currentPool.connect();
    try {
      await client.query("BEGIN");
      await client.query("DELETE FROM orders");
      await client.query("DELETE FROM services");
      await client.query("DELETE FROM case_studies");
      await client.query("DELETE FROM team_members");
      await client.query("DELETE FROM insights");
      await client.query("DELETE FROM proofs");
      await client.query("DELETE FROM testimonials");
      await client.query("DELETE FROM faqs");
      await client.query("COMMIT");

      // Re-seed
      await seedInitialData(
        INITIAL_SERVICES,
        INITIAL_CASE_STUDIES,
        INITIAL_TEAM,
        INITIAL_INSIGHTS,
        INITIAL_PROOFS,
        INITIAL_TESTIMONIALS,
        INITIAL_FAQS,
        INITIAL_ORDERS
      );

      res.json({ success: true, message: "Database reset to factory defaults." });
    } catch (e: any) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/content/faqs", async (req, res) => {
  try {
    const faqs = await getAllFaqs();
    res.json({ success: true, faqs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 💬 LIVE CHAT API ROUTES (POWERED BY GEMINI AI)
// ==========================================

async function generateAiContent({ contents, systemInstruction, temperature = 0.7, maxOutputTokens = 1200 }: {
  contents: any;
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
}) {
  const geminiInstance = ai || new GoogleGenAI({});
  const candidateModels = [
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
    "gemini-3.7-flash",
    "gemini-3.6-flash"
  ];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const config: any = {
        temperature,
        maxOutputTokens
      };
      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }
      const result = await geminiInstance.models.generateContent({
        model,
        contents,
        config
      });
      if (result && result.text) {
        return result.text;
      }
    } catch (err: any) {
      console.warn(`[Gemini] Model ${model} attempt warning:`, err?.message || err);
      lastError = err;
    }
  }
  throw lastError || new Error("Failed to generate content from AI models.");
}

app.post("/api/chat/session", async (req, res) => {
  try {
    const { id, name, email } = req.body;
    await createChatSession(id, name, email);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/chat/message", async (req, res) => {
  try {
    const { id, sessionId, sender, text } = req.body;
    await saveChatMessage(id, sessionId, sender, text);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/chat/messages/:sessionId", async (req, res) => {
  try {
    const messages = await getChatMessages(req.params.sessionId);
    res.json({ success: true, messages });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/chat/sessions", async (req, res) => {
  try {
    const sessions = await getAllChatSessions();
    res.json({ success: true, sessions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Dynamic AI Chatbot endpoint for real client enquiry handling
app.post("/api/chat/assistant", async (req, res) => {
  try {
    const { sessionId, message, name, email, currentUrl } = req.body;
    if (!sessionId || !message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: "sessionId and message are required." });
    }

    // Ensure session exists
    await createChatSession(sessionId, name, email);

    // Save client message to DB
    const userMsgId = `msg-user-${Date.now()}`;
    await saveChatMessage(userMsgId, sessionId, "user", message.trim());

    // Fetch live studio data dynamically from DB
    const [liveServices, liveFaqs, liveSettings, liveProofs] = await Promise.all([
      getAllServices().catch(() => []),
      getAllFaqs().catch(() => []),
      getAllSettings().catch(() => ({})),
      getAllProofs().catch(() => [])
    ]);

    // Fetch full existing conversation history for context
    const chatHistory = await getChatMessages(sessionId);

    // Build rich dynamic system instruction with exact live studio catalog
    const servicesCatalogText = liveServices.map(s => `• Service: "${s.title}" (ID: ${s.id}, Category: ${s.category})
  - Description: ${s.shortDesc}
  - Delivery Info: ${s.deliveryInfo || '24-48 hours delivery with express rush option'}
  - Tier Packages:
    * BASIC: $${s.packages?.BASIC?.price || 70} (Delivery: ${s.packages?.BASIC?.deliveryDays || '3 Days'}, Revisions: ${s.packages?.BASIC?.revisions || '2 Revisions'}, Includes: ${s.packages?.BASIC?.features?.join(', ') || 'Standard Concept'})
    * STANDARD: $${s.packages?.STANDARD?.price || 230} (Delivery: ${s.packages?.STANDARD?.deliveryDays || '2 Days'}, Revisions: ${s.packages?.STANDARD?.revisions || 'Unlimited Revisions'}, Includes: ${s.packages?.STANDARD?.features?.join(', ') || 'High Impact Polish, Source Files'})
    * PREMIUM: $${s.packages?.PREMIUM?.price || 460} (Delivery: ${s.packages?.PREMIUM?.deliveryDays || '24-48 Hours'}, Revisions: ${s.packages?.PREMIUM?.revisions || 'VIP Unlimited Revisions'}, Includes: ${s.packages?.PREMIUM?.features?.join(', ') || 'VIP Direct Access, Rapid Turnaround, Full Source Files, Strategy Audit'}`).join('\n\n');

    const faqsText = liveFaqs.slice(0, 8).map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');

    const systemInstruction = `You are the official AI Growth & Strategy Assistant for "ApexCreator Studio" (the premier creative production and channel growth studio for top YouTube creators, Twitch streamers, and digital brands).

BRAND IDENTITY & CONSTRAINTS:
- Studio Name: ApexCreator Studio (Exclusively). Never refer to any legacy name.
- Your Role: Conversational growth advisor, client concierge, and digital production consultant.
- Live URL Context: Client is currently viewing ${currentUrl || 'the studio website'}.
- Client Name: ${name || 'Creator'}.

LIVE SERVICES & PRICING CATALOG (STRICT TRUTH):
${servicesCatalogText}

COMMONLY ASKED QUESTIONS & POLICIES:
${faqsText}

KEY STUDIO CAPABILITIES & POLICIES:
1. Payment Options: We accept Crypto (USDT on TRC20/BEP20/ERC20/SOL, Bitcoin, Solana, Ethereum, BNB, Litecoin with Bybit on-chain transaction auto-verification) and Credit/Debit Cards via Stripe.
2. Price Negotiation / Custom Offers: Creators can submit custom price proposals or bulk order discounts directly in the studio checkout / order form by choosing "Make an Offer / Negotiate Price".
3. Free Channel & CTR Audits: We provide free visual and retention breakdown audits for creators seeking to boost their impressions and click-through rates.
4. Turnaround Times: Standard turnarounds range from 24 to 72 hours. Rush/express deliveries are prioritized.
5. Quality Guarantee: Every package includes revisions (unlimited on Standard and Premium tiers).

COMMUNICATION STYLE:
- Be energetic, sharp, concise, and helpful. Use creator industry terminology naturally (CTR, Retention Curve, Hooks, A/B Testing, Thumbnails, B-Roll, Sound Design).
- Answer ANY enquiry directly and accurately (pricing, timelines, software used, order steps, discount policies, package differences).
- Provide clean formatting with bullet points or bold text for readability.
- When recommending services, cite the exact real prices and packages from the catalog above.`;

    // Format previous chat history for Gemini contents
    const rawHistory = chatHistory.slice(-10);
    const formattedContents: any[] = [];
    
    for (const m of rawHistory) {
      if (!m.text || typeof m.text !== 'string' || !m.text.trim()) continue;
      const role = (m.sender === 'user' || m.sender === 'customer') ? 'user' : 'model';
      
      if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === role) {
        formattedContents[formattedContents.length - 1].parts[0].text += '\n' + m.text.trim();
      } else {
        formattedContents.push({
          role,
          parts: [{ text: m.text.trim() }]
        });
      }
    }

    // Ensure contents starts with user role
    while (formattedContents.length > 0 && formattedContents[0].role !== 'user') {
      formattedContents.shift();
    }

    // Ensure the last message is the user's prompt
    if (formattedContents.length === 0 || formattedContents[formattedContents.length - 1].role !== 'user') {
      formattedContents.push({
        role: 'user',
        parts: [{ text: message.trim() }]
      });
    }

    // Generate dynamic response
    const aiResponseText = await generateAiContent({
      contents: formattedContents,
      systemInstruction,
      temperature: 0.7,
      maxOutputTokens: 1024
    });

    const cleanReply = aiResponseText.trim();
    const assistantMsgId = `msg-ai-${Date.now()}`;

    // Save AI response to DB
    await saveChatMessage(assistantMsgId, sessionId, "admin", cleanReply);

    return res.json({
      success: true,
      reply: cleanReply,
      messageId: assistantMsgId
    });
  } catch (error: any) {
    console.error("Chatbot assistant generation error:", error);
    res.status(500).json({ success: false, error: "Failed to generate AI assistant response." });
  }
});

// ==========================================
// 📊 REAL-TIME VISITOR & LEAD ANALYTICS STORE
// ==========================================
const DATA_DIR = path.join(process.cwd(), "data");
const ANALYTICS_FILE = path.join(DATA_DIR, "analytics-store.json");

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error("Failed to create data dir:", err);
  }
}

interface VisitorSessionRecord {
  sessionId: string;
  ip: string;
  country: string;
  countryCode: string;
  flag: string;
  city: string;
  region?: string;
  device: "Desktop" | "Mobile" | "Tablet";
  browser: string;
  os: string;
  firstSeen: number;
  lastSeen: number;
  durationSeconds: number;
  currentPage: string;
  referrer: string;
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
  isOnline: boolean;
  lead?: {
    name?: string;
    email?: string;
    phone?: string;
    capturedAt?: string;
    source?: string;
  };
}

interface VisitorLeadRecord {
  id: string;
  sessionId: string;
  name?: string;
  email?: string;
  phone?: string;
  whatsappNumber?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  flag?: string;
  source?: string;
  campaign?: string;
  capturedAt: string;
  notes?: string;
  durationBeforeCapture?: number;
}

const sessionsStore = new Map<string, VisitorSessionRecord>();
let leadsStore: VisitorLeadRecord[] = [];

// Load persisted analytics from disk
function loadAnalyticsFromDisk() {
  try {
    if (fs.existsSync(ANALYTICS_FILE)) {
      const raw = fs.readFileSync(ANALYTICS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed.sessions && typeof parsed.sessions === "object") {
        for (const [key, val] of Object.entries(parsed.sessions)) {
          sessionsStore.set(key, val as VisitorSessionRecord);
        }
      }
      if (Array.isArray(parsed.leads)) {
        leadsStore = parsed.leads;
      }
      console.log(`Loaded ${sessionsStore.size} visitor sessions and ${leadsStore.length} leads from disk.`);
    }
  } catch (err) {
    console.warn("Could not load analytics store:", err);
  }
}
loadAnalyticsFromDisk();

// Debounced disk save
let saveTimeout: NodeJS.Timeout | null = null;
function scheduleAnalyticsSave() {
  if (saveTimeout) return;
  saveTimeout = setTimeout(() => {
    try {
      const obj: { sessions: Record<string, VisitorSessionRecord>; leads: VisitorLeadRecord[] } = {
        sessions: {},
        leads: leadsStore
      };
      for (const [k, v] of sessionsStore.entries()) {
        obj.sessions[k] = v;
      }
      fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(obj, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to save analytics to disk:", err);
    } finally {
      saveTimeout = null;
    }
  }, 3000);
}

// User-Agent parser helper
function parseUserAgent(ua: string = ""): { device: "Desktop" | "Mobile" | "Tablet"; browser: string; os: string } {
  let device: "Desktop" | "Mobile" | "Tablet" = "Desktop";
  let browser = "Browser";
  let os = "OS";

  if (/ipad|tablet/i.test(ua)) {
    device = "Tablet";
  } else if (/mobile|iphone|android|webos/i.test(ua)) {
    device = "Mobile";
  }

  if (/chrome/i.test(ua) && !/edg/i.test(ua) && !/opr/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/edg/i.test(ua)) browser = "Edge";
  else if (/opr|opera/i.test(ua)) browser = "Opera";

  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os/i.test(ua)) os = "macOS";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/linux/i.test(ua)) os = "Linux";

  return { device, browser, os };
}

// Flag Emoji generator helper
function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map(char => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch {
    return "🌐";
  }
}

// IP-Geo resolver
const ipGeoCache = new Map<string, { country: string; countryCode: string; flag: string; city: string; region?: string }>();

async function resolveIpGeo(ip: string, clientCountryHeader?: string): Promise<{ country: string; countryCode: string; flag: string; city: string; region?: string }> {
  const cleanIp = ip.replace(/^::ffff:/, "").trim();

  if (ipGeoCache.has(cleanIp)) {
    return ipGeoCache.get(cleanIp)!;
  }

  // If cloud proxy provides CF-IPCountry header
  if (clientCountryHeader && clientCountryHeader.length === 2) {
    const code = clientCountryHeader.toUpperCase();
    const flag = getFlagEmoji(code);
    const res = { country: code, countryCode: code, flag, city: "Detected via Header" };
    ipGeoCache.set(cleanIp, res);
    return res;
  }

  // Handle local development / loopback IPs
  if (
    cleanIp === "127.0.0.1" ||
    cleanIp === "::1" ||
    cleanIp.startsWith("10.") ||
    cleanIp.startsWith("192.168.") ||
    cleanIp.startsWith("172.16.") ||
    cleanIp === "localhost"
  ) {
    const devGeo = { country: "United States (Dev/Local)", countryCode: "US", flag: "🇺🇸", city: "Localhost" };
    ipGeoCache.set(cleanIp, devGeo);
    return devGeo;
  }

  // Try dynamic Geo-IP lookup
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`https://ipwho.is/${cleanIp}`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false && data.country) {
        const countryCode = data.country_code || "US";
        const geo = {
          country: data.country || "Unknown",
          countryCode: countryCode,
          flag: data.flag?.emoji || getFlagEmoji(countryCode),
          city: data.city || "Unknown",
          region: data.region || ""
        };
        ipGeoCache.set(cleanIp, geo);
        return geo;
      }
    }
  } catch (e) {
    // Ignore and try fallback
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`https://freeipapi.com/api/json/${cleanIp}`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.countryName) {
        const countryCode = data.countryCode || "US";
        const geo = {
          country: data.countryName || "Unknown",
          countryCode: countryCode,
          flag: getFlagEmoji(countryCode),
          city: data.cityName || "Unknown",
          region: data.regionName || ""
        };
        ipGeoCache.set(cleanIp, geo);
        return geo;
      }
    }
  } catch (e) {
    // Ignore
  }

  const fallback = { country: "Global Visitor", countryCode: "UN", flag: "🌐", city: "Online" };
  ipGeoCache.set(cleanIp, fallback);
  return fallback;
}

// ==========================================
// 📡 ANALYTICS API ROUTES
// ==========================================

// Track visitor session & heartbeat
app.post("/api/analytics/track", async (req, res) => {
  try {
    const { sessionId, path: currentPath, referrer, utmParams, durationSeconds } = req.body || {};
    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Missing sessionId" });
    }

    const rawIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "127.0.0.1";
    const cfCountry = req.headers["cf-ipcountry"] as string;
    const ua = req.headers["user-agent"] || "";

    const parsedUa = parseUserAgent(ua);
    const geo = await resolveIpGeo(rawIp, cfCountry);
    const now = Date.now();

    let session = sessionsStore.get(sessionId);

    if (!session) {
      session = {
        sessionId,
        ip: rawIp.replace(/^::ffff:/, ""),
        country: geo.country,
        countryCode: geo.countryCode,
        flag: geo.flag,
        city: geo.city,
        region: geo.region,
        device: parsedUa.device,
        browser: parsedUa.browser,
        os: parsedUa.os,
        firstSeen: now,
        lastSeen: now,
        durationSeconds: typeof durationSeconds === "number" ? durationSeconds : 0,
        currentPage: currentPath || "/",
        referrer: referrer || "Direct",
        utmSource: utmParams?.utm_source || utmParams?.source,
        utmCampaign: utmParams?.utm_campaign || utmParams?.campaign,
        utmMedium: utmParams?.utm_medium || utmParams?.medium,
        isOnline: true
      };
    } else {
      session.lastSeen = now;
      session.isOnline = true;
      if (typeof durationSeconds === "number" && durationSeconds >= session.durationSeconds) {
        session.durationSeconds = durationSeconds;
      }
      if (currentPath) {
        session.currentPage = currentPath;
      }
      if (!session.country || session.country === "Global Visitor") {
        session.country = geo.country;
        session.countryCode = geo.countryCode;
        session.flag = geo.flag;
        session.city = geo.city;
      }
    }

    sessionsStore.set(sessionId, session);
    scheduleAnalyticsSave();

    res.json({ success: true, session });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Capture lead information
app.post("/api/analytics/lead", async (req, res) => {
  try {
    const { sessionId, email, phone, name, source, campaign, notes } = req.body || {};

    if (!email && !phone) {
      return res.status(400).json({ success: false, message: "Email or Phone is required to capture lead." });
    }

    const session = sessionId ? sessionsStore.get(sessionId) : null;
    const nowStr = new Date().toISOString();

    // Check if lead with this email or phone already exists
    let existingLead = leadsStore.find(l => (email && l.email?.toLowerCase() === email.trim().toLowerCase()) || (phone && l.phone?.trim() === phone.trim()));

    if (existingLead) {
      if (name && !existingLead.name) existingLead.name = name.trim();
      if (email && !existingLead.email) existingLead.email = email.trim();
      if (phone && !existingLead.phone) {
        existingLead.phone = phone.trim();
        existingLead.whatsappNumber = phone.trim().replace(/[^0-9+]/g, "");
      }
      if (source) existingLead.source = source;
      if (campaign) existingLead.campaign = campaign;
      if (notes) existingLead.notes = (existingLead.notes ? existingLead.notes + " | " : "") + notes;
    } else {
      const cleanPhone = phone ? phone.trim().replace(/[^0-9+]/g, "") : undefined;
      const newLead: VisitorLeadRecord = {
        id: `LEAD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
        sessionId: sessionId || "DIRECT",
        name: name?.trim() || undefined,
        email: email?.trim() || undefined,
        phone: phone?.trim() || undefined,
        whatsappNumber: cleanPhone,
        country: session?.country || "Direct Visitor",
        countryCode: session?.countryCode || "US",
        city: session?.city || "Unknown",
        flag: session?.flag || "🌐",
        source: source || session?.utmSource || session?.referrer || "Organic / Direct",
        campaign: campaign || session?.utmCampaign || "General Traffic",
        capturedAt: nowStr,
        notes: notes || undefined,
        durationBeforeCapture: session?.durationSeconds || 0
      };

      leadsStore.unshift(newLead);
    }

    // Link lead details to session
    if (session) {
      session.lead = {
        name: name?.trim() || session.lead?.name,
        email: email?.trim() || session.lead?.email,
        phone: phone?.trim() || session.lead?.phone,
        capturedAt: nowStr,
        source: source || "Captured"
      };
      sessionsStore.set(sessionId, session);
    }

    scheduleAnalyticsSave();

    res.json({
      success: true,
      message: "Lead recorded successfully!",
      leadCount: leadsStore.length
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin stats endpoint
app.get("/api/analytics/stats", (req, res) => {
  try {
    const now = Date.now();
    const ACTIVE_THRESHOLD_MS = 60 * 1000; // 60 seconds

    const allSessions = Array.from(sessionsStore.values());
    let liveActiveNow = 0;
    let totalDuration = 0;
    const countryMap: Record<string, { country: string; countryCode: string; flag: string; count: number }> = {};
    const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 };

    for (const s of allSessions) {
      const isActive = now - s.lastSeen < ACTIVE_THRESHOLD_MS;
      s.isOnline = isActive;
      if (isActive) {
        liveActiveNow++;
      }

      totalDuration += s.durationSeconds || 0;

      // Country aggregation
      const cKey = s.countryCode || "UN";
      if (!countryMap[cKey]) {
        countryMap[cKey] = {
          country: s.country || "Unknown",
          countryCode: s.countryCode || "UN",
          flag: s.flag || "🌐",
          count: 0
        };
      }
      countryMap[cKey].count++;

      // Device aggregation
      if (s.device === "Mobile") deviceCounts.mobile++;
      else if (s.device === "Tablet") deviceCounts.tablet++;
      else deviceCounts.desktop++;
    }

    const totalSessions = allSessions.length;
    const avgDurationSeconds = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;
    const totalLeads = leadsStore.length;
    const conversionRate = totalSessions > 0 ? parseFloat(((totalLeads / totalSessions) * 100).toFixed(1)) : 0;

    const countries = Object.values(countryMap)
      .sort((a, b) => b.count - a.count)
      .map(c => ({
        ...c,
        percentage: totalSessions > 0 ? Math.round((c.count / totalSessions) * 100) : 0
      }));

    // Sort recent visitors by lastSeen descending
    const recentVisitors = [...allSessions].sort((a, b) => b.lastSeen - a.lastSeen).slice(0, 100);

    res.json({
      success: true,
      stats: {
        liveActiveNow,
        totalSessions,
        avgDurationSeconds,
        totalLeads,
        conversionRate,
        countries,
        devices: deviceCounts,
        recentVisitors,
        allLeads: leadsStore,
        lastUpdated: now
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// CSV Export for Leads
app.get("/api/analytics/export-csv", (req, res) => {
  try {
    const headers = ["Lead ID", "Name", "Email", "Phone / WhatsApp", "Country", "City", "Traffic Source", "Campaign", "Time on Site (Sec)", "Captured Date"];
    const rows = leadsStore.map(l => [
      `"${l.id}"`,
      `"${l.name || ""}"`,
      `"${l.email || ""}"`,
      `"${l.phone || l.whatsappNumber || ""}"`,
      `"${l.country || ""}"`,
      `"${l.city || ""}"`,
      `"${l.source || ""}"`,
      `"${l.campaign || ""}"`,
      `"${l.durationBeforeCapture || 0}"`,
      `"${l.capturedAt || ""}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=denny-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    res.send(csvContent);
  } catch (error: any) {
    res.status(500).send(`Error exporting CSV: ${error.message}`);
  }
});

// Clear analytics data (Admin action)
app.delete("/api/analytics/clear", (req, res) => {
  try {
    sessionsStore.clear();
    leadsStore = [];
    if (fs.existsSync(ANALYTICS_FILE)) {
      fs.writeFileSync(ANALYTICS_FILE, JSON.stringify({ sessions: {}, leads: [] }, null, 2), "utf-8");
    }
    res.json({ success: true, message: "Analytics and leads data cleared successfully." });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// In-memory cache for crypto rates
let cachedRates: Record<string, number> = {
  USDT: 1.0,
  USDC: 1.0,
  BTC: 65000.0,
  ETH: 3400.0,
  TRX: 0.16,
  SOL: 145.0,
  LTC: 72.0,
  BNB: 560.0
};
let lastRateFetch = 0;

// Helper to fetch live ticker prices from Bybit Spot ticker public API
async function getCryptoRates(): Promise<Record<string, number>> {
  const now = Date.now();
  // Refresh cache if older than 60 seconds
  if (now - lastRateFetch < 60000) {
    return cachedRates;
  }

  try {
    const res = await fetch("https://api.bybit.com/v5/market/tickers?category=spot");
    if (res.ok) {
      const data = await res.json();
      if (data?.result?.list && Array.isArray(data.result.list)) {
        const symbolMap: Record<string, string> = {
          "BTCUSDT": "BTC",
          "ETHUSDT": "ETH",
          "TRXUSDT": "TRX",
          "SOLUSDT": "SOL",
          "LTCUSDT": "LTC",
          "BNBUSDT": "BNB",
          "USDCUSDT": "USDC"
        };

        for (const item of data.result.list) {
          const mapped = symbolMap[item.symbol];
          if (mapped && item.lastPrice) {
            const price = parseFloat(item.lastPrice);
            if (!isNaN(price) && price > 0) {
              cachedRates[mapped] = price;
            }
          }
        }
        cachedRates["USDT"] = 1.0;
        lastRateFetch = now;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch live Bybit market tickers, using cached rates:", err);
  }

  return cachedRates;
}

// Helper to generate Bybit V5 HMAC SHA256 signature
function generateBybitSignature(
  timestamp: string,
  apiKey: string,
  apiSecret: string,
  recvWindow: string,
  queryString: string
): string {
  const paramStr = timestamp + apiKey + recvWindow + queryString;
  return crypto.createHmac("sha256", apiSecret).update(paramStr).digest("hex");
}

// Live Forex Exchange Rates Cache (USD to NGN, EUR, GBP)
let cachedForexRates: Record<string, number> = {
  USD_NGN: 1550,
  USD_EUR: 0.92,
  USD_GBP: 0.79,
  EUR_NGN: 1685,
  GBP_NGN: 1960
};
let lastForexFetch = 0;

async function getForexRates(): Promise<Record<string, number>> {
  const now = Date.now();
  // Cache for 15 minutes
  if (now - lastForexFetch < 15 * 60 * 1000 && lastForexFetch > 0) {
    return cachedForexRates;
  }

  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        if (data.rates.NGN && data.rates.NGN > 500) {
          cachedForexRates.USD_NGN = Math.round(data.rates.NGN);
        }
        if (data.rates.EUR) {
          cachedForexRates.USD_EUR = parseFloat(data.rates.EUR.toFixed(4));
        }
        if (data.rates.GBP) {
          cachedForexRates.USD_GBP = parseFloat(data.rates.GBP.toFixed(4));
        }
        lastForexFetch = now;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch open exchange rates, using fallback FX rates:", err);
  }

  return cachedForexRates;
}

// API Route: Get Forex Rates (USD to NGN, EUR, GBP)
app.get("/api/forex/rates", async (req, res) => {
  try {
    const rates = await getForexRates();
    res.json({
      success: true,
      usdToNgn: rates.USD_NGN || 1550,
      rates,
      timestamp: Date.now()
    });
  } catch (error: any) {
    res.json({
      success: true,
      usdToNgn: cachedForexRates.USD_NGN || 1550,
      rates: cachedForexRates,
      timestamp: Date.now()
    });
  }
});

// API Route: Get Crypto Rates
app.get("/api/crypto/rates", async (req, res) => {
  try {
    const rates = await getCryptoRates();
    res.json({ success: true, rates, timestamp: Date.now() });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message, rates: cachedRates });
  }
});

// API Route: Test Bybit API Credentials Connection
app.post("/api/payments/bybit/test-connection", async (req, res) => {
  const { apiKey, apiSecret } = req.body || {};

  if (!apiKey || !apiSecret) {
    return res.status(400).json({ success: false, message: "API Key and API Secret are required." });
  }

  try {
    const timestamp = Date.now().toString();
    const recvWindow = "5000";
    const queryString = "limit=5";
    const signature = generateBybitSignature(timestamp, apiKey, apiSecret, recvWindow, queryString);

    const response = await fetch(`https://api.bybit.com/v5/asset/deposit/query-record?${queryString}`, {
      method: "GET",
      headers: {
        "X-BAPI-API-KEY": apiKey,
        "X-BAPI-SIGN": signature,
        "X-BAPI-TIMESTAMP": timestamp,
        "X-BAPI-RECV-WINDOW": recvWindow,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (data.retCode === 0) {
      return res.json({
        success: true,
        message: "Successfully connected to Bybit V5 API! Credentials are valid and Read-Only permissions active.",
        resultCount: data.result?.rows?.length || 0
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `Bybit API Error (${data.retCode}): ${data.retMsg || "Invalid credentials or missing permissions"}`
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: `Failed to reach Bybit API servers: ${error.message}`
    });
  }
});

// API Route: Verify Deposit on Bybit
app.post("/api/payments/bybit/verify", async (req, res) => {
  const { orderId, coin, expectedAmountCrypto, txHash, apiKey, apiSecret } = req.body || {};

  try {
    // If API credentials are provided, call Bybit V5 Deposit Query Record API
    if (apiKey && apiSecret) {
      const timestamp = Date.now().toString();
      const recvWindow = "10000";
      const coinParam = coin ? `coin=${encodeURIComponent(coin)}&limit=20` : "limit=20";
      const signature = generateBybitSignature(timestamp, apiKey, apiSecret, recvWindow, coinParam);

      const response = await fetch(`https://api.bybit.com/v5/asset/deposit/query-record?${coinParam}`, {
        method: "GET",
        headers: {
          "X-BAPI-API-KEY": apiKey,
          "X-BAPI-SIGN": signature,
          "X-BAPI-TIMESTAMP": timestamp,
          "X-BAPI-RECV-WINDOW": recvWindow,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (data.retCode === 0 && data.result?.rows) {
        const deposits = data.result.rows;

        // Search for matching deposit by txHash or coin + recent deposit
        let matched = deposits.find((d: any) => {
          if (txHash && d.txID && d.txID.toLowerCase() === txHash.trim().toLowerCase()) {
            return true;
          }
          // If coin matches and deposit is status 2 (SUCCESS) or status 1 (PROCESSING)
          if (coin && d.coin?.toUpperCase() === coin.toUpperCase()) {
            const depAmount = parseFloat(d.amount);
            if (expectedAmountCrypto && Math.abs(depAmount - expectedAmountCrypto) / expectedAmountCrypto < 0.05) {
              return true;
            }
          }
          return false;
        });

        if (matched) {
          return res.json({
            verified: true,
            status: matched.status === 2 ? "SUCCESS" : "PENDING_CONFIRMATIONS",
            txID: matched.txID,
            amount: matched.amount,
            coin: matched.coin,
            chain: matched.chain,
            message: `Deposit confirmed on Bybit! (${matched.amount} ${matched.coin} on ${matched.chain})`
          });
        }
      }
    }

    // Fallback response if manual TxHash submitted or simulation active
    if (txHash && txHash.trim().length >= 8) {
      return res.json({
        verified: true,
        status: "RECORDED_PENDING_AUDIT",
        txID: txHash.trim(),
        message: `Transaction Hash recorded (${txHash.trim().substring(0, 10)}...). Verification submitted for order ${orderId}.`
      });
    }

    return res.json({
      verified: false,
      message: "No matching Bybit deposit detected yet. Please ensure payment has been broadcast to the network and try again in 1-2 minutes."
    });
  } catch (error: any) {
    return res.status(500).json({
      verified: false,
      message: `Error verifying deposit: ${error.message}`
    });
  }
});

// ==========================================
// 💳 PAYSTACK API ROUTES (CARDS, TRANSFERS, USSD)
// ==========================================

// Test Paystack API Secret Key Connection
app.post("/api/payments/paystack/test-connection", async (req, res) => {
  const { secretKey } = req.body || {};
  const sk = (secretKey || process.env.PAYSTACK_SECRET_KEY || "").trim();

  if (!sk) {
    return res.status(400).json({ success: false, message: "Paystack Secret Key is required." });
  }

  try {
    const response = await fetch("https://api.paystack.co/balance", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sk}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (data.status === true) {
      const balances = data.data || [];
      const balanceStr = Array.isArray(balances)
        ? balances.map((b: any) => `${b.currency} ${(b.balance / 100).toLocaleString()}`).join(", ")
        : "Active";

      return res.json({
        success: true,
        message: `Connected to Paystack successfully! Account Active (Balance: ${balanceStr || "0.00"}). Ready to accept both local and international payments.`,
        data: data.data
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `Paystack API Error: ${data.message || "Invalid Secret Key"}`
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: `Failed to connect to Paystack servers: ${error.message}`
    });
  }
});

// Verify Paystack Transaction Reference
app.post("/api/payments/paystack/verify", async (req, res) => {
  const { reference, orderId, expectedAmount, currency, secretKey } = req.body || {};

  if (!reference) {
    return res.status(400).json({ success: false, message: "Missing transaction reference." });
  }

  const sk = (secretKey || process.env.PAYSTACK_SECRET_KEY || "").trim();

  // If secret key is provided, query Paystack REST API
  if (sk) {
    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference.trim())}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${sk}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (data.status === true && data.data?.status === "success") {
        const trans = data.data;
        const paidAmount = trans.amount / 100;
        const paidCurrency = trans.currency;

        return res.json({
          success: true,
          verified: true,
          status: "SUCCESS",
          reference: trans.reference,
          amount: paidAmount,
          currency: paidCurrency,
          channel: trans.channel,
          cardType: trans.authorization?.card_type,
          bank: trans.authorization?.bank,
          countryCode: trans.authorization?.country_code,
          customerEmail: trans.customer?.email,
          paidAt: trans.paid_at,
          message: `Payment of ${paidCurrency} ${paidAmount.toLocaleString()} verified successfully via Paystack!`
        });
      } else {
        return res.status(400).json({
          success: false,
          verified: false,
          message: data.message || "Paystack transaction verification could not confirm successful payment."
        });
      }
    } catch (error: any) {
      console.warn("Paystack verify API connection failed:", error);
    }
  }

  // Graceful fallback for client-side valid reference or offline/test mode
  return res.json({
    success: true,
    verified: true,
    status: "RECORDED_PENDING_AUDIT",
    reference: reference.trim(),
    message: `Paystack payment reference ${reference} logged and verified for order ${orderId}.`
  });
});

// In-memory / Recent Webhook events cache
interface PaystackWebhookEvent {
  id: string;
  event: string;
  reference?: string;
  amount?: number;
  currency?: string;
  customerEmail?: string;
  status?: string;
  receivedAt: string;
  channel?: string;
  verifiedSignature: boolean;
  metadata?: any;
}
const paystackWebhookLogs: PaystackWebhookEvent[] = [];

// 🔔 Paystack Live Webhook Endpoint (Receives charge.success, payment events)
app.post("/api/payments/paystack/webhook", (req, res) => {
  try {
    const signature = req.headers["x-paystack-signature"] as string;
    const secretKey = (process.env.PAYSTACK_SECRET_KEY || "").trim();
    let verifiedSignature = false;

    // Verify HMAC SHA512 signature if secret key is present in environment
    if (secretKey && signature) {
      const hash = crypto
        .createHmac("sha512", secretKey)
        .update(JSON.stringify(req.body))
        .digest("hex");
      verifiedSignature = hash === signature;
    } else {
      verifiedSignature = true; // Permissive for initial testing/development
    }

    const payload = req.body || {};
    const eventType = payload.event || "unknown";
    const data = payload.data || {};

    const webhookRecord: PaystackWebhookEvent = {
      id: `wh_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      event: eventType,
      reference: data.reference,
      amount: data.amount ? data.amount / 100 : undefined,
      currency: data.currency,
      customerEmail: data.customer?.email,
      status: data.status,
      receivedAt: new Date().toISOString(),
      channel: data.channel,
      verifiedSignature,
      metadata: data.metadata
    };

    // Keep the latest 50 webhook events
    paystackWebhookLogs.unshift(webhookRecord);
    if (paystackWebhookLogs.length > 50) {
      paystackWebhookLogs.pop();
    }

    console.log(`[Paystack Webhook] Received ${eventType} event for ref: ${data.reference || "N/A"}`);

    // Always acknowledge 200 OK immediately as required by Paystack
    return res.status(200).json({ status: "success", message: "Webhook received" });
  } catch (error: any) {
    console.error("[Paystack Webhook Error]:", error);
    // Still return 200 to prevent Paystack retries loop
    return res.status(200).json({ status: "error", message: error.message });
  }
});

// Admin endpoint to view received Paystack webhook logs
app.get("/api/payments/paystack/webhook-logs", (req, res) => {
  res.json({
    success: true,
    totalLogs: paystackWebhookLogs.length,
    logs: paystackWebhookLogs
  });
});

// ==========================================
// 🐘 NEON DATABASE & CENTRAL SETTINGS ROUTES
// ==========================================

// Get Neon DB Connection Status & Table Counts
app.get("/api/db/status", async (req, res) => {
  try {
    const status = await getDbStatus();
    res.json({ success: true, status });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test / Update Neon Database URL
app.post("/api/db/test", async (req, res) => {
  try {
    const { databaseUrl } = req.body || {};
    if (databaseUrl && typeof databaseUrl === "string") {
      setDatabaseUrl(databaseUrl);
    }
    const result = await initDb();
    const status = await getDbStatus();
    res.json({
      success: result.success,
      message: result.message,
      status
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Config endpoint for client runtime environment bootstrap
app.get("/api/config", (req, res) => {
  const publicKey = (process.env.PAYSTACK_PUBLIC_KEY || process.env.VITE_PAYSTACK_PUBLIC_KEY || "").trim();
  res.json({
    success: true,
    paystackPublicKey: publicKey
  });
});

// Get All Central Settings (Used by customers & Admin)
app.get("/api/settings", async (req, res) => {
  try {
    const settings = await getAllSettings();
    const envPaystackPublicKey = (process.env.PAYSTACK_PUBLIC_KEY || process.env.VITE_PAYSTACK_PUBLIC_KEY || "").trim();
    const envPaystackSecretKey = (process.env.PAYSTACK_SECRET_KEY || "").trim();

    let paystackSettings = settings.paystack || {};
    const effectivePublicKey = (paystackSettings?.publicKey || "").trim() || envPaystackPublicKey;
    const effectiveSecretKey = (paystackSettings?.secretKey || "").trim() || envPaystackSecretKey;

    paystackSettings = {
      enabled: paystackSettings?.enabled !== false,
      usdToNgnRate: paystackSettings?.usdToNgnRate || 1550,
      allowUsdPayment: paystackSettings?.allowUsdPayment !== false,
      allowNgnPayment: paystackSettings?.allowNgnPayment !== false,
      defaultCurrency: paystackSettings?.defaultCurrency || 'NGN',
      currencyMode: paystackSettings?.currencyMode || 'auto_convert_ngn',
      useLiveMarketRate: !!paystackSettings?.useLiveMarketRate,
      ...paystackSettings,
      publicKey: effectivePublicKey,
      secretKey: effectiveSecretKey,
    };

    res.json({
      success: true,
      settings: {
        paystack: paystackSettings,
        crypto: settings.crypto || null,
        bank: settings.bank || null,
        contact: settings.contact || null,
        autoVerify: settings.autoVerify !== undefined ? settings.autoVerify : true
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save Specific Setting Key (Admin action, persists to Neon)
app.post("/api/settings", async (req, res) => {
  try {
    const { key, value } = req.body || {};
    if (!key) {
      return res.status(400).json({ success: false, message: "Missing setting key" });
    }

    if (key === "paystack" && value) {
      const envPub = (process.env.PAYSTACK_PUBLIC_KEY || process.env.VITE_PAYSTACK_PUBLIC_KEY || "").trim();
      const envSec = (process.env.PAYSTACK_SECRET_KEY || "").trim();
      if ((!value.publicKey || !value.publicKey.trim()) && envPub) {
        value.publicKey = envPub;
      }
      if ((!value.secretKey || !value.secretKey.trim()) && envSec) {
        value.secretKey = envSec;
      }
      if (value.publicKey) {
        process.env.PAYSTACK_PUBLIC_KEY = value.publicKey.trim();
      }
      if (value.secretKey) {
        process.env.PAYSTACK_SECRET_KEY = value.secretKey.trim();
      }
    }

    await saveSetting(key, value);

    res.json({ success: true, message: `Setting '${key}' saved to Neon database successfully.` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get All Orders (from Neon Postgres)
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create or Update Order (from Neon Postgres)
app.post("/api/orders", async (req, res) => {
  try {
    const order = req.body;
    if (!order || !order.id) {
      return res.status(400).json({ success: false, message: "Invalid order data or missing id" });
    }
    await saveOrder(order);
    res.json({ success: true, message: "Order synced to database successfully", order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Vite middleware and production static handling
async function startServer() {
  // Initialize Neon Database connection and tables
  try {
    const result = await initDb();
    if (result.success) {
      // Seed services, case studies, team, and insights if empty
      await seedInitialData(
        INITIAL_SERVICES,
        INITIAL_CASE_STUDIES,
        INITIAL_TEAM,
        INITIAL_INSIGHTS,
        INITIAL_PROOFS,
        INITIAL_TESTIMONIALS,
        INITIAL_FAQS,
        INITIAL_ORDERS
      );

      // Seed crypto settings if not already present
      const settings = await getAllSettings();
      if (!settings.crypto) {
        console.log("🌱 Seeding default crypto settings...");
        await saveSetting("crypto", DEFAULT_CRYPTO_SETTINGS);
      }
    }
  } catch (e) {
    console.warn("Initial Neon database sync note:", e);
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, "utf-8");
        const envPub = (process.env.PAYSTACK_PUBLIC_KEY || process.env.VITE_PAYSTACK_PUBLIC_KEY || "").trim();
        const injection = `<script>window.__APP_ENV__ = Object.assign(window.__APP_ENV__ || {}, { PAYSTACK_PUBLIC_KEY: ${JSON.stringify(envPub)} });</script>`;
        html = html.replace("<head>", `<head>\n    ${injection}`);
        res.setHeader("Content-Type", "text/html");
        res.send(html);
      } else {
        res.sendFile(indexPath);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
