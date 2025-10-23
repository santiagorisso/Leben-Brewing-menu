import { LoginForm } from "@/components/admin/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground">Admin Login</h1>
          <p className="mt-2 text-sm text-muted">Sign in to manage your menu</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
