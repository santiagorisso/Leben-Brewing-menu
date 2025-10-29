"use client";

import { useState, useEffect } from "react";
import { getSliderSettings } from "@/lib/slider-settings";

interface SliderSettings {
  visible: boolean;
  text: string;
  animationDuration: number;
  direction: "left" | "right";
}

interface InfiniteTextSliderProps {
  position: "top" | "bottom";
}

export function InfiniteTextSlider({ position }: InfiniteTextSliderProps) {
  const [settings, setSettings] = useState<SliderSettings>({
    visible: true,
    text: "Default scrolling text - Edit in admin panel",
    animationDuration: 25,
    direction: "left",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const sliderSettings = await getSliderSettings();
        if (sliderSettings) {
          setSettings({
            visible: sliderSettings.visible || false,
            text: sliderSettings.text || "",
            animationDuration: sliderSettings.animationDuration || 25,
            direction: sliderSettings.direction || "left",
          });
        } else {
          // Default to hidden if no settings
          setSettings({
            visible: false,
            text: "",
            animationDuration: 25,
            direction: "left",
          });
        }
      } catch (error) {
        console.error("Error loading slider settings:", error);
        // Set to hidden on error
        setSettings({
          visible: false,
          text: "",
          animationDuration: 25,
          direction: "left",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();

    // Poll for updates every 30 seconds
    const interval = setInterval(loadSettings, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading || !settings.visible || !settings.text) {
    return null;
  }

  // Top slider always goes left-to-right, bottom uses settings direction
  const animationClass =
    position === "top"
      ? "animate-slide-left"
      : settings.direction === "left"
      ? "animate-slide-left"
      : "animate-slide-right";

  return (
    <div
      className={`fixed ${
        position === "top" ? "top-0" : "bottom-0"
      } left-0 right-0 z-40 bg-black border-y border-gray-800 overflow-hidden h-10 md:h-12 flex items-center`}
    >
      <div
        className={`flex items-center whitespace-nowrap ${animationClass}`}
        style={{
          animationDuration: `${settings.animationDuration}s`,
        }}
      >
        {/* Duplicate content for seamless loop */}
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className="text-white text-sm md:text-base font-sans px-8"
            dangerouslySetInnerHTML={{ __html: settings.text }}
          />
        ))}
      </div>
    </div>
  );
}
