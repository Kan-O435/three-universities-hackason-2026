"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import ChatPanel from "@/components/ChatPanel";
import { getRoomDetail, getRoomMembers } from "@/lib/rooms";
import { isExpired } from "@/lib/formatTimeLabel";
import type { Room } from "@/types";

export default function DmPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;
  const userId = params.userId as string;
  const { user, loading } = useAuth();

  const [room, setRoom] = useState<Room | null>(null);
  const [members, setMembers] = useState<{ userId: string; displayName: string }[]>([]);

  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    getRoomDetail(roomId).then(setRoom).catch(() => router.replace("/home"));
    getRoomMembers(roomId).then(setMembers).catch(console.error);
  }, [roomId, user, router]);

  if (loading || !user || !room) return null;

  const isMemoryMode = isExpired(room.expires_at);
  const chatName = members.find((m) => m.userId === userId)?.displayName ?? "Unknown";

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#F6F7F9] text-[#4A5568]">
      <main className="mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col gap-4 px-3 py-3 md:flex-row md:gap-5 md:px-5 md:py-4">
        <Sidebar
          roomId={roomId}
          activeChat={userId}
          expiresAt={room.expires_at}
          members={members.filter((m) => m.userId !== user.id)}
        />
        <ChatPanel
          title={`Chat: ${chatName}`}
          roomId={roomId}
          currentUserId={user.id}
          isMemoryMode={isMemoryMode}
        />
      </main>
    </div>
  );
}
