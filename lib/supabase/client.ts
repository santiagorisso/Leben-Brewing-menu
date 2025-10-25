import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl =
    process.env.SUPABASE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "";

  const supabaseAnonKey =
    process.env.SUPABASE_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "[v0] Missing Supabase environment variables. Please add SUPABASE_SUPABASE_URL and SUPABASE_SUPABASE_ANON_KEY to your .env.local file"
    );
    // Return a mock client for development
    return createBrowserClient(
      "https://placeholder.supabase.co",
      "placeholder_key"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
