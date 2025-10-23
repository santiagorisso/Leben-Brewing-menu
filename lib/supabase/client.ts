import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_SUPABASE_URL || ""

  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "[v0] Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    )
    throw new Error(
      "@supabase/ssr: Your project's URL and API key are required to create a Supabase client! Check your Supabase project's API settings to find these values https://supabase.com/dashboard/project/_/settings/api",
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
