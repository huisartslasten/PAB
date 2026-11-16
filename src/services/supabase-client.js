// Single Supabase client boundary for the refactored application.
// Runtime selects the canonical Supabase project from the host environment.
// LIVE is used only on the production PacoGO host; local/TEST environments stay on TEST.

const TEST_SUPABASE_URL = 'https://btnhhvtpmuvrpbnkyjnm.supabase.co';
const TEST_SUPABASE_KEY = 'sb_publishable_g9VPrXM9Mn-Phf625whFrQ_6CA8yUMH';

const LIVE_SUPABASE_URL = 'https://ncpkqrvxljxwboavxtak.supabase.co';
const LIVE_SUPABASE_KEY = 'sb_publishable_skiKpO4UU79zWY7hskHsoA_WQxA6CFc';

function isLiveHost() {
  if (typeof window === 'undefined') return false;
  const hostname = String(window.location?.hostname || '').toLowerCase();
  return hostname === 'pacogo.org' || hostname === 'www.pacogo.org';
}

const SUPABASE_URL = isLiveHost() ? LIVE_SUPABASE_URL : TEST_SUPABASE_URL;
const SUPABASE_KEY = isLiveHost() ? LIVE_SUPABASE_KEY : TEST_SUPABASE_KEY;

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
