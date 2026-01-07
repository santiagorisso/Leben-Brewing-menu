import type { MenuItem as MenuItemType } from "@/lib/types";
import Image from "next/image";

interface MenuItemProps {
  item: MenuItemType;
  categorySlug: string;
}

export function MenuItem({ item, categorySlug }: MenuItemProps) {
  // Use slug matching for category-specific logic
  const isBeer = categorySlug.includes("cervezas") || categorySlug.includes("beers");
  const isWine = categorySlug.includes("vinos") || categorySlug.includes("wines");
  const isTragos = categorySlug.includes("tragos") || categorySlug.includes("drinks");
  
  const textColor = item.available ? "text-white" : "text-muted";

  // Helper for inline styles
  const getStyleClasses = (
    style: { bold?: boolean; italic?: boolean } | undefined
  ) => {
    const classes = [];
    if (style?.bold) classes.push("font-bold");
    if (style?.italic) classes.push("italic");
    return classes.join(" ");
  };

  return (
    <div className="relative py-2 text-center">
      {/* Sold Out Overlay */}
      {!item.available && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <Image
            src="/images/soldout.png"
            alt="Sold Out"
            width={120}
            height={60}
            className="opacity-80 rotate-[-15deg]"
          />
        </div>
      )}

      <div className={`flex flex-col items-center justify-center space-y-1`}>
        {/* Wine Type (only for wines) */}
        {isWine && item.wineType && (
          <span className={`font-wine-type ${textColor}`}>
            {item.wineType}
          </span>
        )}

        {/* Item Name + Veggie Icon */}
        <div className="flex items-center justify-center gap-2 leading-none">
          <h3
            className={`
              ${isWine ? "font-wine-title" : "font-item-title"}
              ${textColor}
              ${getStyleClasses(item.titleStyle)}
            `}
          >
            {item.name}
          </h3>
          
          {/* Side Note (e.g. "+ Papas") */}
          {item.sideNote && (
            <span className={`font-side-note ${textColor} ${getStyleClasses(item.sideNoteStyle)}`}>
              {item.showPlusBeforeSideNote && "+ "}{item.sideNote}
            </span>
          )}

          {/* Vegetarian Badge */}
          {item.vegetarian && (
            <Image
              src="/images/veggie.png"
              alt="Vegetarian"
              width={16}
              height={16}
              className="ml-1"
            />
          )}
        </div>

        {/* Beer Stats (IBU / ABV) */}
        {isBeer && (item.ibu || item.abv) && (
          <div className={`flex items-center justify-center gap-3 text-sm font-knockout-full ${textColor} opacity-90`}>
             {item.ibu && <span>IBU {item.ibu}</span>}
             {item.abv && <span>ABV {item.abv}</span>}
          </div>
        )}

        {/* Description */}
        {item.description && (
          <p
            className={`
              mx-auto max-w-lg
              font-item-description
              ${textColor}
              ${getStyleClasses(item.descriptionStyle)}
              whitespace-pre-line
            `}
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        )}

        {/* Price */}
        <div className="mt-1">
          {isWine && item.glassPrice && item.bottlePrice ? (
            <div className="flex flex-col items-center gap-0">
              <span className={`font-price ${textColor}`}>
                copa ${item.glassPrice}.–
              </span>
              <span className={`font-price ${textColor}`}>
                botella ${item.bottlePrice}.–
              </span>
            </div>
          ) : (
            <span className={`font-price ${textColor}`}>
              ${item.price}.–
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
