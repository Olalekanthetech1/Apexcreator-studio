import { AnalyticsStats } from '../types';
import { saveLeadToFirestore } from '../services/firebase';

const SESSION_KEY = 'denny_visitor_session_id';
const FIRST_SEEN_KEY = 'denny_visitor_first_seen';

// Get or create unique visitor session ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'SSR';
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = `V-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  if (!localStorage.getItem(FIRST_SEEN_KEY)) {
    localStorage.setItem(FIRST_SEEN_KEY, Date.now().toString());
  }
  return sid;
}

// Parse UTM and query parameters
export function getUrlParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((val, key) => {
    result[key.toLowerCase()] = val;
  });
  return result;
}

// Capture lead API call
export async function captureLead(leadData: {
  email?: string;
  phone?: string;
  name?: string;
  source?: string;
  campaign?: string;
  notes?: string;
}): Promise<boolean> {
  try {
    const sid = getSessionId();
    const urlParams = getUrlParams();

    const payload = {
      sessionId: sid,
      email: leadData.email?.trim(),
      phone: leadData.phone?.trim(),
      name: leadData.name?.trim(),
      source: leadData.source || urlParams['utm_source'] || urlParams['source'] || 'Website Interaction',
      campaign: leadData.campaign || urlParams['utm_campaign'] || urlParams['campaign'] || 'Direct Campaign',
      notes: leadData.notes
    };

    if (!payload.email && !payload.phone) return false;

    // Save lead to Firebase Cloud Firestore (realtime)
    saveLeadToFirestore({
      email: payload.email || '',
      name: payload.name,
      phone: payload.phone,
      source: payload.source,
      serviceInterest: payload.notes
    }).catch((e) => console.warn('Firestore lead save note:', e));

    const res = await fetch('/api/analytics/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return res.ok;
  } catch (err) {
    console.warn('Failed to capture lead:', err);
    return false;
  }
}

// Global variable to hold tracking heartbeat timer
let heartbeatInterval: any = null;
let durationTimer: any = null;
let activeSeconds = 0;
let isTabActive = true;
let isInitialized = false;

// Initialize analytics tracking
export function initAnalyticsTracker() {
  if (typeof window === 'undefined' || isInitialized) return;
  isInitialized = true;

  const sid = getSessionId();
  const urlParams = getUrlParams();
  const referrer = document.referrer || 'Direct';

  // 1. Auto-Capture pre-filled lead info from Ad / Campaign URLs
  const adEmail = urlParams['email'] || urlParams['mail'] || urlParams['user_email'];
  const adPhone = urlParams['phone'] || urlParams['tel'] || urlParams['whatsapp'] || urlParams['mobile'];
  const adName = urlParams['name'] || urlParams['full_name'] || urlParams['user_name'];

  if (adEmail || adPhone) {
    captureLead({
      email: adEmail,
      phone: adPhone,
      name: adName,
      source: `Ad / Link URL (${urlParams['utm_source'] || urlParams['source'] || 'Campaign Link'})`,
      campaign: urlParams['utm_campaign'] || urlParams['campaign'] || 'Auto-Detected'
    });
  }

  // 2. Initial Pageview Track
  const sendTrack = async () => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sid,
          path: window.location.pathname + window.location.hash,
          referrer,
          utmParams: urlParams,
          durationSeconds: activeSeconds
        })
      });
    } catch {
      // Ignore network failures
    }
  };

  sendTrack();

  // 3. Tab visibility handling & duration counting
  document.addEventListener('visibilitychange', () => {
    isTabActive = document.visibilityState === 'visible';
    if (isTabActive) {
      sendTrack();
    }
  });

  // Increment duration only when visitor is actively on page
  if (durationTimer) clearInterval(durationTimer);
  durationTimer = setInterval(() => {
    if (isTabActive) {
      activeSeconds++;
    }
  }, 1000);

  // Send heartbeat every 6 seconds to keep session alive and update duration
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  heartbeatInterval = setInterval(() => {
    if (isTabActive) {
      sendTrack();
    }
  }, 6000);

  // 4. Ghost Keystroke / Form Auto-Capture
  // When visitors start typing email or phone anywhere on the page, automatically save it after 1.5s
  let debounceTimeout: any = null;
  document.addEventListener('input', (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target || !target.value) return;

    const val = target.value.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const isPhone = target.type === 'tel' || (/^[+0-9\s-()]{7,20}$/.test(val) && val.replace(/[^0-9]/g, '').length >= 7);

    if (isEmail || isPhone) {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        captureLead({
          email: isEmail ? val : undefined,
          phone: isPhone ? val : undefined,
          source: 'Form Live Keystroke Auto-Capture'
        });
      }, 1500);
    }
  });

  // Track on exit
  window.addEventListener('beforeunload', () => {
    try {
      navigator.sendBeacon?.(
        '/api/analytics/track',
        JSON.stringify({
          sessionId: sid,
          path: window.location.pathname + window.location.hash,
          durationSeconds: activeSeconds
        })
      );
    } catch {
      // Ignore
    }
  });
}

// Fetch Admin Analytics Stats
export async function fetchAnalyticsStats(): Promise<AnalyticsStats | null> {
  try {
    const res = await fetch('/api/analytics/stats');
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.stats) {
      return data.stats;
    }
    return null;
  } catch (err) {
    console.error('Failed to fetch analytics stats:', err);
    return null;
  }
}

// Clear analytics data
export async function clearAnalyticsData(): Promise<boolean> {
  try {
    const res = await fetch('/api/analytics/clear', { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}
