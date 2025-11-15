// Auth guard - redirects to login if not authenticated
import { isAuthenticated, onAuthStateChange, initSupabase } from './auth.js';

// Load Supabase config
async function loadConfig() {
  try {
    const res = await fetch('/api/config');
    const config = await res.json();
    initSupabase(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
  } catch (e) {
    console.error('Failed to load config:', e);
  }
}

export async function requireAuth() {
  await loadConfig();
  
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

// Initialize auth guard on page load
export function initAuthGuard() {
  loadConfig().then(() => {
    onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        // Only redirect if we're not already on login page
        if (!window.location.pathname.includes('login.html')) {
          window.location.href = '/login.html';
        }
      }
    });
  });
}

