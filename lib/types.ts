// Menu data types based on requirements

export interface TextStyle {
  bold?: boolean;
  italic?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  sideNote?: string; // Optional side note for small clarifications
  showPlusBeforeSideNote?: boolean; // Show "+" before side note for alignment
  price?: number;
  glassPrice?: number; // For wines
  bottlePrice?: number; // For wines
  wineType?: "Tinto" | "Blanco"; // For wines - red or white
  active?: boolean; // Controls public visibility
  available: boolean;
  vegetarian?: boolean;
  ibu?: number; // For beers
  abv?: number; // For beers
  imageUrl?: string;
  order: string; // Fractional index for ordering
  subcategoryId?: string; // For items belonging to subcategories
  // Text style options
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  sideNoteStyle?: TextStyle;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  items: MenuItem[];
  subcategories?: MenuSubcategory[];
  order: string; // Fractional index for ordering
  // Text style options
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
}

export interface MenuSubcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  items: MenuItem[];
  order: string; // Fractional index for ordering
  // Text style options
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
}

export interface MenuData {
  categories: MenuCategory[];
  lastUpdated: string;
}

export interface Promo {
  id: string;
  title: string;
  description: string;
  active: boolean;
  order: string;
}

export interface Combo {
  id: string;
  name: string;
  description: string;
  price: number;
  items: string[]; // Item IDs
  available: boolean;
  order: string;
}
