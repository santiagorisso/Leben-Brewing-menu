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

  // Helper function to get style classes based on TextStyle
  const getStyleClasses = (
    style: { bold?: boolean; italic?: boolean } | undefined
  ) => {
    const classes = [];
    if (style?.bold) classes.push("font-bold");
    if (style?.italic) classes.push("italic");
    return classes.join(" ");
  };

  // Group items by subcategory if subcategories exist
  const itemsBySubcategory = new Map<string, typeof sortedItems>();
  const itemsWithoutSubcategory: typeof sortedItems = [];

  sortedItems.forEach((item) => {
    if (item.subcategoryId) {
      if (!itemsBySubcategory.has(item.subcategoryId)) {
        itemsBySubcategory.set(item.subcategoryId, []);
      }
      itemsBySubcategory.get(item.subcategoryId)!.push(item);
    } else {
      itemsWithoutSubcategory.push(item);
    }
  });

  return (
    <section
      id={category.slug}
      className="space-y-8 scroll-mt-16 md:scroll-mt-32"
    >
      <div className="text-center space-y-4">
        <h2
          className={`font-category-title text-foreground ${getStyleClasses(
            category.titleStyle
          )}`}
        >
          {category.name}
        </h2>
        {category.description && (
          <p
            className={`mx-auto max-w-2xl font-category-description text-white ${getStyleClasses(
              category.descriptionStyle
            )} whitespace-pre-line`}
          >
            {category.description}
          </p>
        )}
      </div>

      {/* Show items without subcategory first */}
      {itemsWithoutSubcategory.length > 0 && (
        <div className="space-y-0">
          {itemsWithoutSubcategory.map((item, index) => (
            <div key={item.id}>
              <MenuItem item={item} categorySlug={category.slug} />
              {index < itemsWithoutSubcategory.length - 1 && (
                <div className="h-px bg-white mx-auto max-w-2xl" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Show subcategories with their items */}
      {sortedSubcategories.map((subcategory) => {
        const subcategoryItems = itemsBySubcategory.get(subcategory.id) || [];

        if (subcategoryItems.length === 0) return null;

        return (
          <div key={subcategory.id} className="space-y-6">
            <div className="text-center space-y-2">
              <h3
                className={`font-item-title text-foreground ${getStyleClasses(
                  subcategory.titleStyle
                )}`}
              >
                {subcategory.name.toUpperCase()}
              </h3>
              {subcategory.description && (
                <p
                  className={`mx-auto max-w-xl font-item-description text-white ${getStyleClasses(
                    subcategory.descriptionStyle
                  )} whitespace-pre-line`}
                >
                  {subcategory.description}
                </p>
              )}
            </div>

            <div className="space-y-0">
              {sortByOrder(subcategoryItems).map((item, index) => (
                <div key={item.id}>
                  <MenuItem item={item} categorySlug={category.slug} />
                  {index < subcategoryItems.length - 1 && (
                    <div className="h-px bg-white mx-auto max-w-2xl" />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
