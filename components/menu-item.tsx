import type { MenuItem as MenuItemType } from "@/lib/types";
import Image from "next/image";

interface MenuItemProps {
  item: MenuItemType;
  categorySlug: string;
}

export function MenuItem({ item, categorySlug }: MenuItemProps) {
  const isBeer = categorySlug === "beers";
  const isWine = categorySlug === "wines";

  // Determine text color based on availability
  const textColor = item.available ? "text-white" : "text-muted";

  // Helper function to get style classes based on TextStyle
  const getStyleClasses = (
    style: { bold?: boolean; italic?: boolean } | undefined
  ) => {
    const classes = [];
    if (style?.bold) classes.push("font-bold");
    if (style?.italic) classes.push("italic");
    return classes.join(" ");
  };

  return (
    <div className="relative py-6 text-center md:py-8">
      {!item.available && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Image
            src="/images/soldout.png"
            alt="Sold Out"
            width={300}
            height={150}
            className="opacity-70"
          />
        </div>
      )}

      {/* Item Content */}
      <div className="space-y-2">
        {/* Name, Side Note, and Vegetarian Badge */}
        <div className="flex items-center justify-center gap-2">
          <h3
            className={`font-item-title ${textColor} ${getStyleClasses(
              item.titleStyle
            )}`}
          >
            {item.name}
          </h3>
          {item.sideNote && (
            <span
              className={`font-side-note ${textColor} ${getStyleClasses(
                item.sideNoteStyle
              )}`}
            >
              {item.sideNote}
            </span>
          )}
          {item.vegetarian && (
            <Image
              src="/images/veggie.png"
              alt="Vegetarian"
              width={20}
              height={20}
              className="shrink-0"
            />
          )}
        </div>

        {/* Beer Stats - IBU and ABV on same line */}
        {isBeer && (item.ibu || item.abv) && (
          <div
            className={`flex items-center justify-center gap-3 text-sm font-knockout-full ${textColor}`}
          >
            {item.ibu && <span>IBU: {item.ibu}</span>}
            {item.abv && <span>ABV: {item.abv}</span>}
          </div>
        )}

        {/* Description - white when available, gray when sold out */}
        {item.description && (
          <p
            className={`mx-auto max-w-2xl font-item-description ${textColor} ${getStyleClasses(
              item.descriptionStyle
            )} whitespace-pre-line`}
          >
            {item.description}
          </p>
        )}

        {/* Pricing - formatted with $ and .– */}
        <div className="pt-2">
          {isWine && item.glassPrice && item.bottlePrice ? (
            <div className="flex items-center justify-center gap-2">
              <span className={`font-price font-bold ${textColor}`}>
                copa ${item.glassPrice}.–
              </span>
              <span className={textColor}>/</span>
              <span className={`font-price font-bold ${textColor}`}>
                botella ${item.bottlePrice}.–
              </span>
            </div>
          ) : (
            <span className={`font-price font-bold ${textColor}`}>
              ${item.price}.–
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
