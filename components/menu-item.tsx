import type { MenuItem as MenuItemType } from "@/lib/types";
import Image from "next/image";

interface MenuItemProps {
  item: MenuItemType;
  categorySlug: string;
}

export function MenuItem({ item, categorySlug }: MenuItemProps) {
  const isBeer = categorySlug === "cervezas" || categorySlug === "beers";
  const isWine = categorySlug === "vinos" || categorySlug === "wines";
  const isEmpanadas = categorySlug === "empanadas";
  const isParaPicar =
    categorySlug === "para-picar" || categorySlug === "para picar";
  const isTragos = categorySlug === "tragos" || categorySlug === "drinks";

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
    <div className="relative py-3 text-center md:py-4">
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
      <div className={`${isWine ? "wine-item-content" : ""} ${isWine ? "space-y-2" : "space-y-1"} ${isWine ? "flex flex-col items-center justify-center" : ""}`}>
        {/* Wine Type - displayed above wine name for wines */}
        {isWine && item.wineType ? (
          <div className="text-center">
            <span className={`font-wine-type ${textColor}`}>
              {item.wineType}
            </span>
          </div>
        ) : isWine ? (
          <div className="h-5"></div> // Placeholder para mantener altura consistente
        ) : null}

        {/* Name, Side Note, and Vegetarian Badge */}
        <div
          className={`flex items-center justify-center gap-2 ${
            isTragos ? "tragos-title-no-margin" : ""
          }`}
        >
          <h3
            className={`${
              isWine
                ? "font-wine-title"
                : isTragos
                ? "font-tragos-title"
                : "font-item-title"
            } ${textColor} ${getStyleClasses(item.titleStyle)}`}
          >
            {item.name}
          </h3>
          {item.sideNote && (
            <>
              {item.showPlusBeforeSideNote && (
                <span
                  className={`font-side-note ${textColor} ${getStyleClasses(
                    item.sideNoteStyle
                  )}`}
                >
                  +
                </span>
              )}
              <span
                className={`font-side-note ${textColor} ${getStyleClasses(
                  item.sideNoteStyle
                )}`}
              >
                {item.sideNote}
              </span>
            </>
          )}
          {item.vegetarian && (
            <Image
              src="/images/veggie.png"
              alt="Vegetarian"
              width={16}
              height={16}
              className="shrink-0"
            />
          )}
        </div>

        {/* Beer Stats - IBU and ABV on same line */}
        {isBeer && (item.ibu || item.abv) && (
          <div
            className={`flex items-center justify-center gap-3 text-sm font-knockout-full ${textColor}`}
            style={{ marginTop: "-0.25rem" }}
          >
            {item.ibu && <span>IBU: {item.ibu}</span>}
            {item.abv && <span>ABV: {item.abv}</span>}
          </div>
        )}

        {/* Description - white when available, gray when sold out */}
        {item.description ? (
          <p
            className={`mx-auto max-w-2xl ${
              isTragos ? "font-tragos-description" : "font-item-description"
            } ${isBeer ? "beer-description" : ""} ${
              isEmpanadas ? "empanadas-description" : ""
            } ${isParaPicar ? "para-picar-description" : ""} ${
              isWine ? "wine-description-spacing" : ""
            } ${
              isTragos ? "tragos-description-no-padding" : ""
            } ${textColor} ${getStyleClasses(
              item.descriptionStyle
            )} whitespace-pre-line ${isWine ? "pt-0 pb-0" : "pt-0 pb-1"}`}
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        ) : isWine ? (
          <div className="h-4"></div> // Placeholder para mantener altura consistente
        ) : null}

        {/* Pricing - formatted with $ and .– */}
        <div className={`${isWine ? "pt-2" : "pt-1"} text-center mb-0`}>
          {isWine && item.glassPrice && item.bottlePrice ? (
            <div className="flex flex-col items-center justify-center gap-1 mb-0">
              <span className={`font-price ${textColor}`}>
                copa ${item.glassPrice}.–
              </span>
              <span className={`font-price ${textColor}`}>
                botella ${item.bottlePrice}.–
              </span>
            </div>
          ) : (
            <span
              className={`${
                isTragos ? "font-tragos-price" : "font-price"
              } ${textColor}`}
            >
              ${item.price}.–
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
