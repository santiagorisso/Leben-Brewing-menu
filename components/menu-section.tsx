import type { MenuCategory } from "@/lib/types"
import { MenuItem } from "./menu-item"
import { sortByOrder } from "@/lib/fractional-index"

interface MenuSectionProps {
  category: MenuCategory
}

export function MenuSection({ category }: MenuSectionProps) {
  const sortedItems = sortByOrder(category.items)

  return (
    <section id={category.slug} className="space-y-8">
      <h2 className="text-center font-display text-5xl font-bold uppercase tracking-tight text-foreground">
        {category.name}
      </h2>
      <div className="space-y-0">
        {sortedItems.map((item, index) => (
          <div key={item.id}>
            <MenuItem item={item} categorySlug={category.slug} />
            {index < sortedItems.length - 1 && <div className="h-px bg-border/30" />}
          </div>
        ))}
      </div>
    </section>
  )
}
