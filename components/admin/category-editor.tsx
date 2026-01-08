"use client";

import type React from "react";

import { useState, useEffect } from "react";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { DraggableItem } from "./draggable-item";
import { generateKeyBetween, sortByOrder } from "@/lib/fractional-index";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { ItemDialog } from "./item-dialog";

interface CategoryEditorProps {
  category: MenuCategory;
  onUpdate: (category: MenuCategory) => void;
  onAutoSave?: (category: MenuCategory) => Promise<void>;
}

export function CategoryEditor({ category, onUpdate, onAutoSave, showInactive = false }: CategoryEditorProps & { showInactive?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState(category.items);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [savingItemId, setSavingItemId] = useState<string | null>(null);

  // Update local state when category prop changes to prevent stale state
  useEffect(() => {
    setItems(category.items);
  }, [category.id]);

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

    // We are dragging within the VISIBLE list.
    // Need to map back to the full list to determine correct order keys.
    const sortedItems = sortByOrder(items);
    
    // Filter items based on visibility to match what the user sees
    const visibleItems = showInactive 
      ? sortedItems 
      : sortedItems.filter(item => item.active !== false);
      
    const draggedItem = visibleItems[dragIndex];
    if (!draggedItem) return;

    // Calculate new order value using fractional indexing
    let newOrder: string;

    if (dropIndex === 0) {
      // Moving to first position in the VISIBLE list
      // We want to be immediately before the first visible item
      // But we must respect any hidden items that are physically before the first visible item
      const successor = visibleItems[0];
      const successorIndexInFull = sortedItems.findIndex(i => i.id === successor.id);
      const predecessorInFull = successorIndexInFull > 0 ? sortedItems[successorIndexInFull - 1] : null;
      
      newOrder = generateKeyBetween(predecessorInFull?.order || null, successor.order);
    } else {
      // Moving to after the (dropIndex - 1)th item in the visible list
      const predecessor = visibleItems[dropIndex - 1]; // This is the item we want to be after
      
      // Find what is physically after this predecessor in the full list (could be a hidden item)
      const predecessorIndexInFull = sortedItems.findIndex(i => i.id === predecessor.id);
      const successorInFull = predecessorIndexInFull < sortedItems.length - 1 
        ? sortedItems[predecessorIndexInFull + 1] 
        : null;
        
      newOrder = generateKeyBetween(predecessor.order, successorInFull?.order || null);
    }

    const updatedItems = items.map((item) =>
      item.id === draggedItem.id ? { ...item, order: newOrder } : item
    );

    setItems(updatedItems);
    onUpdate({ ...category, items: updatedItems });
  };

  const toggleAvailability = async (itemId: string) => {
    setSavingItemId(itemId);
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, available: !item.available } : item
    );
    setItems(updatedItems);
    const updatedCategory = { ...category, items: updatedItems };
    onUpdate(updatedCategory);
    
    if (onAutoSave) {
        await onAutoSave(updatedCategory);
    }
    setSavingItemId(null);
  };

  const toggleActive = async (itemId: string) => {
    setSavingItemId(itemId);
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? { ...item, active: item.active === false ? true : false }
        : item
    );
    setItems(updatedItems);
    const updatedCategory = { ...category, items: updatedItems };
    onUpdate(updatedCategory);

    if (onAutoSave) {
        await onAutoSave(updatedCategory);
    }
    setSavingItemId(null);
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
  const visibleItems = showInactive 
    ? sortedItems 
    : sortedItems.filter(item => item.active !== false);

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
            {visibleItems.map((item, index) => (
              <DraggableItem
                key={item.id}
                item={item}
                index={index}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onToggleAvailability={toggleAvailability}
                onToggleActive={toggleActive}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                isSaving={savingItemId === item.id}
              />
            ))}
          </div>
        </div>
      )}

      {editingItem && (
        <ItemDialog
          item={editingItem}
          categorySlug={category.slug}
          category={category}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSaveItem}
        />
      )}
    </div>
  );
}
