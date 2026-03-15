import { supabase } from "./supabase"
import type { Message } from "@/types"

export async function getMessages(roomId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("id, room_id, user_id, content, created_at, users(display_name)")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true })
  if (error) throw error
  return data.map((row) => ({
    ...row,
    users: Array.isArray(row.users) ? (row.users[0] ?? null) : row.users,
  })) as Message[]
}

export async function sendMessage(roomId: string, content: string): Promise<void> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("messages")
    .insert({ room_id: roomId, user_id: user.id, content })
  if (error) throw error
}

export function subscribeMessages(
  roomId: string,
  onInsert: (messages: Message[]) => void,
): () => void {
  const channel = supabase
    .channel(`messages:${roomId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
      () => {
        getMessages(roomId).then(onInsert).catch(console.error)
      },
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
