import { createClient as createBrowserClient } from "@/lib/supabase/client";

const BACKGROUND_SETTINGS_FILE = "background-settings.json";
const BUCKET_NAME = "menu-assets";

export type BackgroundType = "black" | "snow" | "custom";

export interface BackgroundSettings {
  type: BackgroundType;
  customName?: string;
  customCss?: string;
  snowSpeed?: number; // Velocidad de caída (1-10, donde 1 es más lento y 10 es más rápido)
  snowOpacity?: number; // Opacidad de los copos (1-100, donde 1 es muy transparente y 100 es opaco)
  snowImages?: string[]; // URLs de las imágenes para los copos
}

export async function getBackgroundSettings(): Promise<BackgroundSettings | null> {
  try {
    const supabase = createBrowserClient();

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(BACKGROUND_SETTINGS_FILE);

    if (error) {
      if (
        error.message?.includes("not found") ||
        error.message?.includes("does not exist") ||
        error.name === "StorageApiError" ||
        error.name === "StorageUnknownError"
      ) {
        return {
          type: "black",
          snowSpeed: 5,
          snowOpacity: 50,
          snowImages: [],
        };
      }
      console.error("Error loading background settings:", error);
      return {
        type: "black",
        snowSpeed: 5,
        snowOpacity: 50,
        snowImages: [],
      };
    }

    if (!data) {
      return {
        type: "black",
        snowSpeed: 5,
        snowOpacity: 50,
        snowImages: [],
      };
    }

    const text = await data.text();
    const settings = JSON.parse(text);

    return {
      type: settings.type || "black",
      customName: settings.customName,
      customCss: settings.customCss,
      snowSpeed: settings.snowSpeed ?? 5, // Default: velocidad media (5)
      snowOpacity: settings.snowOpacity ?? 50, // Default: 50% de opacidad
      snowImages: settings.snowImages || [], // Array vacío por defecto, se usará el emoji si no hay imágenes
    };
  } catch (error) {
    console.error("Error parsing background settings:", error);
    return {
      type: "black",
      snowSpeed: 5,
      snowOpacity: 50,
      snowImages: [],
    };
  }
}

export async function saveBackgroundSettings(
  settings: BackgroundSettings
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createBrowserClient();

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

    const jsonBlob = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json",
    });

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(BACKGROUND_SETTINGS_FILE, jsonBlob, {
        upsert: true,
        contentType: "application/json",
      });

    if (error) {
      console.error("Error saving background settings:", error);
      return { success: false, error: error.message };
    }

    console.log("Background settings saved successfully");
    return { success: true };
  } catch (error) {
    console.error("Error saving background settings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

