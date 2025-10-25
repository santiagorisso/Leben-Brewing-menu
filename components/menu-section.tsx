import type { MenuCategory, MenuSubcategory } from "@/lib/types";
import { MenuItem } from "./menu-item";
import { sortByOrder } from "@/lib/fractional-index";

interface MenuSectionProps {
  category: MenuCategory;
}

export function MenuSection({ category }: MenuSectionProps) {
  const sortedItems = sortByOrder(category.items);

  const sortedSubcategories = category.subcategories
    ? sortByOrder(category.subcategories)
    : [];

  return (
    <section
      id={category.slug}
      className="space-y-8 scroll-mt-16 md:scroll-mt-32"
    >
      <div className="text-center space-y-4">
        <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl font-display-wide">
          {category.name}
        </h2>
        {category.description && (
          <p className="mx-auto max-w-2xl text-sm italic leading-relaxed text-muted font-sans whitespace-pre-line">
            {category.description}
          </p>
        )}
      </div>

      <div className="space-y-0">
        {sortedItems.map((item, index) => (
          <div key={item.id}>
            <MenuItem item={item} categorySlug={category.slug} />
            {index < sortedItems.length - 1 && (
              <div className="h-px bg-white/20 mx-auto max-w-2xl" />
            )}
          </div>
        ))}
      </div>

      {/* Subcategories */}
      {sortedSubcategories.map((subcategory) => (
        <div key={subcategory.id} className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">
              {subcategory.name}
            </h3>
            {subcategory.description && (
              <p className="mx-auto max-w-xl text-sm italic leading-relaxed text-muted font-sans whitespace-pre-line">
                {subcategory.description}
              </p>
            )}
          </div>

          <div className="space-y-0">
            {sortByOrder(subcategory.items).map((item, index) => (
              <div key={item.id}>
                <MenuItem item={item} categorySlug={category.slug} />
                {index < subcategory.items.length - 1 && (
                  <div className="h-px bg-white/20 mx-auto max-w-2xl" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
