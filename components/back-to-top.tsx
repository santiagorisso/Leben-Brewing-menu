"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import type { MenuCategory } from "@/lib/types";
import { getMenuData } from "@/lib/supabase-storage-client";
import { sortByOrder } from "@/lib/fractional-index";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const pathname = usePathname();

  // Hide in admin routes
  const isAdminRoute = pathname?.startsWith("/admin") || false;

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsOpen(false); // Close dropdown when scrolling back to top
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Load categories
    getMenuData()
      .then((data) => {
        setCategories(sortByOrder(data.categories));
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  useEffect(() => {
    // Apply blur to body when dropdown is open
    if (isOpen) {
      document.body.classList.add("dropdown-open");
    } else {
      document.body.classList.remove("dropdown-open");
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isOpen &&
        !target.closest(".category-menu-background") &&
        !target.closest(".category-dropdown") &&
        !target.closest(".category-menu-button")
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Delay to avoid immediate closing
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.body.classList.remove("dropdown-open");
    };
  }, [isOpen]);

  const handleCategoryClick = (categorySlug: string) => {
    const element = document.getElementById(categorySlug);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setIsOpen(false);
    }
  };

  // Don't show in admin routes
  if (isAdminRoute) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <div
          className="category-dropdown-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="category-menu-button"
        aria-label="Category menu"
      >
        <div className="category-menu-background">
          <div className="category-menu-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="category-dropdown">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className="category-dropdown-item"
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
