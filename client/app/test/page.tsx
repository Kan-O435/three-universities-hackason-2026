"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

type Result = { ok: boolean; label: string; message: string }

export default function TestPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [roomId, setRoomId] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const [results, setResults] = useState<Result[]>([])

  function log(label: string, ok: boolean, message: string) {
    setResults((prev) => [...prev, { ok, label, message }])
  }

  // ① 認証
  async function testSignUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    })
    if (error) log("サインアップ", false, error.message)
    else log("サインアップ", true, "成功（メール確認が必要な場合あり）")
  }

  async function testSignIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) log("サインイン", false, error.message)
    else log("サインイン", true, "成功")
  }

  async function testSignOut() {
    const { error } = await supabase.auth.signOut()
    if (error) log("サインアウト", false, error.message)
    else log("サインアウト", true, "成功")
  }

  async function testGetUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error) log("ユーザー取得", false, error.message)
    else log("ユーザー取得", true, `id=${data.user?.id} email=${data.user?.email}`)
  }

  // ② ルーム操作
  async function testCreateRoom() {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return log("ルーム作成", false, "未ログイン")

    const { data, error } = await supabase
      .from("rooms")
      .insert({
        name: "テストルーム",
        description: "テスト用",
        owner_id: userData.user.id,
        expires_at: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      })
      .select("id, invite_code")
      .single()

    if (error) log("ルーム作成", false, error.message)
    else {
      log("ルーム作成", true, `id=${data.id} invite_code=${data.invite_code}`)
      setRoomId(data.id)
      setInviteCode(data.invite_code)
    }
  }

  async function testGetMyRooms() {
    const { data, error } = await supabase
      .from("room_members")
      .select("room_id, joined_at, rooms(id, name, invite_code, expires_at, owner_id)")
    if (error) log("参加ルーム一覧", false, error.message)
    else {
      const lines = data.map((m) => {
        const r = m.rooms as { name: string; invite_code: string } | { name: string; invite_code: string }[] | null
        const room = Array.isArray(r) ? r[0] : r
        return `${room?.name}（id=${m.room_id} invite_code=${room?.invite_code}）`
      })
      log("参加ルーム一覧", true, lines.length ? lines.join(" / ") : "0件")
    }
  }

  async function testGetRoomDetail() {
    if (!roomId) return log("ルーム詳細", false, "roomId が未設定")
    const { data, error } = await supabase
      .from("rooms")
      .select("id, name, description, invite_code, expires_at, owner_id")
      .eq("id", roomId)
      .single()
    if (error) log("ルーム詳細", false, error.message)
    else log("ルーム詳細", true, `name=${data.name} invite_code=${data.invite_code} expires=${data.expires_at}`)
  }

  async function testGetRoomPreview() {
    if (!roomId) return log("get_room_preview", false, "roomId が未設定")
    const { data, error } = await supabase.rpc("get_room_preview", { p_room_id: roomId })
    if (error) log("get_room_preview", false, error.message)
    else {
      const r = Array.isArray(data) ? data[0] : data
      log("get_room_preview", true, `name=${r?.name} owner=${r?.owner_name} expires=${r?.expires_at}`)
    }
  }

  async function testJoinRoom() {
    if (!roomId || !inviteCode) return log("join_room", false, "roomId または inviteCode が未設定")
    const { error } = await supabase.rpc("join_room", {
      p_room_id: roomId,
      p_invite_code: inviteCode,
    })
    if (error) log("join_room", false, error.message)
    else log("join_room", true, "参加成功")
  }

  // ③ メッセージ
  async function testSendMessage() {
    if (!roomId) return log("メッセージ送信", false, "roomId が未設定")
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return log("メッセージ送信", false, "未ログイン")

    const { error } = await supabase.from("messages").insert({
      room_id: roomId,
      user_id: userData.user.id,
      content: "テストメッセージ",
    })
    if (error) log("メッセージ送信", false, error.message)
    else log("メッセージ送信", true, "成功")
  }

  async function testReadMessages() {
    if (!roomId) return log("メッセージ取得", false, "roomId が未設定")
    const { data, error } = await supabase
      .from("messages")
      .select("id, content, created_at")
      .eq("room_id", roomId)
      .order("created_at")
    if (error) log("メッセージ取得", false, error.message)
    else log("メッセージ取得", true, `${data.length}件: ${data.map((m) => m.content).join(" / ")}`)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Supabase 動作確認</h1>

      {/* 認証情報 */}
      <div className="space-y-2 border p-4 rounded">
        <p className="font-semibold">認証情報</p>
        <input className="input input-bordered w-full" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input input-bordered w-full" placeholder="パスワード" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className="input input-bordered w-full" placeholder="表示名（サインアップ時のみ）" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
      </div>

      {/* ① 認証テスト */}
      <div className="space-y-2">
        <p className="font-semibold">① 認証</p>
        <div className="flex gap-2 flex-wrap">
          <button className="btn btn-sm" onClick={testSignUp}>サインアップ</button>
          <button className="btn btn-sm" onClick={testSignIn}>サインイン</button>
          <button className="btn btn-sm" onClick={testSignOut}>サインアウト</button>
          <button className="btn btn-sm" onClick={testGetUser}>ユーザー確認</button>
        </div>
      </div>

      {/* ② ルーム操作 */}
      <div className="space-y-2">
        <p className="font-semibold">② ルーム操作</p>

        {/* roomId / inviteCode 入力（手動入力 or ルーム作成後に自動セット） */}
        <div className="space-y-1">
          <input
            className="input input-bordered w-full input-sm"
            placeholder="roomId（ルーム作成後に自動セット、または手動入力）"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <input
            className="input input-bordered w-full input-sm"
            placeholder="inviteCode（ルーム作成後に自動セット、または手動入力）"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button className="btn btn-sm" onClick={testCreateRoom}>ルーム作成</button>
          <button className="btn btn-sm" onClick={testGetMyRooms}>参加ルーム一覧</button>
          <button className="btn btn-sm" onClick={testGetRoomDetail}>ルーム詳細（招待コード付き）</button>
          <button className="btn btn-sm" onClick={testGetRoomPreview}>ルーム詳細（preview）</button>
          <button className="btn btn-sm" onClick={testJoinRoom}>ルーム参加</button>
        </div>
      </div>

      {/* ③ メッセージ */}
      <div className="space-y-2">
        <p className="font-semibold">③ メッセージ</p>
        <div className="flex gap-2 flex-wrap">
          <button className="btn btn-sm" onClick={testSendMessage}>メッセージ送信</button>
          <button className="btn btn-sm" onClick={testReadMessages}>メッセージ取得</button>
        </div>
      </div>

      {/* 結果ログ */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="font-semibold">結果ログ</p>
          <button className="btn btn-xs" onClick={() => setResults([])}>クリア</button>
        </div>
        <div className="border rounded p-3 space-y-1 min-h-24 font-mono text-sm break-all">
          {results.length === 0 && <p className="text-gray-400">ボタンを押すと結果が表示されます</p>}
          {results.map((r, i) => (
            <p key={i} className={r.ok ? "text-green-600" : "text-red-600"}>
              [{r.ok ? "OK" : "NG"}] {r.label}: {r.message}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
