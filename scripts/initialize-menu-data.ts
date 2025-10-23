import { createClient } from "@supabase/supabase-js"
import { mockMenuData } from "../lib/menu-data"

// This script initializes the Supabase Storage bucket with the mock menu data
async function initializeMenuData() {
  const supabaseUrl = process.env.SUPABASE_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log("Initializing menu data in Supabase Storage...")

  // Convert mock data to JSON blob
  const jsonBlob = new Blob([JSON.stringify(mockMenuData, null, 2)], {
    type: "application/json",
  })

  // Upload to Supabase Storage
  const { error } = await supabase.storage.from("menu-assets").upload("menu-data.json", jsonBlob, {
    upsert: true,
    contentType: "application/json",
  })

  if (error) {
    console.error("Error uploading menu data:", error)
    process.exit(1)
  }

  console.log("✅ Menu data initialized successfully!")
  console.log("You can now view and edit the menu through the admin panel.")
}

initializeMenuData()
