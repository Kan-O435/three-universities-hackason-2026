"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import GroupCard from "@/components/GroupCard";
import CreateGroupCard from "@/components/CreateGroupCard";
import { getMyRooms } from "@/lib/rooms";
import { formatTimeLabel, isExpired } from "@/lib/formatTimeLabel";
import type { Room } from "@/types";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isMemoryMode, setIsMemoryMode] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    getMyRooms().then(setRooms).catch(console.error);
  }, [user]);

  // アクティブルームの残り時間を毎秒更新
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (loading || !user) return null;

  const activeRooms = rooms.filter((r) => !isExpired(r.expires_at));
  const memoryRooms = rooms.filter((r) => isExpired(r.expires_at));

  return (
    <main className="px-[var(--page-padding)] py-6">
        <div className="mx-auto max-w-[var(--max-width-content)]">
          {/* toggle + mode label */}
          <div className="mb-8 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsMemoryMode((prev) => !prev)}
              className="relative flex h-8 w-16 items-center rounded-full bg-[var(--color-memory)] px-1 transition-colors"
            >
              <span
                className={`h-6 w-6 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-card)] transition-transform duration-200 ${
                  isMemoryMode ? "translate-x-8" : "translate-x-0"
                }`}
              />
            </button>

            <span className="text-sm font-semibold text-[var(--color-text)] sm:text-base">
              {isMemoryMode ? "Memory" : "Active"}
            </span>
          </div>

          {/* cards */}
          <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {!isMemoryMode && (
              <CreateGroupCard
                onClick={() => {
                  router.push("/rooms/new");
                }}
              />
            )}

            {!isMemoryMode &&
              activeRooms.map((room) => (
                <GroupCard
                  key={room.id}
                  groupName={room.name}
                  timeLabel={formatTimeLabel(room.expires_at)}
                  onClick={() => router.push(`/rooms/${room.id}`)}
                />
              ))}

            {isMemoryMode &&
              memoryRooms.map((room) => (
                <GroupCard
                  key={room.id}
                  groupName={room.name}
                  timeLabel={formatTimeLabel(room.expires_at)}
                  isMemoryMode
                  onClick={() => router.push(`/rooms/${room.id}`)}
                />
              ))}
          </div>
        </div>
    </main>
  );
}
