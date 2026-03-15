export type Room = {
  id: string
  name: string
  description: string | null
  invite_code: string
  expires_at: string
  owner_id: string
  created_at: string
  updated_at: string
}

export type RoomPreview = {
  id: string
  name: string
  description: string | null
  expires_at: string
  owner_name: string
}

export type Message = {
  id: string
  room_id: string
  user_id: string
  content: string
  created_at: string
  users: { display_name: string } | null
}

export type RoomMember = {
  id: string
  room_id: string
  user_id: string
  joined_at: string
  users?: { display_name: string } | null
}

export type UserProfile = {
  id: string
  display_name: string
  created_at: string
  updated_at: string
}
