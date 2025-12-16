"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { getBackgroundSettings, type BackgroundType } from "@/lib/background-settings";

// Imágenes estáticas de Navidad desde la carpeta /images/xmas
const XMAS_IMAGES = [
  "/images/xmas/copo de nieve.png",
  "/images/xmas/—Pngtree—christmas candy cane_5654223.png",
];

export function BackgroundApplier() {
  const pathname = usePathname();
  const [backgroundType, setBackgroundType] = useState<BackgroundType>("black");
  const [customCss, setCustomCss] = useState<string | undefined>();
  const [snowSpeed, setSnowSpeed] = useState<number>(5);
  const [snowOpacity, setSnowOpacity] = useState<number>(50);

  // Solo aplicar efectos en la página principal, no en admin
  const isAdminPage = pathname?.startsWith("/admin") ?? false;

  const createSnowEffect = useCallback((speed: number, opacity: number) => {
    const snowContainer = document.createElement("div");
    snowContainer.id = "snow-container";
    snowContainer.className = "snow-background";
    
    const snowflakeCount = 50;
    
    // Calcular duración basada en velocidad (1-10)
    const baseDuration = 30 - (speed * 2.5);
    const minDuration = baseDuration * 0.6;
    const maxDuration = baseDuration * 1.4;
    
    // Convertir opacidad de 1-100 a 0-1
    const opacityValue = opacity / 100;
    
    // Obtener altura de la ventana de forma más confiable para mobile
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1000;
    
    // Crear keyframes dinámicos con movimiento horizontal aleatorio
    const styleId = "snow-animation-style";
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    // Crear keyframes con CSS variables para movimiento horizontal variado
    const styleContent = `
      @keyframes snowfall {
        0% {
          transform: translateY(0) translateX(0) rotate(0deg);
          opacity: 0;
        }
        5% {
          opacity: ${opacityValue};
        }
        50% {
          opacity: ${opacityValue};
        }
        100% {
          transform: translateY(calc(100vh + 100px)) translateX(var(--snow-horizontal, 0px)) rotate(360deg);
          opacity: ${opacityValue * 0.4};
        }
      }
    `;
    styleElement.textContent = styleContent;
    
    for (let i = 0; i < snowflakeCount; i++) {
      const snowflake = document.createElement("div");
      snowflake.className = "snowflake";
      
      // Usar imágenes de xmas siempre
      const randomImage = XMAS_IMAGES[Math.floor(Math.random() * XMAS_IMAGES.length)];
      const img = document.createElement("img");
      img.src = randomImage;
      img.alt = "Snowflake";
      
      // Determinar el tamaño según la imagen
      // Candy cane: 40px x 40px
      // Copo de nieve: tamaño aleatorio entre 10px y 30px
      const isCandyCane = randomImage.includes("candy cane");
      let imageSize: number;
      if (isCandyCane) {
        imageSize = 40;
      } else {
        // Tamaño aleatorio entre 10px y 30px para copos de nieve
        imageSize = Math.random() * (30 - 10) + 10;
      }
      
      img.style.width = `${imageSize}px`;
      img.style.height = `${imageSize}px`;
      img.style.objectFit = "contain";
      snowflake.appendChild(img);
      
      snowflake.style.left = Math.random() * 100 + "%";
      
      // Duración basada en la velocidad configurada
      const duration = Math.random() * (maxDuration - minDuration) + minDuration;
      snowflake.style.animationDuration = duration + "s";
      
      // Generar posición inicial aleatoria (algunos ya están cayendo)
      // Posición inicial entre -100px (fuera de pantalla arriba) y viewportHeight (fuera de pantalla abajo)
      const initialYPosition = (Math.random() * (viewportHeight + 200)) - 100;
      
      // Calcular el progreso inicial de la animación (0 a 1)
      // Si está en posición negativa, empezar desde 0
      // Si está en pantalla, calcular cuánto progreso tiene
      const totalDistance = viewportHeight + 200; // Distancia total de la animación
      const initialProgress = Math.max(0, (initialYPosition + 100) / totalDistance);
      
      // Usar animation-delay negativo para empezar la animación en medio
      // El delay negativo debe ser el porcentaje de duración ya transcurrido
      const negativeDelay = - (duration * initialProgress);
      snowflake.style.animationDelay = negativeDelay + "s";
      
      // Posición inicial del copo
      snowflake.style.top = initialYPosition + "px";
      
      // Calcular opacidad inicial basada en el progreso
      // Si está al inicio (progreso 0-0.05), fade in
      // Si está en medio, opacidad completa
      // Si está al final (progreso > 0.95), fade out
      let initialOpacity;
      if (initialProgress < 0.05) {
        initialOpacity = opacityValue * (initialProgress / 0.05);
      } else if (initialProgress > 0.95) {
        initialOpacity = opacityValue * (1 - (initialProgress - 0.95) / 0.05);
      } else {
        initialOpacity = opacityValue;
      }
      
      // Aplicar opacidad inicial a la imagen, no al contenedor
      // La animación manejará la opacidad durante el movimiento
      img.style.opacity = initialOpacity.toString();
      // Tamaño del contenedor del copo debe coincidir con el tamaño de la imagen
      snowflake.style.width = `${imageSize}px`;
      snowflake.style.height = `${imageSize}px`;
      
      // Asignar movimiento horizontal aleatorio (algunos a la izquierda, algunos a la derecha)
      const horizontalMovement = (Math.random() - 0.5) * 100;
      snowflake.style.setProperty("--snow-horizontal", `${horizontalMovement}px`);
      
      snowContainer.appendChild(snowflake);
    }
    
    // Aplicar al main si está disponible, sino usar body (mejor para mobile)
    const mainElement = document.querySelector("main");
    const targetElement = mainElement || document.body;
    targetElement.appendChild(snowContainer);
  }, []);

  const applyBackground = useCallback((type: BackgroundType, css?: string, speed?: number, opacity?: number) => {
    // No aplicar efectos en páginas de admin
    if (isAdminPage) {
      const existingSnow = document.getElementById("snow-container");
      if (existingSnow) {
        existingSnow.remove();
      }
      const existingStyle = document.getElementById("custom-background-style");
      if (existingStyle) {
        existingStyle.remove();
      }
      const animationStyle = document.getElementById("snow-animation-style");
      if (animationStyle) {
        animationStyle.remove();
      }
      return;
    }

    // Usar body como fallback si main no está disponible (mejor para mobile)
    const mainElement = document.querySelector("main");
    const targetElement = mainElement || document.body;
    
    if (!targetElement) return;

    targetElement.classList.remove("snow-background-active", "custom-background-active");
    
    const existingSnow = document.getElementById("snow-container");
    if (existingSnow) {
      existingSnow.remove();
    }

    const existingStyle = document.getElementById("custom-background-style");
    if (existingStyle) {
      existingStyle.remove();
    }

    const animationStyle = document.getElementById("snow-animation-style");
    if (animationStyle) {
      animationStyle.remove();
    }

    if (type === "snow") {
      targetElement.classList.add("snow-background-active");
      createSnowEffect(speed ?? 5, opacity ?? 50);
    } else if (type === "custom" && css) {
      targetElement.classList.add("custom-background-active");
      const styleTag = document.createElement("style");
      styleTag.id = "custom-background-style";
      styleTag.textContent = css;
      document.head.appendChild(styleTag);
    }
    // "black" is the default, no special class needed
  }, [createSnowEffect, isAdminPage]);

  const loadBackground = useCallback(async () => {
    try {
      const settings = await getBackgroundSettings();
      if (settings) {
        setBackgroundType(settings.type);
        setCustomCss(settings.customCss);
        setSnowSpeed(settings.snowSpeed ?? 5);
        setSnowOpacity(settings.snowOpacity ?? 50);
      }
    } catch (error) {
      console.error("Error loading background settings:", error);
    }
  }, []);

  useEffect(() => {
    loadBackground();
    // Poll for updates every 3 seconds (reduced from 30s for faster updates)
    const interval = setInterval(loadBackground, 3000);
    return () => clearInterval(interval);
  }, [loadBackground]);

  useEffect(() => {
    applyBackground(backgroundType, customCss, snowSpeed, snowOpacity);
  }, [backgroundType, customCss, snowSpeed, snowOpacity, applyBackground, isAdminPage]);

  return null;
}

