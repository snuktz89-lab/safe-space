import { createClient } from '@supabase/supabase-js';

const configuredUrl = import.meta.env.VITE_SUPABASE_URL;
const configuredKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(
  configuredUrl && configuredKey
);

const supabaseUrl =
  configuredUrl || 'https://placeholder.supabase.co';

const supabaseAnonKey =
  configuredKey || 'placeholder-anon-key';

if (!supabaseConfigured) {
  console.warn(
    'Supabase environment variables are not loaded. Check .env and restart Vite.'
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);