"use client";

import type React from "react";

import { useState } from "react";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { DraggableItem } from "./draggable-item";
import { generateKeyBetween, sortByOrder } from "@/lib/fractional-index";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { ItemDialog } from "./item-dialog";

interface CategoryEditorProps {
  category: MenuCategory;
  onUpdate: (category: MenuCategory) => void;
}

export function CategoryEditor({ category, onUpdate }: CategoryEditorProps) {
  const [expanded, setExpanded] = useState(true);
  const [items, setItems] = useState(category.items);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = Number.parseInt(e.dataTransfer.getData("text/plain"));

    if (dragIndex === dropIndex) return;

    const sortedItems = sortByOrder(items);
    const draggedItem = sortedItems[dragIndex];

    // Calculate new order value using fractional indexing
    let newOrder: string;

    if (dropIndex === 0) {
      // Moving to first position
      newOrder = generateKeyBetween(null, sortedItems[0].order);
    } else if (dropIndex >= sortedItems.length - 1) {
      // Moving to last position
      newOrder = generateKeyBetween(
        sortedItems[sortedItems.length - 1].order,
        null
      );
    } else {
      // Moving to middle position
      if (dragIndex < dropIndex) {
        // Moving down: place between dropIndex and dropIndex + 1
        newOrder = generateKeyBetween(
          sortedItems[dropIndex].order,
          sortedItems[dropIndex + 1]?.order || null
        );
      } else {
        // Moving up: place between dropIndex - 1 and dropIndex
        newOrder = generateKeyBetween(
          sortedItems[dropIndex - 1]?.order || null,
          sortedItems[dropIndex].order
        );
      }
    }

    const updatedItems = items.map((item) =>
      item.id === draggedItem.id ? { ...item, order: newOrder } : item
    );

    setItems(updatedItems);
    onUpdate({ ...category, items: updatedItems });
  };

  const toggleAvailability = (itemId: string) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, available: !item.available } : item
    );
    setItems(updatedItems);
    onUpdate({ ...category, items: updatedItems });
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleAddItem = () => {
    const sortedItems = sortByOrder(items);
    const lastOrder = sortedItems[sortedItems.length - 1]?.order || null;

    setEditingItem({
      id: `item-${Date.now()}`,
      name: "",
      description: "",
      price: 0,
      available: true,
      order: generateKeyBetween(lastOrder, null),
    });
    setIsDialogOpen(true);
  };

  const handleSaveItem = (item: MenuItem) => {
    const existingIndex = items.findIndex((i) => i.id === item.id);
    let updatedItems: MenuItem[];

    if (existingIndex >= 0) {
      updatedItems = items.map((i) => (i.id === item.id ? item : i));
    } else {
      updatedItems = [...items, item];
    }

    setItems(updatedItems);
    onUpdate({ ...category, items: updatedItems });
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
    onUpdate({ ...category, items: updatedItems });
  };

  const sortedItems = sortByOrder(items);

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
          {category.name}
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleAddItem}>
            <Plus className="mr-1 h-4 w-4" />
            Add Item
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="p-4">
          <div className="space-y-2">
            {sortedItems.map((item, index) => (
              <DraggableItem
                key={item.id}
                item={item}
                index={index}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onToggleAvailability={toggleAvailability}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        </div>
      )}

      {editingItem && (
        <ItemDialog
          item={editingItem}
          categorySlug={category.slug}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSaveItem}
        />
      )}
    </div>
  );
}
