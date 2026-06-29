// Simple client-side analytics helper

const API_URL = process.env.NEXT_PUBLIC_ANALYTICS_API_URL || 'http://localhost:8000/api/analytics/track';

// Helper to set a cookie
function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

// Helper to get a cookie
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Helper to generate a simple UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Get or create visitor ID (Permanent Cookie + LocalStorage fallback)
export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';

  let visitorId = getCookie('eb_visitor_id');

  if (!visitorId) {
    visitorId = localStorage.getItem('eb_visitor_id');
  }

  if (!visitorId) {
    visitorId = generateUUID();
  }

  // Renew/set for 10 years (3650 days)
  setCookie('eb_visitor_id', visitorId, 3650);
  localStorage.setItem('eb_visitor_id', visitorId);

  return visitorId;
}

// Detect Client OS
function getOS(ua: string): string {
  if (ua.indexOf('Win') !== -1) return 'Windows';
  if (ua.indexOf('Mac') !== -1) return 'macOS';
  if (ua.indexOf('X11') !== -1 || ua.indexOf('Linux') !== -1) return 'Linux';
  if (ua.indexOf('Android') !== -1) return 'Android';
  if (ua.indexOf('iPod') !== -1 || ua.indexOf('iPad') !== -1 || ua.indexOf('iPhone') !== -1) return 'iOS';
  return 'Unknown OS';
}

// Detect Client Browser
function getBrowser(ua: string): string {
  if (ua.indexOf('Firefox') !== -1) return 'Firefox';
  if (ua.indexOf('SamsungBrowser') !== -1) return 'Samsung Browser';
  if (ua.indexOf('Opera') !== -1 || ua.indexOf('OPR') !== -1) return 'Opera';
  if (ua.indexOf('Trident') !== -1) return 'Internet Explorer';
  if (ua.indexOf('Edge') !== -1 || ua.indexOf('Edg') !== -1) return 'Microsoft Edge';
  if (ua.indexOf('Chrome') !== -1) return 'Google Chrome';
  if (ua.indexOf('Safari') !== -1) return 'Safari';
  return 'Unknown Browser';
}

// Detect Device Category
function getDevice(): string {
  if (typeof window === 'undefined') return 'Desktop';
  const width = window.innerWidth;
  if (width < 768) return 'Mobile';
  if (width < 1024) return 'Tablet';
  return 'Desktop';
}

// Send event data to Laravel API
export async function trackEvent(eventType: string, eventValue?: string) {
  if (typeof window === 'undefined') return;

  try {
    const visitorCookie = getVisitorId();
    const userAgent = navigator.userAgent;
    
    const payload = {
      visitor_cookie: visitorCookie,
      ip_address: null, // Let Laravel controller resolve this via request
      user_agent: userAgent,
      browser: getBrowser(userAgent),
      os: getOS(userAgent),
      device: getDevice(),
      referrer: document.referrer || '',
      event_type: eventType,
      event_value: eventValue || '',
    };

    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true, // Non-blocking page unload safety
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}
