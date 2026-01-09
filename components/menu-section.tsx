import type { MenuCategory } from "@/lib/types";
import { MenuItem } from "./menu-item";
import { sortByOrder } from "@/lib/fractional-index";

interface MenuSectionProps {
  category: MenuCategory;
}

export function MenuSection({ category }: MenuSectionProps) {
  const sortedItems = sortByOrder(category.items).filter(item => item.active !== false);
  // Identifiers for specific layout logic
  const isBeersCategory =
    category.slug === "cervezas" || category.slug === "beers";
  const isTragosCategory =
    category.slug === "tragos" || category.slug === "drinks" || category.slug === "cocktails";
  const isVinos = category.slug === "vinos" || category.slug === "wines";
  const isParaPicar = category.slug === "para-picar";
  const isPizzas = category.slug === "pizzas";

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

  // Helper function to process description
  const processDescription = (description: string): string => {
    let processed = description.replace(/\n\s*<b>/g, " - <b>");
    processed = processed.replace(/([^-\s>])\s+(?!- )<b>/g, "$1 - <b>");
    processed = processed.replace(/\n/g, "<br>");
    return processed;
  };

  // Group items by subcategory if they exist
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

  // Collect all items for grid layouts (Tragos/Vinos)
  const allItemsForGrid: typeof sortedItems = [];
  itemsWithoutSubcategory.forEach((item) => allItemsForGrid.push(item));
  sortedSubcategories.forEach((subcategory) => {
    const subcategoryItems = itemsBySubcategory.get(subcategory.id) || [];
    subcategoryItems.forEach((item) => allItemsForGrid.push(item));
  });

  const totalItemsCount = allItemsForGrid.length;
  const isOddCount = totalItemsCount % 2 !== 0;

  return (
    <section
      className={`${isParaPicar ? "space-y-10" : "space-y-6"} ${
        isVinos ? "bg-black text-white" : ""
      } scroll-mt-24 pb-8 relative`}
    >
      {/* Decorative Divider (Top) - applied to all except first if needed, but typical menu has dividers between sections. 
          The existing code had border-bottom. I will replace it with a dedicated element at the bottom of the content.
      */}
      <div className="text-center animate-fade-in-up">
        {/* Category Title: Margins are handled by .font-category-title in globals.css */}
        <h2
          className={`font-category-title ${
            isVinos ? "text-white" : "text-white"
          } ${getStyleClasses(category.titleStyle)}`}
        >
          {category.name}
        </h2>
        
      {category.description && (
          <p
            className={`mx-auto max-w-2xl ${
              category.slug === "empanadas"
                ? "font-category-description-small"
                : "font-category-description"
            } ${
              isParaPicar ? "mt-4 pb-4" : ""
            } ${getStyleClasses(category.descriptionStyle)}`}
            dangerouslySetInnerHTML={{ __html: processDescription(category.description) }}
          />
        )}
      </div>

      {/* Grid Layout for Tragos (Cocktails) */}
      {isTragosCategory && allItemsForGrid.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 max-w-5xl mx-auto px-2">
          {allItemsForGrid.map((item, index) => {
            const isLastItem = index === allItemsForGrid.length - 1;
            const shouldCenterLastItem = isOddCount && isLastItem;
            
            return (
              <div
                key={item.id}
                className={`${shouldCenterLastItem ? "md:col-span-2 md:mx-auto md:max-w-md" : ""} animate-fade-in-up`}
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              >
                <MenuItem item={item} categorySlug={category.slug} spacingMode="compact" />
              </div>
            );
          })}
        </div>
      ) : isVinos && allItemsForGrid.length > 0 ? (
        /* Grid Layout for Wines */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 max-w-5xl mx-auto px-2 items-center">
          {allItemsForGrid.map((item, index) => {
            const isLastItem = index === allItemsForGrid.length - 1;
            const shouldCenterLastItem = isOddCount && isLastItem;
            
            return (
              <div
                key={item.id}
                className={`${shouldCenterLastItem ? "md:col-span-2 md:mx-auto md:max-w-md" : ""} h-full flex items-center justify-center animate-fade-in-up`}
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              >
                <MenuItem item={item} categorySlug={category.slug} spacingMode="compact" />
              </div>
            );
          })}
        </div>
      ) : (
        /* Standard List Layout (Beers, Food) */
        <div className="flex flex-col items-center">
          {/* Items without subcategory */}
          {itemsWithoutSubcategory.length > 0 && (
            <div className={`w-full max-w-2xl space-y-0`}>
              {itemsWithoutSubcategory.map((item, index) => (
                <div 
                  key={item.id} 
                  className="relative animate-fade-in-up" 
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                  <MenuItem 
                    item={item} 
                    categorySlug={category.slug} 
                    spacingMode={isParaPicar || isPizzas ? "expanded" : "compact"}
                  />
                  {/* Divider for beers: thin white line */}
                  {isBeersCategory &&
                    index < itemsWithoutSubcategory.length - 1 && (
                      <div className="h-px bg-white/40 mx-auto w-1/3 my-1" />
                    )}
                </div>
              ))}
            </div>
          )}

          {/* Subcategories (e.g. Pizza types) */}
          {sortedSubcategories.map((subcategory, index) => {
            const subcategoryItems = itemsBySubcategory.get(subcategory.id) || [];
            if (subcategoryItems.length === 0) return null;

            const isFirstSubcategory = index === 0;
            // Add top margin if it's a new section
            const marginTopClass = itemsWithoutSubcategory.length > 0 || !isFirstSubcategory ? "mt-10" : "mt-4";

            return (
              <div key={subcategory.id} className={`w-full max-w-2xl text-center ${marginTopClass} animate-fade-in-up`} style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                <div className="mb-4">
                  <h3
                    className={`font-subcategory-title text-white ${getStyleClasses(
                      subcategory.titleStyle
                    )}`}
                  >
                    {subcategory.name.toUpperCase()}
                  </h3>
                  {subcategory.description && (
                    <p
                      className={`mx-auto max-w-xl font-item-description mt-1 ${getStyleClasses(
                        subcategory.descriptionStyle
                      )} whitespace-pre-line`}
                      dangerouslySetInnerHTML={{ __html: subcategory.description }}
                    />
                  )}
                </div>

                <div className="space-y-0">
                  {sortByOrder(subcategoryItems).map((item, index) => (
                    <div 
                      key={item.id} 
                      className="relative animate-fade-in-up"
                      style={{ animationDelay: `${(index + 2) * 50}ms`, animationFillMode: 'both' }}
                    >
                      <MenuItem 
                        item={item} 
                        categorySlug={category.slug} 
                        spacingMode={isParaPicar || isPizzas ? "expanded" : "compact"}
                      />
                      {/* Divider for beers within subcategories */}
                      {isBeersCategory &&
                        index < subcategoryItems.length - 1 && (
                          <div className="h-px bg-white/40 mx-auto w-1/3 my-1" />
                        )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Section Divider - visual separator */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center py-4">
        <div className="w-full h-px bg-[#ffffff] opacity-30 max-w-5xl mx-auto" />
      </div>
    </section>
  );
}
