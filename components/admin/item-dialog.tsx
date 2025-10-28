"use client";

import type React from "react";

import { useState, useEffect } from "react";
import type { MenuItem, MenuCategory, TextStyle } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Bold, Italic } from "lucide-react";

interface ItemDialogProps {
  item: MenuItem;
  categorySlug: string;
  category?: MenuCategory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: MenuItem) => void;
}

export function ItemDialog({
  item,
  categorySlug,
  category,
  open,
  onOpenChange,
  onSave,
}: ItemDialogProps) {
  const [formData, setFormData] = useState(item);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  const isBeer = categorySlug === "beers";
  const isWine = categorySlug === "wines" || categorySlug === "vinos";
  const isPizza = categorySlug === "pizzas";

  // Get available subcategories for pizza category
  const subcategories = category?.subcategories || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleStyleToggle = (
    field: "titleStyle" | "descriptionStyle" | "sideNoteStyle",
    property: "bold" | "italic",
    value: boolean
  ) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        [property]: value,
      },
    });
  };

  const StyleToggleButtons = ({
    field,
    label,
  }: {
    field: "titleStyle" | "descriptionStyle" | "sideNoteStyle";
    label: string;
  }) => (
    <div className="space-y-2">
      <Label>{label} Style</Label>
      <div className="flex gap-2">
        <Button
          type="button"
          variant={formData[field]?.bold ? "default" : "outline"}
          size="sm"
          onClick={() =>
            handleStyleToggle(field, "bold", !formData[field]?.bold)
          }
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={formData[field]?.italic ? "default" : "outline"}
          size="sm"
          onClick={() =>
            handleStyleToggle(field, "italic", !formData[field]?.italic)
          }
        >
          <Italic className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item.name ? "Edit Item" : "Add New Item"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {!isWine && (
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: Number.parseFloat(e.target.value),
                    })
                  }
                  required={!isWine}
                />
              </div>
            )}

            {isWine && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="glassPrice">Glass Price</Label>
                  <Input
                    id="glassPrice"
                    type="number"
                    step="0.01"
                    value={formData.glassPrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        glassPrice: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bottlePrice">Bottle Price</Label>
                  <Input
                    id="bottlePrice"
                    type="number"
                    step="0.01"
                    value={formData.bottlePrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bottlePrice: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wineType">Wine Type *</Label>
                  <select
                    id="wineType"
                    value={formData.wineType || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        wineType: e.target.value as "Tinto" | "Blanco",
                      })
                    }
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select type</option>
                    <option value="Tinto">Tinto (Red)</option>
                    <option value="Blanco">Blanco (White)</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              placeholder='Use <b>text</b> for bold, e.g., "Classic with <b>ground beef</b>"'
            />
            <p className="text-xs text-muted-foreground">
              Use &lt;b&gt;text&lt;/b&gt; to make specific words bold
            </p>
            <StyleToggleButtons field="descriptionStyle" label="Description" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sideNote">Side Note</Label>
            <Input
              id="sideNote"
              value={formData.sideNote || ""}
              onChange={(e) =>
                setFormData({ ...formData, sideNote: e.target.value })
              }
              placeholder="e.g., dip, Gluten Free"
            />
            <StyleToggleButtons field="sideNoteStyle" label="Side Note" />

            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="showPlusBeforeSideNote"
                checked={formData.showPlusBeforeSideNote || false}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    showPlusBeforeSideNote: checked as boolean,
                  })
                }
              />
              <Label
                htmlFor="showPlusBeforeSideNote"
                className="cursor-pointer text-sm"
              >
                Show "+" before side note (for alignment)
              </Label>
            </div>
          </div>

          {/* Subcategory selector for Pizzas */}
          {isPizza && (
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory *</Label>
              {subcategories.length > 0 ? (
                <select
                  id="subcategory"
                  value={formData.subcategoryId || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subcategoryId: e.target.value || undefined,
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select a subcategory</option>
                  {subcategories.map((subcat) => (
                    <option key={subcat.id} value={subcat.id}>
                      {subcat.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-sm text-muted">
                  No subcategories available. Please add subcategories to this
                  category.
                </div>
              )}
            </div>
          )}

          <StyleToggleButtons field="titleStyle" label="Title" />

          {isBeer && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ibu">IBU</Label>
                <Input
                  id="ibu"
                  type="number"
                  value={formData.ibu || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ibu: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="abv">ABV (%)</Label>
                <Input
                  id="abv"
                  type="number"
                  step="0.1"
                  value={formData.abv || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      abv: Number.parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="vegetarian"
              checked={formData.vegetarian || false}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, vegetarian: checked as boolean })
              }
            />
            <Label htmlFor="vegetarian" className="cursor-pointer">
              Vegetarian
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, available: checked as boolean })
              }
            />
            <Label htmlFor="available" className="cursor-pointer">
              Available
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
