// Menu data types based on requirements

export interface MenuItem {
  id: string
  name: string
  description?: string
  price?: number
  glassPrice?: number // For wines
  bottlePrice?: number // For wines
  available: boolean
  vegetarian?: boolean
  ibu?: number // For beers
  abv?: number // For beers
  imageUrl?: string
  order: string // Fractional index for ordering
}

export interface MenuCategory {
  id: string
  name: string
  slug: string
  items: MenuItem[]
  order: string // Fractional index for ordering
}

export interface MenuData {
  categories: MenuCategory[]
  lastUpdated: string
}

export interface Promo {
  id: string
  title: string
  description: string
  active: boolean
  order: string
}

export interface Combo {
  id: string
  name: string
  description: string
  price: number
  items: string[] // Item IDs
  available: boolean
  order: string
}
