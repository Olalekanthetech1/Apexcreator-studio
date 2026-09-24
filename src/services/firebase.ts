import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  addDoc,
  Unsubscribe
} from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import {
  Order,
  OrderMessage,
  ChatSessionData,
  ChatMessageData,
  ServiceItem,
  ProofItem,
  Testimonial,
  FAQItem,
  CaseStudy,
  TeamMember,
  InsightArticle
} from "../types";
import { INITIAL_SERVICES, INITIAL_PROOFS, INITIAL_TESTIMONIALS, INITIAL_FAQS } from "../data/initialData";
import { INITIAL_CASE_STUDIES, INITIAL_TEAM, INITIAL_INSIGHTS } from "../data/strategicData";

const metaEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};

export const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyCCwfhn3uf-neGn5QuLXEjysTOcIM7ssSM",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "apexcreator-studio.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "apexcreator-studio",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "apexcreator-studio.firebasestorage.app",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "601802716684",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:601802716684:web:de5e7d1af7fef0801c6029",
  measurementId: metaEnv.VITE_FIREBASE_MEASUREMENT_ID || "G-LY8T51QLWQ"
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  // Pass database ID '(default)' explicitly to ensure correct Firestore database instance binding
  db = getFirestore(app, "(default)");
  auth = getAuth(app);
} catch (error) {
  console.warn("Firebase initialization note:", error);
}

export { app, db, auth };

// ==========================================
// 📦 FIRESTORE ORDERS SYNC
// ==========================================

export const subscribeToOrders = (callback: (orders: Order[]) => void): Unsubscribe => {
  if (!db) return () => {};
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef);
    return onSnapshot(
      q,
      (snapshot) => {
        const orders: Order[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Partial<Order>;
          orders.push({
            id: docSnap.id,
            customerName: data.customerName || 'Valued Customer',
            email: data.email || '',
            category: data.category || 'YouTube',
            serviceId: data.serviceId || '',
            serviceTitle: data.serviceTitle || 'Custom Service Package',
            packageType: data.packageType || 'STANDARD',
            price: typeof data.price === 'number' ? data.price : 230,
            offeredPrice: data.offeredPrice,
            isNegotiatedPrice: data.isNegotiatedPrice,
            negotiationNote: data.negotiationNote,
            socialUrl: data.socialUrl || '',
            projectDescription: data.projectDescription || '',
            preferredDeliveryDate: data.preferredDeliveryDate || '',
            createdAt: data.createdAt || new Date().toISOString(),
            expectedDeliveryDate: data.expectedDeliveryDate || '',
            paymentStatus: data.paymentStatus || 'Pending',
            paymentMethod: data.paymentMethod,
            paymentReference: data.paymentReference,
            status: data.status || 'Pending',
            deliverables: Array.isArray(data.deliverables) ? data.deliverables : [],
            messages: Array.isArray(data.messages) ? data.messages : []
          } as Order);
        });
        if (orders.length > 0) {
          callback(orders);
        }
      },
      (error) => {
        console.warn("Firestore orders listener warning (check rules if unauthenticated):", error);
      }
    );
  } catch (err) {
    console.warn("Could not attach Firestore orders listener:", err);
    return () => {};
  }
};

