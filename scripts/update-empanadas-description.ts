import { createClient } from "@supabase/supabase-js";
import { getMenuData } from "../lib/supabase-storage-client";

// This script updates the empanadas category description to use <br> instead of \n
// and removes \n before <b> tags so prices stay on the same line
async function updateEmpanadasDescription() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    console.error("Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Fetching current menu data...");

  try {
    // Get current menu data
    const { data, error: downloadError } = await supabase.storage
      .from("menu-assets")
      .download("menu-data.json");

    if (downloadError) {
      console.error("Error downloading menu data:", downloadError);
      process.exit(1);
    }

    const text = await data.text();
    const menuData = JSON.parse(text);

    // Find empanadas category
    const empanadasCategory = menuData.categories.find(
      (cat: any) => cat.slug === "empanadas"
    );

    if (!empanadasCategory) {
      console.error("Empanadas category not found");
      process.exit(1);
    }

    console.log("Current description:", empanadasCategory.description);

    // Update description: remove \n before <b> tags, add " - " separator, and convert remaining \n to <br>
    let updatedDescription = empanadasCategory.description || "";
    
    // Remove \n that are immediately before <b> tags (with optional whitespace)
    // Add " - " separator before prices to keep them on the same line
    updatedDescription = updatedDescription.replace(/\n\s*<b>/g, " - <b>");
    
    // Handle cases where <b> is on the same line: add " - " if not already present
    updatedDescription = updatedDescription.replace(/([^-\s>])\s+(?!- )<b>/g, "$1 - <b>");
    
    // Convert remaining \n to <br> for line breaks
    updatedDescription = updatedDescription.replace(/\n/g, "<br>");

    console.log("Updated description:", updatedDescription);

    // Update the category
    empanadasCategory.description = updatedDescription;

    // Ensure all categories have proper order values
    const categoriesWithOrder = menuData.categories.map(
      (category: any, index: number) => ({
        ...category,
        order: category.order || `a${index}`,
      })
    );

    const dataToSave = {
      ...menuData,
      categories: categoriesWithOrder,
      lastUpdated: new Date().toISOString(),
    };

    // Convert data to JSON blob
    const jsonBlob = new Blob([JSON.stringify(dataToSave, null, 2)], {
      type: "application/json",
    });

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("menu-assets")
      .upload("menu-data.json", jsonBlob, {
        upsert: true,
        contentType: "application/json",
      });

    if (uploadError) {
      console.error("Error uploading updated menu data:", uploadError);
      process.exit(1);
    }

    console.log("✅ Empanadas description updated successfully!");
    console.log("The description now uses <br> for line breaks, adds ' - ' separator before prices, and prices stay on the same line.");
  } catch (error) {
    console.error("Error updating empanadas description:", error);
    process.exit(1);
  }
}

updateEmpanadasDescription();

