import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Read purely from standard Next.js environment variables (.env.local / Vercel Environment Variables)
export function getSupabaseCredentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && anonKey && url !== 'https://your-project-id.supabase.co') {
    return { url, anonKey };
  }

  return null;
}

export function createClient() {
  const creds = getSupabaseCredentials();
  if (!creds) {
    return null;
  }
  return createSupabaseClient(creds.url, creds.anonKey);
}
