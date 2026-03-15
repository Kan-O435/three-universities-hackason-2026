import { supabase } from "./supabase"
import type { Room, RoomPreview } from "@/types"

export async function getMyRooms(): Promise<Room[]> {
  const { data, error } = await supabase
    .from("rooms")
    .select("id, name, description, expires_at, owner_id, invite_code, created_at, updated_at")
    .order("expires_at", { ascending: true })
  if (error) throw error
  return data as Room[]
}

export async function getRoomDetail(roomId: string): Promise<Room> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", roomId)
    .single()
  if (error) throw error
  return data as Room
}

export async function getRoomPreview(roomId: string): Promise<RoomPreview> {
  const { data, error } = await supabase.rpc("get_room_preview", { p_room_id: roomId })
  if (error) throw error
  if (!data || data.length === 0) throw new Error("Room not found")
  return data[0] as RoomPreview
}

export async function createRoom(
  name: string,
  description: string | null,
  expiresAt: string,
): Promise<Room> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  if (!user) throw new Error("Not authenticated")
  const { data, error } = await supabase
    .from("rooms")
    .insert({ name, description, expires_at: expiresAt, owner_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data as Room
}

export async function joinRoom(roomId: string, inviteCode: string): Promise<void> {
  const { error } = await supabase.rpc("join_room", {
    p_room_id: roomId,
    p_invite_code: inviteCode,
  })
  if (error) throw error
}
