"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth"
import { getMenuData } from "@/lib/supabase-storage-client"
import type { MenuData } from "@/lib/types"
import { MenuEditor } from "./menu-editor"

export function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [menuData, setMenuData] = useState<MenuData | null>(null)

  useEffect(() => {
    loadMenuData()
  }, [])

  const loadMenuData = async () => {
    const data = await getMenuData()
    setMenuData(data)
  }

  const handleSignOut = async () => {
    setLoading(true)
    await signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen">
      {/* Admin Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">Menu Admin</h1>
          <Button variant="outline" onClick={handleSignOut} disabled={loading}>
            {loading ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </header>

      {/* Admin Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Menu Management</h2>
            <p className="mt-1 text-sm text-muted">Drag and drop to reorder categories and items</p>
          </div>

          {menuData ? (
            <MenuEditor data={menuData} onUpdate={loadMenuData} />
          ) : (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <p className="text-muted">Loading menu data...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
