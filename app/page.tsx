import { MenuDisplay } from "@/components/menu-display"
import { getMenuDataServer } from "@/lib/supabase-storage-server"

export default async function HomePage() {
  const menuData = await getMenuDataServer()

  return (
    <main className="min-h-screen">
      <MenuDisplay data={menuData} />
    </main>
  )
}
