// Single Supabase client boundary for the refactored application.
// The LIVE site intentionally uses the existing TEST Supabase project after cutover.
// Keep one canonical backend across local, TEST and production hosts.

const SUPABASE_URL = 'https://btnhhvtpmuvrpbnkyjnm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_g9VPrXM9Mn-Phf625whFrQ_6CA8yUMH';

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
