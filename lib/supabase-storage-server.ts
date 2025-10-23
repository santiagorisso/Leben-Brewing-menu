import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { MenuData } from "./types"

const MENU_DATA_FILE = "menu-data.json"
const BUCKET_NAME = "menu-assets"

function createAdminClient() {
  const supabaseUrl = process.env.SUPABASE_SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase admin credentials")
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Server-side version for initial data loading
export async function getMenuDataServer(): Promise<MenuData> {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase.storage.from(BUCKET_NAME).download(MENU_DATA_FILE)

    if (error) {
      const isNotFound =
        error.name === "StorageUnknownError" ||
        error.message?.toLowerCase().includes("not found") ||
        error.message?.toLowerCase().includes("404")

      if (isNotFound) {
        console.log("[v0] Menu data not found, initializing storage with mock data...")
        const { mockMenuData } = await import("./menu-data")

        try {
          const adminClient = createAdminClient()

          const jsonBlob = new Blob([JSON.stringify(mockMenuData, null, 2)], {
            type: "application/json",
          })

          const { error: uploadError } = await adminClient.storage.from(BUCKET_NAME).upload(MENU_DATA_FILE, jsonBlob, {
            contentType: "application/json",
            upsert: true,
          })

          if (uploadError) {
            console.log("[v0] Failed to initialize storage:", uploadError.message)
          } else {
            console.log("[v0] Storage initialized successfully!")
          }
        } catch (adminError) {
          console.log("[v0] Could not initialize storage (check service role key):", adminError)
        }

        return mockMenuData
      }

      // For other errors, fall back to mock data
      const { mockMenuData } = await import("./menu-data")
      return mockMenuData
    }

    const text = await data.text()
    return JSON.parse(text)
  } catch (error) {
    console.log("[v0] Error loading menu data:", error)
    const { mockMenuData } = await import("./menu-data")
    return mockMenuData
  }
}
