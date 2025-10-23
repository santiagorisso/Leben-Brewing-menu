"use client"

import { useState } from "react"
import type { MenuData } from "@/lib/types"
import { CategoryNav } from "./category-nav"
import { MenuSection } from "./menu-section"
import { sortByOrder } from "@/lib/fractional-index"
import Image from "next/image"

interface MenuDisplayProps {
  data: MenuData
}

export function MenuDisplay({ data }: MenuDisplayProps) {
  const [activeCategory, setActiveCategory] = useState<string>(data.categories[0]?.slug || "")

  const sortedCategories = sortByOrder(data.categories)

  return (
    <div className="w-full">
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-8 text-center">
          <Image
            src="/images/logo.jpg"
            alt="Leben Brewing Company"
            width={400}
            height={120}
            className="mx-auto"
            priority
          />
        </div>
      </header>

      {/* Category Navigation */}
      <CategoryNav categories={sortedCategories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="space-y-16">
          {sortedCategories.map((category) => (
            <MenuSection key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  )
}
