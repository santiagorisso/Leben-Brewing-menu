"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { MenuItem } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface ItemDialogProps {
  item: MenuItem
  categorySlug: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (item: MenuItem) => void
}

export function ItemDialog({ item, categorySlug, open, onOpenChange, onSave }: ItemDialogProps) {
  const [formData, setFormData] = useState(item)

  useEffect(() => {
    setFormData(item)
  }, [item])

  const isBeer = categorySlug === "beers"
  const isWine = categorySlug === "wines"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
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
                    onChange={(e) => setFormData({ ...formData, glassPrice: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bottlePrice">Bottle Price</Label>
                  <Input
                    id="bottlePrice"
                    type="number"
                    step="0.01"
                    value={formData.bottlePrice || ""}
                    onChange={(e) => setFormData({ ...formData, bottlePrice: Number.parseFloat(e.target.value) })}
                  />
                </div>
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {isBeer && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ibu">IBU</Label>
                <Input
                  id="ibu"
                  type="number"
                  value={formData.ibu || ""}
                  onChange={(e) => setFormData({ ...formData, ibu: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="abv">ABV (%)</Label>
                <Input
                  id="abv"
                  type="number"
                  step="0.1"
                  value={formData.abv || ""}
                  onChange={(e) => setFormData({ ...formData, abv: Number.parseFloat(e.target.value) })}
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="vegetarian"
              checked={formData.vegetarian || false}
              onCheckedChange={(checked) => setFormData({ ...formData, vegetarian: checked as boolean })}
            />
            <Label htmlFor="vegetarian" className="cursor-pointer">
              Vegetarian
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) => setFormData({ ...formData, available: checked as boolean })}
            />
            <Label htmlFor="available" className="cursor-pointer">
              Available
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
