"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
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
    visible: false,
    text: "",
    animationDuration: 24,
    direction: "left",
  });
  const [loading, setLoading] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const pathname = usePathname();

  // Use refs to track previous values and prevent unnecessary updates
  const previousTextRef = useRef<string>("");
  const previousDurationRef = useRef<number>(24);
  const previousDirectionRef = useRef<"left" | "right">("left");
  const previousVisibleRef = useRef<boolean>(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Always show on non-admin routes if visible and text exists
  const isAdminRoute = pathname?.startsWith("/admin") || false;

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const sliderSettings = await getSliderSettings();
        if (!isMounted) return;

        if (sliderSettings) {
          const newText = sliderSettings.text || "";
          const newDuration = sliderSettings.animationDuration || 24;
          const newDirection = sliderSettings.direction || "left";
          const newVisible = sliderSettings.visible || false;

          // Only update state if values actually changed
          // This prevents unnecessary re-renders that restart the animation
          if (
            previousTextRef.current !== newText ||
            previousDurationRef.current !== newDuration ||
            previousDirectionRef.current !== newDirection ||
            previousVisibleRef.current !== newVisible
          ) {
            previousTextRef.current = newText;
            previousDurationRef.current = newDuration;
            previousDirectionRef.current = newDirection;
            previousVisibleRef.current = newVisible;

            setSettings({
              visible: newVisible,
              text: newText,
              animationDuration: newDuration,
              direction: newDirection,
            });
          }
        } else {
          // Default to hidden if no settings
          if (
            previousVisibleRef.current !== false ||
            previousTextRef.current !== ""
          ) {
            previousTextRef.current = "";
            previousVisibleRef.current = false;
            setSettings({
              visible: false,
              text: "",
              animationDuration: 24,
              direction: "left",
            });
          }
        }
      } catch (error) {
        console.error("Error loading slider settings:", error);
        if (!isMounted) return;
        // Set to hidden on error only if not already hidden
        if (
          previousVisibleRef.current !== false ||
          previousTextRef.current !== ""
        ) {
          previousTextRef.current = "";
          previousVisibleRef.current = false;
          setSettings({
            visible: false,
            text: "",
            animationDuration: 24,
            direction: "left",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    // Poll for updates more frequently to sync across devices
    // Reduced from 30s to 3s for near real-time updates
    const interval = setInterval(() => {
      if (isMounted) {
        loadSettings();
      }
    }, 3000); // 3 seconds for faster cross-device sync

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []); // Empty dependency array - only run on mount

  // Memoize the animation class name to prevent recreation
  const animationClassName = useMemo(() => {
    if (prefersReducedMotion) return "";

    const isLeftToRight =
      position === "top" ? true : settings.direction === "left" ? true : false;

    return isLeftToRight ? "marquee-animate-left" : "marquee-animate-right";
  }, [position, settings.direction, prefersReducedMotion]);

  // Memoize content to prevent recreation unless text actually changes
  const memoizedContent = useMemo(() => {
    if (!settings.text) return null;
    return (
      <>
        {/* First copy of content */}
        <div className="infinite-text-slider-content">
          <span
            className="text-white text-sm md:text-base font-sans px-8"
            dangerouslySetInnerHTML={{ __html: settings.text }}
          />
        </div>
        {/* Second copy of content for seamless loop */}
        <div className="infinite-text-slider-content">
          <span
            className="text-white text-sm md:text-base font-sans px-8"
            dangerouslySetInnerHTML={{ __html: settings.text }}
          />
        </div>
      </>
    );
  }, [settings.text]);

  // Don't show slider in admin routes
  if (isAdminRoute) {
    return null;
  }

  // Show slider if visible and has text
  // Only return null after loading is complete to prevent flash
  if (loading) {
    return null;
  }

  if (!settings.visible || !settings.text) {
    return null;
  }

  return (
    <div
      className={`infinite-text-slider fixed ${
        position === "top" ? "top-0" : "bottom-0"
      } left-0 right-0 z-[9999] bg-black border-y border-gray-800 overflow-hidden`}
      data-position={position}
      style={{
        height: "var(--marquee-height, 2.5rem)",
        left: 0,
        right: 0,
        // High z-index to stay above scrolling content
        zIndex: 9999,
        // Mobile-specific fixes for hardware acceleration
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
        willChange: "transform",
        // Prevent any transforms from parent containers
        isolation: "isolate",
      }}
      aria-hidden="true"
    >
      <div
        ref={trackRef}
        className={`infinite-text-slider-track ${animationClassName}`}
        style={
          prefersReducedMotion
            ? {
                animation: "none",
              }
            : {
                // Animation duration as CSS variable - updates smoothly without restarting
                // Using CSS custom property so animation continues seamlessly
                ["--animation-duration" as string]: `${settings.animationDuration}s`,
              }
        }
      >
        {memoizedContent}
      </div>
    </div>
  );
}
