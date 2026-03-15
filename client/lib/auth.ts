import { supabase } from "./supabase"
import type { UserProfile } from "@/types"

export async function signUp(email: string, password: string, displayName: string): Promise<void> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  })
  if (error) throw error
}

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("users")
    .select("id, display_name, created_at, updated_at")
    .eq("id", userId)
    .single()
  if (error) throw error
  return data as UserProfile
}

export async function updateDisplayName(userId: string, displayName: string): Promise<void> {
  const { error: dbError } = await supabase
    .from("users")
    .update({ display_name: displayName })
    .eq("id", userId)
  if (dbError) throw dbError

  const { error: authError } = await supabase.auth.updateUser({
    data: { display_name: displayName },
  })
  if (authError) throw authError
}
