"use client";

import { createClient } from "@supabase/supabase-js";

// Browser client — uses anon key (safe to expose).
// All server-side operations use the service role key.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseBrowser = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Supabase credentials not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

export { supabaseBrowser };