export const saveOrderToFirestore = async (order: Order): Promise<boolean> => {
  if (!db) return false;
  try {
    const orderDocRef = doc(db, "orders", order.id);
    await setDoc(orderDocRef, { ...order, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (err) {
    console.warn("Could not save order to Firestore:", err);
    return false;
  }
};

export const updateOrderInFirestore = async (orderId: string, updates: Partial<Order>): Promise<boolean> => {
  if (!db) return false;
  try {
    const orderDocRef = doc(db, "orders", orderId);
    await updateDoc(orderDocRef, { ...updates, updatedAt: new Date().toISOString() });
    return true;
  } catch (err) {
    console.warn("Could not update order in Firestore:", err);
    return false;
  }
};

// ==========================================
// 💬 FIRESTORE LIVE CHAT SYNC
// ==========================================

export const subscribeToChatMessages = (
  sessionId: string,
  callback: (messages: ChatMessageData[]) => void
): Unsubscribe => {
  if (!db || !sessionId) return () => {};
  try {
    const messagesRef = collection(db, "chat_sessions", sessionId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    return onSnapshot(
      q,
      (snapshot) => {
        const msgs: ChatMessageData[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          msgs.push({
            id: d.id,
            sessionId,
            sender: data.sender || "user",
            text: data.text || "",
            created_at: data.created_at || data.timestamp || new Date().toISOString()
          });
        });
        callback(msgs);
      },
      (err) => {
        console.warn("Firestore chat messages listener error:", err);
      }
    );
  } catch (e) {
    console.warn("Failed to subscribe to chat messages:", e);
    return () => {};
  }
};

export const sendChatMessageToFirestore = async (
  sessionId: string,
  message: { sender: "user" | "admin" | "system"; text: string; senderName?: string }
): Promise<boolean> => {
  if (!db || !sessionId) return false;
  try {
    // 1. Update session summary
    const sessionDocRef = doc(db, "chat_sessions", sessionId);
    await setDoc(
      sessionDocRef,
      {
        id: sessionId,
        lastMessage: message.text,
        updatedAt: new Date().toISOString(),
        lastSender: message.sender
      },
      { merge: true }
    );

    // 2. Add message to subcollection
    const messagesRef = collection(db, "chat_sessions", sessionId, "messages");
    await addDoc(messagesRef, {
      sessionId,
      sender: message.sender,
      text: message.text,
      senderName: message.senderName || (message.sender === "admin" ? "ApexCreator Support" : "User"),
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString()
    });

    return true;
  } catch (e) {
    console.warn("Failed to send chat message to Firestore:", e);
    return false;
  }
};

// ==========================================
// 🎯 FIRESTORE LEADS & VIP MAGNETS
// ==========================================

export const saveLeadToFirestore = async (leadData: {
  email: string;
  name?: string;
  phone?: string;
  serviceInterest?: string;
  source?: string;
}): Promise<boolean> => {
  if (!db) return false;
  try {
    const leadsRef = collection(db, "leads");
    await addDoc(leadsRef, {
      ...leadData,
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (e) {
    console.warn("Failed to save lead to Firestore:", e);
    return false;
  }
};

// ==========================================
// 📦 FIRESTORE DYNAMIC SERVICE CATALOG & CONTENT
// ==========================================

export const subscribeToServices = (callback: (services: ServiceItem[]) => void): Unsubscribe => {
  if (!db) return () => {};
  try {
    const servicesRef = collection(db, "services");
    return onSnapshot(
      servicesRef,
      (snapshot) => {
        const servicesList: ServiceItem[] = [];
        snapshot.forEach((docSnap) => {
          servicesList.push({ ...(docSnap.data() as ServiceItem), id: docSnap.id });
        });
        if (servicesList.length > 0) {
          callback(servicesList);
        }
      },
      (err) => {
        console.warn("Firestore services snapshot listener error:", err);
      }
    );
  } catch (err) {
    console.warn("Could not attach Firestore services listener:", err);
    return () => {};
  }
};

export const fetchServicesFromFirestore = async (): Promise<ServiceItem[]> => {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "services"));
    const list: ServiceItem[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as ServiceItem), id: d.id }));
    return list;
  } catch (e) {
    console.warn("Could not fetch services from Firestore:", e);
    return [];
  }
};

export const saveServiceToFirestore = async (service: ServiceItem): Promise<boolean> => {
  if (!db || !service.id) return false;
  try {
    await setDoc(doc(db, "services", service.id), service, { merge: true });
    return true;
  } catch (e) {
    console.warn("Could not save service to Firestore:", e);
    return false;
  }
};

export const deleteServiceFromFirestore = async (serviceId: string): Promise<boolean> => {
  if (!db || !serviceId) return false;
  try {
    const { deleteDoc } = await import("firebase/firestore");
    await deleteDoc(doc(db, "services", serviceId));
    return true;
  } catch (e) {
    console.warn("Could not delete service from Firestore:", e);
    return false;
  }
};

export const fetchCaseStudiesFromFirestore = async (): Promise<CaseStudy[]> => {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "case_studies"));
    const list: CaseStudy[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as CaseStudy), id: d.id }));
    return list;
  } catch (e) {
    return [];
  }
};

export const fetchTeamFromFirestore = async (): Promise<TeamMember[]> => {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "team"));
    const list: TeamMember[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as TeamMember), id: d.id }));
    return list;
  } catch (e) {
    return [];
  }
};

export const fetchInsightsFromFirestore = async (): Promise<InsightArticle[]> => {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "insights"));
    const list: InsightArticle[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as InsightArticle), id: d.id }));
    return list;
  } catch (e) {
    return [];
  }
};

export const fetchProofsFromFirestore = async (): Promise<ProofItem[]> => {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "proofs"));
    const list: ProofItem[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as ProofItem), id: d.id }));
    return list;
  } catch (e) {
    return [];
  }
};

export const fetchTestimonialsFromFirestore = async (): Promise<Testimonial[]> => {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "testimonials"));
    const list: Testimonial[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as Testimonial), id: d.id }));
    return list;
  } catch (e) {
    return [];
  }
};

export const fetchFaqsFromFirestore = async (): Promise<FAQItem[]> => {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "faqs"));
    const list: FAQItem[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as FAQItem), id: d.id }));
    return list;
  } catch (e) {
    return [];
  }
};

// Check if Firebase is initialized and available
export const isFirebaseConfigured = (): boolean => {
  return !!(db && firebaseConfig.projectId && firebaseConfig.apiKey);
};

