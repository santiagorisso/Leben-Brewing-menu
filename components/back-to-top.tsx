"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import type { MenuCategory } from "@/lib/types";
import { getMenuData } from "@/lib/supabase-storage-client";
import { sortByOrder } from "@/lib/fractional-index";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const pathname = usePathname();

  // Hide in admin routes
  const isAdminRoute = pathname?.startsWith("/admin") || false;

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  }, []);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        if (isOpen) {
          handleClose(); // Close dropdown when scrolling back to top
        }
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
  }, [isOpen, handleClose]);

  useEffect(() => {
    // Apply blur to body when dropdown is open (including during closing animation)
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
        !isClosing &&
        !target.closest(".category-menu-background") &&
        !target.closest(".category-dropdown") &&
        !target.closest(".category-menu-button")
      ) {
        handleClose();
      }
    };

    if (isOpen && !isClosing) {
      // Delay to avoid immediate closing
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.body.classList.remove("dropdown-open");
    };
  }, [isOpen, isClosing]);

  const handleCategoryClick = (categorySlug: string) => {
    const element = document.getElementById(categorySlug);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      handleClose();
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
          onClick={handleClose}
        />
      )}
      <button
        onClick={() => {
          if (isOpen) {
            handleClose();
          } else {
            setIsOpen(true);
          }
        }}
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
        <div className={`category-dropdown ${isClosing ? 'closing' : ''}`}>
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
