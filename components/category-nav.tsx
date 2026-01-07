"use client";

import type { MenuCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  categories: MenuCategory[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
}

export function CategoryNav({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryNavProps) {
  const handleCategoryClick = (categorySlug: string) => {
    onCategoryChange(categorySlug);

    // Scroll to the section
    const element = document.getElementById(categorySlug);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav className="border-b border-white/10 bg-black w-full sticky top-[var(--marquee-height,2.5rem)] z-40">
      <div className="mx-auto max-w-4xl px-4 py-4 md:py-6 overflow-x-auto">
        <div className="flex flex-nowrap md:grid md:grid-cols-4 gap-4 min-w-max md:min-w-0 pb-2 md:pb-0">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className={cn(
                "uiverse-button uiverse-button-category",
                activeCategory === category.slug
                  ? "bg-white text-black border-white"
                  : "bg-black text-white border-white hover:bg-white/10"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
