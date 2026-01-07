"use client";

import { useState, useEffect } from "react";
import type { MenuCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FloatingMenuProps {
  categories: MenuCategory[];
  onCategoryChange: (slug: string) => void;
}

export function FloatingMenu({ categories, onCategoryChange }: FloatingMenuProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 100px
      const shouldBeVisible = window.scrollY > 100;
      if (isVisible !== shouldBeVisible) {
        setIsVisible(shouldBeVisible);
        // Close menu if button hides
        if (!shouldBeVisible) setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible]);

  // Handle click outside and Escape key to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest(".category-menu-background") && !target.closest(".category-dropdown")) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      document.body.classList.add("dropdown-open");
    } else {
      document.body.classList.remove("dropdown-open");
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("dropdown-open");
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleCategoryClick = (categorySlug: string) => {
    onCategoryChange(categorySlug);
    setIsOpen(false);
    
    const element = document.getElementById(categorySlug);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Backdrop for blur effect when open */}
      {isOpen && <div className="category-dropdown-backdrop" aria-hidden="true" />}

      {/* Floating Button - Always rendered, visibility controlled by opacity */}
      <div 
        className={cn(
          "category-menu-background transition-all duration-300 ease-in-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
      >
        <button 
          className="category-menu-button category-menu-icon"
          onClick={handleToggle}
          aria-label="Menu shortcuts"
          aria-expanded={isOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Dropdown Menu */}
      <div 
        className={cn(
          "category-dropdown transition-all duration-300 ease-in-out", 
          isOpen ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-10 pointer-events-none"
        )}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.slug)}
            className="category-dropdown-item hover:scale-105 active:scale-95"
            tabIndex={isOpen ? 0 : -1}
          >
            {category.name}
          </button>
        ))}
      </div>
    </>
  );
}

