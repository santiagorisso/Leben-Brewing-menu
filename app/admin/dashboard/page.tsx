import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return <AdminDashboard />
}
