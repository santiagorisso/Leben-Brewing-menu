"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getSliderSettings,
  saveSliderSettings,
  type SliderSettings,
} from "@/lib/slider-settings";
import { useNotifications } from "./notification";

export function SliderSettings() {
  const [settings, setSettings] = useState<SliderSettings>({
    visible: false,
    text: "",
    animationDuration: 25,
    direction: "left",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const loadedSettings = await getSliderSettings();
      if (loadedSettings) {
        setSettings(loadedSettings);
      } else {
        // Initialize with defaults if no settings found
        setSettings({
          visible: false,
          text: "",
          animationDuration: 25,
          direction: "left",
        });
      }
    } catch (error) {
      console.error("Error loading slider settings:", error);
      // Initialize with defaults on error
      setSettings({
        visible: false,
        text: "",
        animationDuration: 25,
        direction: "left",
      });
      // Only show error if it's not a "file not found" case
      if (error instanceof Error && !error.message.includes("not found")) {
        showError(
          "Load Error",
          "Failed to load slider settings. Using defaults."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const result = await saveSliderSettings(settings);

      if (result.success) {
        showSuccess(
          "Changes saved successfully",
          "Slider settings have been updated and will appear on the menu shortly."
        );
      } else {
        showError("Save Error", result.error || "Failed to save settings.");
      }
    } catch (error) {
      showError(
        "Save Error",
        error instanceof Error ? error.message : "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading slider settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Infinite Text Slider</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Configure the scrolling text banner that appears at the top and bottom
          of the menu. You can use simple HTML tags like{" "}
          <code className="bg-gray-100 px-1 rounded">&lt;b&gt;</code>,{" "}
          <code className="bg-gray-100 px-1 rounded">&lt;i&gt;</code>,{" "}
          <code className="bg-gray-100 px-1 rounded">&lt;span&gt;</code> for
          formatting.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="visible"
            checked={settings.visible}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, visible: checked as boolean })
            }
          />
          <Label htmlFor="visible" className="font-medium cursor-pointer">
            Show slider on menu
          </Label>
        </div>

        {settings.visible && (
          <>
            <div className="space-y-2">
              <Label htmlFor="text">Slider Text</Label>
              <Textarea
                id="text"
                value={settings.text}
                onChange={(e) =>
                  setSettings({ ...settings, text: e.target.value })
                }
                placeholder="Enter text to display in the slider. Use HTML tags for formatting: <b>bold</b>, <i>italic</i>, <span style='color: #ff0000'>colored text</span>"
                rows={4}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Example: Welcome to <b>Leben Brewing</b> - Fresh beer every day!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Animation Duration (seconds)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="10"
                  max="60"
                  value={settings.animationDuration || 25}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      animationDuration: parseInt(e.target.value) || 25,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  How long it takes for one complete scroll (10-60 seconds)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direction">Direction</Label>
                <select
                  id="direction"
                  value={settings.direction || "left"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      direction: e.target.value as "left" | "right",
                    })
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="left">Left to Right</option>
                  <option value="right">Right to Left</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <div className="bg-black text-white p-2 rounded overflow-hidden">
                <div
                  className="text-sm whitespace-nowrap"
                  dangerouslySetInnerHTML={{
                    __html: settings.text || "Preview text...",
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
