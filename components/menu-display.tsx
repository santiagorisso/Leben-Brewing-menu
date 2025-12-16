"use client";

import { useState } from "react";
import type { MenuData } from "@/lib/types";
import { CategoryNav } from "./category-nav";
import { MenuSection } from "./menu-section";
import { sortByOrder } from "@/lib/fractional-index";
import Image from "next/image";

interface MenuDisplayProps {
  data: MenuData;
}

export function MenuDisplay({ data }: MenuDisplayProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    data.categories[0]?.slug || ""
  );

  const sortedCategories = sortByOrder(data.categories);

  return (
    <div className="w-full relative z-10">
      {/* Mobile Layout: 50% Logo, 50% Navigation */}
      <div className="min-h-screen flex flex-col md:min-h-0 md:block">
        {/* Logo Section - 50% on mobile */}
        <header className="border-b border-border flex-1 flex items-center justify-center md:block relative z-[1]">
          <div className="mx-auto max-w-4xl px-4 py-8 text-center md:py-8">
            <Image
              src="/images/logo.jpg"
              alt="Leben Brewing Company"
              width={400}
              height={120}
              className="mx-auto w-80 h-auto md:w-96 relative z-[1]"
              priority
            />
          </div>
        </header>

        {/* Category Navigation - 50% on mobile */}
        <div className="flex-1 flex items-center md:block relative z-10">
          <CategoryNav
            categories={sortedCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </div>

      {/* Menu Content */}
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12 relative z-10">
        <div className="space-y-12 md:space-y-16">
          {sortedCategories.map((category, index) => (
            <div
              key={category.id}
              className={`pb-6 md:pb-10 ${
                index < sortedCategories.length - 1
                  ? "border-b border-white"
                  : ""
              }`}
            >
              <MenuSection category={category} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
