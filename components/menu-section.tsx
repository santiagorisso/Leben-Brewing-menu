import type { MenuCategory, MenuSubcategory } from "@/lib/types";
import { MenuItem } from "./menu-item";
import { sortByOrder } from "@/lib/fractional-index";

interface MenuSectionProps {
  category: MenuCategory;
}

export function MenuSection({ category }: MenuSectionProps) {
  const sortedItems = sortByOrder(category.items);
  const isBeersCategory =
    category.slug === "cervezas" || category.slug === "beers";
  const isTragosCategory =
    category.slug === "tragos" || category.slug === "drinks" || category.slug === "cocktails";

  // Debug logging for TRAGOS category
  if (category.slug === "tragos") {
    console.log(
      "TRAGOS category detected:",
      category.slug,
      "isTragosCategory:",
      isTragosCategory
    );
  }

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

  // Helper function to process description: convert \n to <br> except before <b> tags
  const processDescription = (description: string): string => {
    // Remove \n that are immediately before <b> tags (with optional whitespace)
    // Add " - " separator before prices to keep them on the same line
    let processed = description.replace(/\n\s*<b>/g, " - <b>");
    // Handle cases where <b> is on the same line: add " - " if not already present
    // This regex looks for text followed by optional whitespace and <b>, but not if " - " already exists
    processed = processed.replace(/([^-\s>])\s+(?!- )<b>/g, "$1 - <b>");
    // Convert remaining \n to <br> for line breaks
    processed = processed.replace(/\n/g, "<br>");
    return processed;
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

  const isParaPicar = category.slug === "para-picar";
  const isPizzas = category.slug === "pizzas";
  const isVinos = category.slug === "vinos" || category.slug === "wines";

  // Collect all items (with and without subcategories) for cocktails/tragos
  const allItemsForGrid: typeof sortedItems = [];
  
  // Add items without subcategory
  itemsWithoutSubcategory.forEach((item) => {
    allItemsForGrid.push(item);
  });

  // Add items from subcategories
  sortedSubcategories.forEach((subcategory) => {
    const subcategoryItems = itemsBySubcategory.get(subcategory.id) || [];
    subcategoryItems.forEach((item) => {
      allItemsForGrid.push(item);
    });
  });

  const totalItemsCount = allItemsForGrid.length;
  const isOddCount = totalItemsCount % 2 !== 0;

  // Collect all wine items (with and without subcategories) for grid layout
  const allWineItems: typeof sortedItems = [];
  
  // Add items without subcategory
  itemsWithoutSubcategory.forEach((item) => {
    allWineItems.push(item);
  });

  // Add items from subcategories
  sortedSubcategories.forEach((subcategory) => {
    const subcategoryItems = itemsBySubcategory.get(subcategory.id) || [];
    subcategoryItems.forEach((item) => {
      allWineItems.push(item);
    });
  });

  const totalWineItemsCount = allWineItems.length;
  const isWineOddCount = totalWineItemsCount % 2 !== 0;

  return (
    <section
      id={category.slug}
      className={`${isParaPicar ? "space-y-8 md:space-y-10" : "space-y-6"} ${
        isVinos ? "bg-black text-white" : ""
      } scroll-mt-16 md:scroll-mt-32`}
    >
      <div className={`text-center ${isParaPicar ? "space-y-0" : "space-y-2"}`}>
        <h2
          className={`font-category-title mb-0 ${
            isVinos ? "text-white" : "text-foreground"
          } ${getStyleClasses(category.titleStyle)}`}
        >
          {category.name}
        </h2>
        {category.description && (
          <p
            className={`mx-auto max-w-2xl font-category-description text-white ${getStyleClasses(
              category.descriptionStyle
            )} ${
              isParaPicar ? "mt-[28px] pb-6 md:pb-8" : "pt-0 pb-0"
            }`}
            dangerouslySetInnerHTML={{ __html: processDescription(category.description) }}
          />
        )}
      </div>

      {/* For cocktails/tragos: wrap all items in a single grid container */}
      {isTragosCategory && allItemsForGrid.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto px-4">
          {allItemsForGrid.map((item, index) => {
            const isLastItem = index === allItemsForGrid.length - 1;
            const shouldCenterLastItem = isOddCount && isLastItem;
            
            return (
              <div
                key={item.id}
                className={shouldCenterLastItem ? "md:col-span-2 md:mx-auto md:max-w-md" : ""}
              >
                <MenuItem item={item} categorySlug={category.slug} />
              </div>
            );
          })}
        </div>
      ) : isVinos && allWineItems.length > 0 ? (
        /* For wines: wrap all items in a single grid container */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 max-w-6xl mx-auto px-4 mb-0 items-center">
          {allWineItems.map((item, index) => {
            const isLastItem = index === allWineItems.length - 1;
            const shouldCenterLastItem = isWineOddCount && isLastItem;
            
            return (
              <div
                key={item.id}
                className={`${shouldCenterLastItem ? "md:col-span-2 md:mx-auto md:max-w-md" : ""} h-full flex items-center justify-center`}
              >
                <MenuItem item={item} categorySlug={category.slug} />
              </div>
            );
          })}
        </div>
      ) : (
        <>
          {/* Show items without subcategory first */}
          {itemsWithoutSubcategory.length > 0 && (
            <div
              className={
                isTragosCategory
                  ? "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto px-4"
                  : "space-y-0"
              }
            >
              {itemsWithoutSubcategory.map((item, index) => (
                <div key={item.id}>
                  <MenuItem item={item} categorySlug={category.slug} />
                  {isBeersCategory &&
                    !isTragosCategory &&
                    index < itemsWithoutSubcategory.length - 1 && (
                      <div className="h-px bg-white mx-auto max-w-2xl" />
                    )}
                </div>
              ))}
            </div>
          )}

          {/* Show subcategories with their items */}
          {sortedSubcategories.map((subcategory, index) => {
            const subcategoryItems = itemsBySubcategory.get(subcategory.id) || [];

            if (subcategoryItems.length === 0) return null;

            const isFirstSubcategory = index === 0;
            const marginTopClass = isPizzas && isFirstSubcategory ? "mt-2" : isFirstSubcategory ? "mt-4" : "mt-0";
            const isDeMolde = subcategory.slug === "de-molde";
            const fontSizeClass = isDeMolde ? "de-molde-title" : "";
            const firstSubcategoryClass = isFirstSubcategory ? "first-subcategory" : "";

            return (
              <div key={subcategory.id} className={`subcategory-container space-y-4 ${marginTopClass}`}>
                <div className="text-center space-y-1">
                  <h3
                    className={`font-subcategory-title text-foreground ${fontSizeClass} ${firstSubcategoryClass} ${getStyleClasses(
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
                      dangerouslySetInnerHTML={{ __html: subcategory.description }}
                    />
                  )}
                </div>

                <div
                  className={
                    isTragosCategory
                      ? "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto px-4"
                      : "space-y-0"
                  }
                >
                  {sortByOrder(subcategoryItems).map((item, index) => (
                    <div key={item.id}>
                      <MenuItem item={item} categorySlug={category.slug} />
                      {isBeersCategory &&
                        !isTragosCategory &&
                        index < subcategoryItems.length - 1 && (
                          <div className="h-px bg-white mx-auto max-w-2xl" />
                        )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </section>
  );
}
