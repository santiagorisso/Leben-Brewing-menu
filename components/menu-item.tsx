import type { MenuItem as MenuItemType } from "@/lib/types"
import Image from "next/image"

interface MenuItemProps {
  item: MenuItemType
  categorySlug: string
}

export function MenuItem({ item, categorySlug }: MenuItemProps) {
  const isBeer = categorySlug === "beers"
  const isWine = categorySlug === "wines"

  return (
    <div className="relative py-8 text-center">
      {!item.available && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Image src="/images/soldout.png" alt="Sold Out" width={300} height={150} className="opacity-70" />
        </div>
      )}

      {/* Item Content */}
      <div className="space-y-2">
        {/* Name and Vegetarian Badge */}
        <div className="flex items-center justify-center gap-2">
          <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">{item.name}</h3>
          {item.vegetarian && (
            <Image src="/images/veggie.png" alt="Vegetarian" width={20} height={20} className="shrink-0" />
          )}
        </div>

        {/* Beer Stats - IBU and ABV on same line */}
        {isBeer && (item.ibu || item.abv) && (
          <div className="flex items-center justify-center gap-3 text-sm text-foreground/80">
            {item.ibu && <span>IBU: {item.ibu}</span>}
            {item.abv && <span>ABV: {item.abv}</span>}
          </div>
        )}

        {/* Description - gray and italicized */}
        {item.description && (
          <p className="mx-auto max-w-2xl text-sm italic leading-relaxed text-muted">{item.description}</p>
        )}

        {/* Pricing - bright orange, centered */}
        <div className="pt-2">
          {isWine && item.glassPrice && item.bottlePrice ? (
            <div className="flex items-center justify-center gap-2 text-lg font-semibold">
              <span className="text-accent">copa ${item.glassPrice}</span>
              <span className="text-muted">/</span>
              <span className="text-accent">botella ${item.bottlePrice}</span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-accent">${item.price}</span>
          )}
        </div>
      </div>
    </div>
  )
}
