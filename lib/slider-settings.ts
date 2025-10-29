import { createClient as createBrowserClient } from "@/lib/supabase/client";

const SLIDER_SETTINGS_FILE = "slider-settings.json";
const BUCKET_NAME = "menu-assets";

export interface SliderSettings {
  visible: boolean;
  text: string;
  animationDuration?: number;
  direction?: "left" | "right";
}

export async function getSliderSettings(): Promise<SliderSettings | null> {
  try {
    const supabase = createBrowserClient();

    // Fetch settings from Supabase Storage
    // Supabase Storage automatically handles cache freshness
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(SLIDER_SETTINGS_FILE);

    if (error) {
      // If file doesn't exist or bucket is not accessible, return default settings
      if (
        error.message?.includes("not found") ||
        error.message?.includes("does not exist") ||
        error.name === "StorageApiError" ||
        error.name === "StorageUnknownError"
      ) {
        // Return default settings when file doesn't exist
        return {
          visible: false,
          text: "",
          animationDuration: 25,
          direction: "left",
        };
      }
      console.error("Error loading slider settings:", error);
      // Return default settings on any error
      return {
        visible: false,
        text: "",
        animationDuration: 25,
        direction: "left",
      };
    }

    if (!data) {
      return {
        visible: false,
        text: "",
        animationDuration: 25,
        direction: "left",
      };
    }

    const text = await data.text();
    const settings = JSON.parse(text);

    return {
      visible: settings.visible ?? false,
      text: settings.text || "",
      animationDuration: settings.animationDuration || 25,
      direction: settings.direction || "left",
    };
  } catch (error) {
    console.error("Error parsing slider settings:", error);
    // Return default settings on any error
    return {
      visible: false,
      text: "",
      animationDuration: 25,
      direction: "left",
    };
  }
}

export async function saveSliderSettings(
  settings: SliderSettings
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createBrowserClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("User not authenticated:", authError?.message);
      return {
        success: false,
        error:
          "You must be logged in to save settings. Please log in and try again.",
      };
    }

    // Convert data to JSON blob
    const jsonBlob = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json",
    });

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(SLIDER_SETTINGS_FILE, jsonBlob, {
        upsert: true,
        contentType: "application/json",
      });

    if (error) {
      console.error("Error saving slider settings:", error);
      return { success: false, error: error.message };
    }

    console.log("Slider settings saved successfully");
    return { success: true };
  } catch (error) {
    console.error("Error saving slider settings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
