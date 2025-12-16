"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";
import { getMenuData } from "@/lib/supabase-storage-client";
import type { MenuData } from "@/lib/types";
import { MenuEditor } from "./menu-editor";
import { CategoryManagement } from "./category-management";
import { SliderSettings } from "./slider-settings";
import { BackgroundSettings } from "./background-settings";
import { NotificationContainer, useNotifications } from "./notification";

export function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [activeTab, setActiveTab] = useState<"categories" | "items" | "slider" | "background">(
    "categories"
  );
  const { notifications, dismissNotification, showSuccess, showError } =
    useNotifications();

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    try {
      const data = await getMenuData();
      setMenuData(data);
    } catch (error) {
      showError(
        "Load Error",
        "Failed to load menu data. Please refresh the page."
      );
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      showError("Sign Out Error", "Failed to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryUpdate = async (categories: any[]) => {
    if (menuData) {
      try {
        // Update local state immediately for UI responsiveness
        setMenuData({ ...menuData, categories });

        // Save to database
        const { saveMenuData } = await import("@/lib/supabase-storage-client");
        await saveMenuData({
          categories,
          lastUpdated: new Date().toISOString(),
        });

        showSuccess(
          "Categories Updated",
          "Category changes have been saved successfully"
        );
      } catch (error) {
        showError(
          "Save Error",
          "Failed to save category changes. Please try again."
        );
        // Reload data to revert changes
        loadMenuData();
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Notifications */}
      <NotificationContainer
        notifications={notifications}
        onDismiss={dismissNotification}
      />

      {/* Admin Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
            Menu Admin
          </h1>
          <Button variant="outline" onClick={handleSignOut} disabled={loading}>
            {loading ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </header>

      {/* Admin Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Menu Management
            </h2>
            <p className="mt-1 text-sm text-muted">
              Manage categories and menu items
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 rounded-lg bg-muted p-1">
            <button
              onClick={() => setActiveTab("categories")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                activeTab === "categories"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab("items")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                activeTab === "items"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Menu Items
            </button>
            <button
              onClick={() => setActiveTab("slider")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                activeTab === "slider"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Text Slider
            </button>
            <button
              onClick={() => setActiveTab("background")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                activeTab === "background"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Background
            </button>
          </div>

          {menuData ? (
            <>
              {activeTab === "categories" && (
                <CategoryManagement
                  categories={menuData.categories}
                  onUpdate={handleCategoryUpdate}
                  onShowNotification={(type, title, message) => {
                    if (type === "success") {
                      showSuccess(title, message);
                    } else {
                      showError(title, message);
                    }
                  }}
                />
              )}

              {activeTab === "items" && (
                <MenuEditor
                  data={menuData}
                  onUpdate={loadMenuData}
                  onShowNotification={(type, title, message) => {
                    if (type === "success") {
                      showSuccess(title, message);
                    } else {
                      showError(title, message);
                    }
                  }}
                />
              )}

              {activeTab === "slider" && <SliderSettings />}
              {activeTab === "background" && <BackgroundSettings />}
            </>
          ) : (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <p className="text-muted">Loading menu data...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
