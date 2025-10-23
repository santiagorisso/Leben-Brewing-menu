import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get credentials
    const supabaseUrl = process.env.SUPABASE_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          error: "Missing environment variables",
          details: "Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables",
        },
        { status: 500 },
      )
    }

    // Create admin client
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Load mock data
    const { mockMenuData } = await import("@/lib/menu-data")

    // Upload to storage
    const jsonBlob = new Blob([JSON.stringify(mockMenuData, null, 2)], {
      type: "application/json",
    })

    const { error: uploadError } = await supabase.storage.from("menu-assets").upload("menu-data.json", jsonBlob, {
      contentType: "application/json",
      upsert: true,
    })

    if (uploadError) {
      return NextResponse.json(
        {
          error: "Upload failed",
          details: uploadError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Storage initialized successfully! You can now close this page and refresh your app.",
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Initialization failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
