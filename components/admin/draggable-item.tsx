"use client";

import type React from "react";

import type { MenuItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { GripVertical, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface DraggableItemProps {
  item: MenuItem;
  index: number;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onToggleAvailability: (itemId: string) => void;
  onToggleActive: (itemId: string) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
  isSaving?: boolean;
}

export function DraggableItem({
  item,
  index,
  onDragStart,
  onDragOver,
  onDrop,
  onToggleAvailability,
  onToggleActive,
  onEdit,
  onDelete,
  isSaving = false,
}: DraggableItemProps) {
  const isActive = item.active !== false; // Default to true

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-background p-3 transition-all hover:border-accent/50 hover:bg-accent/5",
        !item.available && "opacity-60",
        !isActive && "opacity-40 bg-muted/10 border-dashed"
      )}
    >
      <GripVertical className="h-5 w-5 shrink-0 cursor-grab text-muted active:cursor-grabbing" />

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{item.name}</span>
          {!isActive && (
             <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-semibold uppercase text-muted-foreground">
              Hidden
            </span>
          )}
          {item.sideNote && (
            <span className="text-xs text-muted">{item.sideNote}</span>
          )}
          {item.vegetarian && (
            <span className="rounded bg-accent/20 px-1.5 py-0.5 text-xs font-semibold uppercase text-accent">
              V
            </span>
          )}
        </div>
        {item.description && (
          <p className="mt-1 text-sm text-muted whitespace-pre-line">
            {item.description}
          </p>
        )}
        <div className="mt-1 flex gap-3 text-sm text-muted">
          {item.price && <span>${item.price}</span>}
          {item.glassPrice && item.bottlePrice && (
            <span>
              Glass ${item.glassPrice} / Bottle ${item.bottlePrice}
            </span>
          )}
          {item.ibu && <span>IBU: {item.ibu}</span>}
          {item.abv && <span>ABV: {item.abv}%</span>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onToggleActive(item.id)}
          title={isActive ? "Make Hidden" : "Make Visible"}
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : isActive ? (
             <Eye className="h-4 w-4" />
          ) : (
             <EyeOff className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEdit(item)} disabled={isSaving}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)} disabled={isSaving}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
        <Button
          variant={item.available ? "outline" : "default"}
          size="sm"
          onClick={() => onToggleAvailability(item.id)}
          disabled={isSaving}
        >
          {isSaving ? (
             <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : item.available ? (
            "Available"
          ) : (
            "Sold Out"
          )}
        </Button>
      </div>
    </div>
  );
}
