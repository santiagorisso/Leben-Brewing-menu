"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export interface User {
  id: string
  email: string
}

export async function signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { user: null, error: error.message }
    }

    if (data.user) {
      return {
        user: {
          id: data.user.id,
          email: data.user.email || "",
        },
        error: null,
      }
    }

    return { user: null, error: "Authentication failed" }
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : "An error occurred",
    }
  }
}

export async function signUp(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.SUPABASE_SUPABASE_URL}/admin/dashboard`,
      },
    })

    if (error) {
      return { user: null, error: error.message }
    }

    if (data.user) {
      return {
        user: {
          id: data.user.id,
          email: data.user.email || "",
        },
        error: null,
      }
    }

    return { user: null, error: "Sign up failed" }
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : "An error occurred",
    }
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}

export async function getUser(): Promise<User | null> {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return {
    id: user.id,
    email: user.email || "",
  }
}
