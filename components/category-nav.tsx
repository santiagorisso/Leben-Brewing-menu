"use client"

import type { MenuCategory } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CategoryNavProps {
  categories: MenuCategory[]
  activeCategory: string
  onCategoryChange: (slug: string) => void
}

export function CategoryNav({ categories, activeCategory, onCategoryChange }: CategoryNavProps) {
  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-4xl px-4">
        <div className="grid grid-cols-2 gap-4 py-6 md:grid-cols-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.slug)}
              className={cn(
                "rounded-lg border-2 px-6 py-4 text-center font-display text-xl font-bold uppercase tracking-wide transition-all",
                activeCategory === category.slug
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-foreground hover:border-accent/50 hover:bg-accent/5",
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
