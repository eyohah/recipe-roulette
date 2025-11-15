// Authentication utilities using Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Initialize Supabase client (will be set after config loads)
let supabaseClient = null;

export function initSupabase(url, key) {
  if (url && key) {
    supabaseClient = createClient(url, key);
    return supabaseClient;
  }
  return null;
}

export function getSupabase() {
  if (!supabaseClient) {
    // Try to get from window if already loaded
    const url = window.SUPABASE_URL;
    const key = window.SUPABASE_ANON_KEY;
    if (url && key) {
      supabaseClient = createClient(url, key);
    }
  }
  return supabaseClient;
}

const supabase = {
  get auth() {
    const client = getSupabase();
    if (!client) throw new Error('Supabase not initialized. Load config first.');
    return client.auth;
  }
};

// Check if user is authenticated
export async function isAuthenticated() {
  const client = getSupabase();
  if (!client) return false;
  const { data: { session } } = await client.auth.getSession();
  return !!session;
}

// Get current user
export async function getCurrentUser() {
  const client = getSupabase();
  if (!client) return null;
  const { data: { user } } = await client.auth.getUser();
  return user;
}

// Sign up with email and password
export async function signUp(email, password) {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not initialized');
  const { data, error } = await client.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// Sign in with email and password
export async function signIn(email, password) {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not initialized');
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// Sign out
export async function signOut() {
  const client = getSupabase();
  if (!client) return;
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

// Listen to auth state changes
export function onAuthStateChange(callback) {
  const client = getSupabase();
  if (!client) return { data: { subscription: null }, unsubscribe: () => {} };
  return client.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

// Get session token for API calls
export async function getSessionToken() {
  const client = getSupabase();
  if (!client) return null;
  const { data: { session } } = await client.auth.getSession();
  return session?.access_token || null;
}

