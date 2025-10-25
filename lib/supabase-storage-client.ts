import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { MenuData } from "./types";

const MENU_DATA_FILE = "menu-data.json";
const BUCKET_NAME = "menu-assets";

export async function getMenuData(): Promise<MenuData> {
  try {
    const supabase = createBrowserClient();

    // Try to fetch from Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(MENU_DATA_FILE);

    if (error) {
      console.log(
        "[v0] No menu data in storage, using mock data:",
        error.message
      );
      const { mockMenuData } = await import("./menu-data");
      return mockMenuData;
    }

    const text = await data.text();
    const menuData = JSON.parse(text);

    // Ensure all categories have proper order values
    const categoriesWithOrder = menuData.categories.map(
      (category: any, index: number) => ({
        ...category,
        order: category.order || `a${index}`,
      })
    );

    return {
      ...menuData,
      categories: categoriesWithOrder,
    };
  } catch (error) {
    console.log("[v0] Error loading menu data, using mock data:", error);
    const { mockMenuData } = await import("./menu-data");
    return mockMenuData;
  }
}

export async function saveMenuData(
  data: MenuData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createBrowserClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("[v0] User not authenticated:", authError?.message);
      return {
        success: false,
        error:
          "You must be logged in to save menu data. Please log in and try again.",
      };
    }

    // Ensure all categories have proper order values before saving
    const categoriesWithOrder = data.categories.map((category, index) => ({
      ...category,
      order: category.order || `a${index}`,
    }));

    const dataToSave = {
      ...data,
      categories: categoriesWithOrder,
    };

    // Convert data to JSON blob
    const jsonBlob = new Blob([JSON.stringify(dataToSave, null, 2)], {
      type: "application/json",
    });

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(MENU_DATA_FILE, jsonBlob, {
        upsert: true,
        contentType: "application/json",
      });

    if (error) {
      console.error("[v0] Error saving menu data:", error);
      return { success: false, error: error.message };
    }

    console.log("[v0] Menu data saved successfully");
    return { success: true };
  } catch (error) {
    console.error("[v0] Error saving menu data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function uploadAsset(
  file: File,
  path: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = createBrowserClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("[v0] User not authenticated:", authError?.message);
      return {
        success: false,
        error:
          "You must be logged in to upload assets. Please log in and try again.",
      };
    }

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        upsert: true,
      });

    if (error) {
      console.error("[v0] Error uploading asset:", error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error("[v0] Error uploading asset:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
