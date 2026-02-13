import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type GlobalWithSupabase = typeof globalThis & {
  __lovableSupabase?: SupabaseClient<Database>;
};

const g = globalThis as GlobalWithSupabase;

export const supabase =
  g.__lovableSupabase ??
  createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  });

// Prevent multiple clients/timers during hot reload in preview
if (import.meta.env.DEV) {
  g.__lovableSupabase = supabase;
}
