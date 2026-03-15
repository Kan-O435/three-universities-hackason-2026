"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getRoomPreview, joinRoom } from "@/lib/rooms";
import type { RoomPreview } from "@/types";

export default function JoinPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;
  const inviteCode = params.inviteCode as string;
  const { user, loading } = useAuth();

  const [room, setRoom] = useState<RoomPreview | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    getRoomPreview(roomId)
      .then(setRoom)
      .catch(() => setFetchError("Room not found. Please check that the invite link is correct."));
  }, [roomId]);

  const handleJoin = () => {
    setJoinError(null);
    setIsJoining(true);
    joinRoom(roomId, inviteCode)
      .then(() => router.replace(`/rooms/${roomId}`))
      .catch((err: Error) => {
        const msg = err.message.toLowerCase();
        if (msg.includes("invite") || msg.includes("expired")) {
          setJoinError("Invalid invite code or the link has expired.");
        } else {
          setJoinError("Failed to join. Please try again.");
        }
      })
      .finally(() => setIsJoining(false));
  };

  const handleLoginToJoin = () => {
    const redirect = `/rooms/${roomId}/join/${inviteCode}`;
    router.push(`/signin?redirect=${encodeURIComponent(redirect)}`);
  };

  return (
    <main className="flex min-h-full flex-col items-center justify-center bg-[#F6F7F9] px-4 py-8 text-[#4A5568]">
        <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

          {fetchError ? (
            <p className="text-center text-sm text-red-500">{fetchError}</p>
          ) : !room ? (
            <p className="text-center text-sm text-[#94A3B8]">Loading...</p>
          ) : (
            <>
              <p className="mb-2 text-sm font-bold text-[#7FA9C9]">Invitation</p>

              <h1 className="mb-1 text-xl font-bold text-[#334155]">{room.name}</h1>

              <p className="mb-3 text-sm text-[#64748B]">created by {room.owner_name}</p>

              {room.description && (
                <p className="mb-6 text-sm text-[#64748B]">{room.description}</p>
              )}

              {joinError && (
                <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {joinError}
                </p>
              )}

              {!loading && !user ? (
                <button
                  type="button"
                  onClick={handleLoginToJoin}
                  className="w-full rounded-xl bg-[#7FA9C9] py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#6F9ABB]"
                >
                  Log In to Join
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleJoin}
                  disabled={isJoining || loading}
                  className="w-full rounded-xl bg-[#7FA9C9] py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#6F9ABB] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isJoining ? "Joining..." : "Join Room"}
                </button>
              )}
            </>
          )}

        </div>
    </main>
  );
}
