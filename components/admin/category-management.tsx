"use client";

import { useState, useEffect } from "react";
import type { MenuCategory, MenuSubcategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  GripVertical,
  Plus,
  Pencil,
  Trash2,
  Bold,
  Italic,
  X,
} from "lucide-react";
import { generateKeyBetween, sortByOrder } from "@/lib/fractional-index";
import { cn } from "@/lib/utils";

interface CategoryManagementProps {
  categories: MenuCategory[];
  onUpdate: (categories: MenuCategory[]) => void;
  onShowNotification: (
    type: "success" | "error",
    title: string,
    message?: string
  ) => void;
}

export function CategoryManagement({
  categories,
  onUpdate,
  onShowNotification,
}: CategoryManagementProps) {
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const sortedCategories = sortByOrder(categories);

  const handleAddCategory = () => {
    // Generate order for new category - place it at the end
    const lastOrder =
      sortedCategories[sortedCategories.length - 1]?.order || null;
    const newOrder = generateKeyBetween(lastOrder, null);

    setEditingCategory({
      id: `category-${Date.now()}`,
      name: "",
      slug: "",
      items: [],
      order: newOrder,
    });
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: MenuCategory) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleSaveCategory = (category: MenuCategory) => {
    if (!category.name.trim()) {
      onShowNotification(
        "error",
        "Validation Error",
        "Category name is required"
      );
      return;
    }

    if (!category.slug.trim()) {
      onShowNotification(
        "error",
        "Validation Error",
        "Category slug is required"
      );
      return;
    }

    // Check for duplicate names (excluding current category)
    const isDuplicateName = categories.some(
      (c) =>
        c.name.toLowerCase() === category.name.toLowerCase() &&
        c.id !== category.id
    );
    if (isDuplicateName) {
      onShowNotification(
        "error",
        "Validation Error",
        "A category with this name already exists"
      );
      return;
    }

    // Check for duplicate slugs (excluding current category)
    const isDuplicateSlug = categories.some(
      (c) => c.slug === category.slug && c.id !== category.id
    );
    if (isDuplicateSlug) {
      onShowNotification(
        "error",
        "Validation Error",
        "A category with this slug already exists"
      );
      return;
    }

    try {
      const existingIndex = categories.findIndex((c) => c.id === category.id);
      let updatedCategories: MenuCategory[];

      if (existingIndex >= 0) {
        updatedCategories = categories.map((c) =>
          c.id === category.id ? category : c
        );
        onShowNotification(
          "success",
          "Category Updated",
          `${category.name} has been updated successfully`
        );
      } else {
        updatedCategories = [...categories, category];
        onShowNotification(
          "success",
          "Category Added",
          `${category.name} has been added successfully`
        );
      }

      onUpdate(updatedCategories);
      setIsDialogOpen(false);
      setEditingCategory(null);
    } catch (error) {
      onShowNotification(
        "error",
        "Save Error",
        "Failed to save category. Please try again."
      );
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    if (category.items.length > 0) {
      onShowNotification(
        "error",
        "Cannot Delete Category",
        "Please remove all items from this category before deleting it."
      );
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete "${category.name}"? This action cannot be undone.`
      )
    ) {
      try {
        const updatedCategories = categories.filter((c) => c.id !== categoryId);
        onUpdate(updatedCategories);
        onShowNotification(
          "success",
          "Category Deleted",
          `${category.name} has been deleted successfully`
        );
      } catch (error) {
        onShowNotification(
          "error",
          "Delete Error",
          "Failed to delete category. Please try again."
        );
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = Number.parseInt(e.dataTransfer.getData("text/plain"));

    if (dragIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    try {
      const draggedCategory = sortedCategories[dragIndex];

      // Calculate new order value using fractional indexing
      let newOrder: string;

      if (dropIndex === 0) {
        // Moving to first position
        newOrder = generateKeyBetween(null, sortedCategories[0].order);
      } else if (dropIndex >= sortedCategories.length - 1) {
        // Moving to last position
        newOrder = generateKeyBetween(
          sortedCategories[sortedCategories.length - 1].order,
          null
        );
      } else {
        // Moving to middle position
        if (dragIndex < dropIndex) {
          // Moving down: place between dropIndex and dropIndex + 1
          newOrder = generateKeyBetween(
            sortedCategories[dropIndex].order,
            sortedCategories[dropIndex + 1]?.order || null
          );
        } else {
          // Moving up: place between dropIndex - 1 and dropIndex
          newOrder = generateKeyBetween(
            sortedCategories[dropIndex - 1]?.order || null,
            sortedCategories[dropIndex].order
          );
        }
      }

      const updatedCategories = categories.map((category) =>
        category.id === draggedCategory.id
          ? { ...category, order: newOrder }
          : category
      );

      onUpdate(updatedCategories);
      onShowNotification(
        "success",
        "Categories Reordered",
        "Category order has been updated successfully"
      );
    } catch (error) {
      onShowNotification(
        "error",
        "Reorder Error",
        "Failed to reorder categories. Please try again."
      );
    } finally {
      setDraggedIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Categories</h3>
        <Button onClick={handleAddCategory} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="space-y-2">
        {sortedCategories.map((category, index) => (
          <div
            key={category.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={cn(
              "flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-accent/50 hover:bg-accent/5",
              draggedIndex === index && "opacity-50"
            )}
          >
            <GripVertical className="h-5 w-5 shrink-0 cursor-grab text-muted active:cursor-grabbing" />

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">
                  {category.name}
                </h4>
                <span className="rounded bg-muted px-2 py-1 text-xs font-mono text-muted-foreground">
                  {category.slug}
                </span>
              </div>
              {category.description && (
                <p className="text-sm italic text-muted font-sans mt-1">
                  {category.description}
                </p>
              )}
              <p className="text-sm text-muted">
                {category.items.length} item
                {category.items.length !== 1 ? "s" : ""}
                {category.subcategories &&
                  category.subcategories.length > 0 && (
                    <span className="ml-2">
                      • {category.subcategories.length} subcategor
                      {category.subcategories.length !== 1 ? "ies" : "y"}
                    </span>
                  )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditCategory(category)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteCategory(category.id)}
                disabled={category.items.length > 0}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editingCategory && (
        <CategoryDialog
          category={editingCategory}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  );
}

interface CategoryDialogProps {
  category: MenuCategory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (category: MenuCategory) => void;
}

function CategoryDialog({
  category,
  open,
  onOpenChange,
  onSave,
}: CategoryDialogProps) {
  const [formData, setFormData] = useState(category);

  // Update form data when category prop changes to fix stale state bug
  useEffect(() => {
    setFormData(category);
  }, [category.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: formData.slug || generateSlug(name),
    });
  };

  const handleStyleToggle = (
    field: "titleStyle" | "descriptionStyle",
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

  const handleAddSubcategory = () => {
    const newSubcategory = {
      id: `subcategory-${Date.now()}`,
      name: "",
      slug: "",
      description: "",
      items: [],
      order: `a${formData.subcategories?.length || 0}`,
    };
    setFormData({
      ...formData,
      subcategories: [...(formData.subcategories || []), newSubcategory],
    });
  };

  const handleDeleteSubcategory = (subcategoryId: string) => {
    setFormData({
      ...formData,
      subcategories:
        formData.subcategories?.filter((sub) => sub.id !== subcategoryId) || [],
    });
  };

  const handleSubcategoryChange = (
    subcategoryId: string,
    field: "name" | "slug" | "description",
    value: string
  ) => {
    setFormData({
      ...formData,
      subcategories:
        formData.subcategories?.map((sub) => {
          if (sub.id === subcategoryId) {
            if (field === "name") {
              // Auto-generate slug from name
              const slug = generateSlug(value);
              return { ...sub, name: value, slug };
            }
            return { ...sub, [field]: value };
          }
          return sub;
        }) || [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {category.name ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Beers, Wines, Food"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="e.g., beers, wines, food"
              required
            />
            <p className="text-xs text-muted">
              This will be used in the URL. Use lowercase letters, numbers, and
              hyphens only.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Optional description for this category"
              rows={3}
            />
            <p className="text-xs text-muted">
              This description will be displayed below the category title in
              italic Helvetica font.
            </p>
          </div>

          {/* Title Style */}
          <div className="space-y-2">
            <Label>Title Style</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.titleStyle?.bold ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  handleStyleToggle(
                    "titleStyle",
                    "bold",
                    !formData.titleStyle?.bold
                  )
                }
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={formData.titleStyle?.italic ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  handleStyleToggle(
                    "titleStyle",
                    "italic",
                    !formData.titleStyle?.italic
                  )
                }
              >
                <Italic className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Description Style */}
          <div className="space-y-2">
            <Label>Description Style</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={
                  formData.descriptionStyle?.bold ? "default" : "outline"
                }
                size="sm"
                onClick={() =>
                  handleStyleToggle(
                    "descriptionStyle",
                    "bold",
                    !formData.descriptionStyle?.bold
                  )
                }
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={
                  formData.descriptionStyle?.italic ? "default" : "outline"
                }
                size="sm"
                onClick={() =>
                  handleStyleToggle(
                    "descriptionStyle",
                    "italic",
                    !formData.descriptionStyle?.italic
                  )
                }
              >
                <Italic className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Subcategories */}
          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <Label>Subcategories</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSubcategory}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Subcategory
              </Button>
            </div>

            {formData.subcategories && formData.subcategories.length > 0 && (
              <div className="space-y-3">
                {formData.subcategories.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className="rounded-lg border border-border p-3 space-y-2 bg-muted/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {subcategory.name || "New Subcategory"}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSubcategory(subcategory.id)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <Label
                          htmlFor={`subcat-name-${subcategory.id}`}
                          className="text-xs"
                        >
                          Name *
                        </Label>
                        <Input
                          id={`subcat-name-${subcategory.id}`}
                          value={subcategory.name}
                          onChange={(e) =>
                            handleSubcategoryChange(
                              subcategory.id,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="e.g., A LA PIEDRA"
                          className="h-8 text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor={`subcat-slug-${subcategory.id}`}
                          className="text-xs"
                        >
                          Slug
                        </Label>
                        <Input
                          id={`subcat-slug-${subcategory.id}`}
                          value={subcategory.slug}
                          onChange={(e) =>
                            handleSubcategoryChange(
                              subcategory.id,
                              "slug",
                              e.target.value
                            )
                          }
                          placeholder="Auto-generated from name"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor={`subcat-desc-${subcategory.id}`}
                          className="text-xs"
                        >
                          Description (Optional)
                        </Label>
                        <Textarea
                          id={`subcat-desc-${subcategory.id}`}
                          value={subcategory.description || ""}
                          onChange={(e) =>
                            handleSubcategoryChange(
                              subcategory.id,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Optional description"
                          className="h-16 text-sm"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted">
              Items in this category can be assigned to subcategories when
              adding/editing them.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Category</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
