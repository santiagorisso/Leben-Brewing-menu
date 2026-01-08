"use client";

import { useState } from "react";
import type { MenuData, MenuCategory } from "@/lib/types";
import { CategoryEditor } from "./category-editor";
import { sortByOrder } from "@/lib/fractional-index";
import { Button } from "@/components/ui/button";
import { saveMenuData } from "@/lib/supabase-storage-client";

interface MenuEditorProps {
  data: MenuData;
  onUpdate: () => void;
  onShowNotification?: (
    type: "success" | "error",
    title: string,
    message?: string
  ) => void;
}

export function MenuEditor({
  data,
  onUpdate,
  onShowNotification,
}: MenuEditorProps) {
  const [categories, setCategories] = useState(data.categories);
  const [saving, setSaving] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  // Initialize showInactive from localStorage on mount
  useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("adminShowInactive");
      if (saved !== null) {
        setShowInactive(saved === "true");
      }
    }
  });

  const handleToggleInactive = () => {
    const newValue = !showInactive;
    setShowInactive(newValue);
    localStorage.setItem("adminShowInactive", String(newValue));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveMenuData({
        categories,
        lastUpdated: new Date().toISOString(),
      });
      onUpdate();
      onShowNotification?.(
        "success",
        "Changes Saved",
        "Menu data has been saved successfully"
      );
    } catch (error) {
      console.error("[v0] Error saving menu data:", error);
      onShowNotification?.(
        "error",
        "Save Error",
        "Failed to save menu data. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryUpdate = (updatedCategory: MenuCategory) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
    );
  };
  
  const handleAutoSave = async (updatedCategory: MenuCategory) => {
    // Optimistically update local state first
    const updatedCategories = categories.map((cat) => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    );
    setCategories(updatedCategories);
    
    // Perform background save
    try {
      await saveMenuData({
        categories: updatedCategories,
        lastUpdated: new Date().toISOString(),
      });
      // Optional: Silent success or subtle indicator
    } catch (error) {
      console.error("[v0] Auto-save error:", error);
      onShowNotification?.(
        "error",
        "Auto-Save Failed",
        "Failed to save changes automatically."
      );
    }
  };

  const sortedCategories = sortByOrder(categories);

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-4">
        <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showInactive"
              checked={showInactive}
              onChange={handleToggleInactive}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="showInactive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Show Inactive Items
            </label>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-8">
        {sortedCategories.map((category) => (
          <CategoryEditor
            key={category.id}
            category={category}
            onUpdate={handleCategoryUpdate}
            onAutoSave={handleAutoSave}
            showInactive={showInactive}
          />
        ))}
      </div>
    </div>
  );
}
