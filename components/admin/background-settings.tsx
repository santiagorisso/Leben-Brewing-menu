"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getBackgroundSettings,
  saveBackgroundSettings,
  type BackgroundSettings,
  type BackgroundType,
} from "@/lib/background-settings";
import { useNotifications } from "./notification";

export function BackgroundSettings() {
  const [settings, setSettings] = useState<BackgroundSettings>({
    type: "black",
    snowSpeed: 5,
    snowOpacity: 50,
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
      const loadedSettings = await getBackgroundSettings();
      if (loadedSettings) {
        setSettings(loadedSettings);
      } else {
        setSettings({
          type: "black",
          snowSpeed: 5,
          snowOpacity: 50,
        });
      }
    } catch (error) {
      console.error("Error loading background settings:", error);
      setSettings({
        type: "black",
        snowSpeed: 5,
        snowOpacity: 50,
      });
      if (error instanceof Error && !error.message.includes("not found")) {
        showError(
          "Load Error",
          "Failed to load background settings. Using defaults."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const result = await saveBackgroundSettings(settings);

      if (result.success) {
        // Mensaje específico según el tipo de background
        let successMessage = "Background settings have been updated and will appear on the menu shortly.";
        if (settings.type === "snow") {
          successMessage = `Configuración de animación guardada exitosamente. Velocidad: ${settings.snowSpeed ?? 5}/10, Opacidad: ${settings.snowOpacity ?? 50}%. Los cambios se aplicarán en el menú en breve.`;
        }
        showSuccess(
          "Cambios guardados exitosamente",
          successMessage
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

  const handleTypeChange = (type: BackgroundType) => {
    setSettings({
      type,
      customName: type === "custom" ? settings.customName : undefined,
      customCss: type === "custom" ? settings.customCss : undefined,
    });
  };


  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading background settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Background Settings
        </h3>
        <p className="text-sm text-muted-foreground">
          Choose a background theme for the menu. Changes will be applied to the
          public menu.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Background Type</Label>
          <div className="mt-2 space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="backgroundType"
                value="black"
                checked={settings.type === "black"}
                onChange={() => handleTypeChange("black")}
                className="w-4 h-4"
              />
              <div>
                <span className="font-medium">Black (Default)</span>
                <p className="text-sm text-muted-foreground">
                  Classic black background
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="backgroundType"
                value="snow"
                checked={settings.type === "snow"}
                onChange={() => handleTypeChange("snow")}
                className="w-4 h-4"
              />
              <div>
                <span className="font-medium">Snow Animation</span>
                <p className="text-sm text-muted-foreground">
                  Animated snow effect for winter themes
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="backgroundType"
                value="custom"
                checked={settings.type === "custom"}
                onChange={() => handleTypeChange("custom")}
                className="w-4 h-4"
              />
              <div>
                <span className="font-medium">Custom CSS</span>
                <p className="text-sm text-muted-foreground">
                  Create your own custom background with CSS
                </p>
              </div>
            </label>
          </div>
        </div>

        {settings.type === "snow" && (
          <div className="space-y-4 border border-border rounded-lg p-4 bg-card">
            <div>
              <Label htmlFor="snowSpeed">
                Velocidad de caída: {settings.snowSpeed ?? 5} / 10
              </Label>
              <input
                type="range"
                id="snowSpeed"
                min="1"
                max="10"
                value={settings.snowSpeed ?? 5}
                onChange={(e) =>
                  setSettings({ ...settings, snowSpeed: parseInt(e.target.value) })
                }
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Lento</span>
                <span>Rápido</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Controla qué tan rápido caen los copos de nieve. 1 = muy lento, 10 = muy rápido.
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <Label htmlFor="snowOpacity">
                Opacidad de los copos: {settings.snowOpacity ?? 50}%
              </Label>
              <input
                type="range"
                id="snowOpacity"
                min="1"
                max="100"
                value={settings.snowOpacity ?? 50}
                onChange={(e) =>
                  setSettings({ ...settings, snowOpacity: parseInt(e.target.value) })
                }
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Transparente</span>
                <span>Opaco</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Controla qué tan visibles son los copos de nieve. 1 = muy transparente, 100 = completamente opaco.
              </p>
            </div>

          </div>
        )}

        {settings.type === "custom" && (
          <div className="space-y-4 border border-border rounded-lg p-4 bg-card">
            <div>
              <Label htmlFor="customName">Custom Theme Name</Label>
              <Input
                id="customName"
                value={settings.customName || ""}
                onChange={(e) =>
                  setSettings({ ...settings, customName: e.target.value })
                }
                placeholder="e.g., Summer Theme, Halloween, etc."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="customCss">Custom CSS</Label>
              <Textarea
                id="customCss"
                value={settings.customCss || ""}
                onChange={(e) =>
                  setSettings({ ...settings, customCss: e.target.value })
                }
                placeholder="Enter your custom CSS here..."
                className="mt-1 font-mono text-sm"
                rows={10}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This CSS will be applied to the body element. Use classes like
                .menu-background-wrapper for targeting.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-border">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="min-w-[120px]"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

