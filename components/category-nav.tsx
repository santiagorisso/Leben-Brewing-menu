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
    <nav className="border-b border-border bg-card w-full">
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className={cn(
                "rounded-lg border-2 px-4 py-6 text-center font-display text-lg font-bold uppercase tracking-wide transition-all md:px-6 md:py-4 md:text-xl",
                activeCategory === category.slug
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-foreground hover:border-accent/50 hover:bg-accent/5"
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
