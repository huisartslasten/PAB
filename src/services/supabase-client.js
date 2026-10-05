// Single Supabase client boundary for the refactored application.
// The existing V4.78 runtime still owns the client until the service migration is verified.

const SUPABASE_URL = 'https://ncpkqrvxljxwboavxtak.supabase.co';
const SUPABASE_KEY = 'sb_publishable_skiKpO4UU79zWY7hskHsoA_WQxA6CFc';

export function createSupabaseClient(supabaseLib = window.supabase) {
  if (!supabaseLib?.createClient) {
    throw new Error('Supabase library is not available.');
  }
  return supabaseLib.createClient(SUPABASE_URL, SUPABASE_KEY);
}

export function createPhotoSessionClient(token, supabaseLib = window.supabase) {
  if (!supabaseLib?.createClient) {
    throw new Error('Supabase library is not available.');
  }
  return supabaseLib.createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: {
      headers: { 'x-photo-token': String(token || '') }
    }
  });
}

export const supabaseConfig = Object.freeze({
  url: SUPABASE_URL,
  publishableKey: SUPABASE_KEY
});
