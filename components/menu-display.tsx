"use client";

import { useState } from "react";
import type { MenuData } from "@/lib/types";
import { CategoryNav } from "./category-nav";
import { MenuSection } from "./menu-section";
import { FloatingMenu } from "./floating-menu";
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
    <div className="w-full">
      {/* Mobile Layout: 50% Logo, 50% Navigation */}
      <div className="min-h-screen flex flex-col md:min-h-0 md:block">
        {/* Logo Section - 50% on mobile */}
        <header className="border-b border-white/10 flex-1 flex items-center justify-center md:block">
          <div className="mx-auto max-w-4xl px-4 py-8 text-center md:py-8">
            <Image
              src="/images/logo.jpg"
              alt="Leben Brewing Company"
              width={400}
              height={120}
              className="mx-auto w-80 h-auto md:w-96 animate-fade-in"
              priority
            />
          </div>
        </header>

        {/* Inline Category Navigation removed as requested - using FloatingMenu instead */}
      </div>

      {/* Floating Menu for quick navigation on scroll */}
      <FloatingMenu 
        categories={sortedCategories}
        onCategoryChange={setActiveCategory}
      />

      {/* Menu Content */}
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <div className="space-y-12 md:space-y-16">
          {sortedCategories.map((category, index) => (
            <div
              key={category.id}
              className="animate-on-scroll"
            >
              <MenuSection category={category} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
