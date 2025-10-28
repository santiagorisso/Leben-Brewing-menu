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
    category.slug === "tragos" || category.slug === "drinks";

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

  return (
    <section
      id={category.slug}
      className={`${isParaPicar ? "space-y-8 md:space-y-10" : "space-y-6"} ${
        isVinos ? "bg-black text-white" : ""
      } scroll-mt-16 md:scroll-mt-32`}
    >
      <div className={`text-center ${isParaPicar ? "space-y-0" : "space-y-2"}`}>
        <h2
          className={`font-category-title ${
            isVinos ? "text-white" : "text-foreground"
          } ${getStyleClasses(category.titleStyle)}`}
        >
          {category.name}
        </h2>
        {category.description && (
          <p
            className={`mx-auto max-w-2xl font-category-description text-white ${getStyleClasses(
              category.descriptionStyle
            )} whitespace-pre-line ${
              isParaPicar ? "-mt-2 pb-6 md:pb-8" : "pt-1 pb-3"
            }`}
            dangerouslySetInnerHTML={{ __html: category.description }}
          />
        )}
      </div>

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
        const marginTopClass = isPizzas && isFirstSubcategory ? "mt-2" : "mt-8";
        const isDeMolde = subcategory.slug === "de-molde";
        const fontSizeClass = isDeMolde ? "text-5xl" : "";

        return (
          <div key={subcategory.id} className={`space-y-4 ${marginTopClass}`}>
            <div className="text-center space-y-1">
              <h3
                className={`font-subcategory-title text-foreground ${fontSizeClass} ${getStyleClasses(
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
    </section>
  );
}
