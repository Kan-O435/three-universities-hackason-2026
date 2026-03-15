"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import QRCode from "react-qr-code";
import { getRoomDetail } from "@/lib/rooms";
import { getProfile } from "@/lib/auth";
import type { Room } from "@/types";

export default function InviteQrPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;
  const { user, loading } = useAuth();

  const [room, setRoom] = useState<Room | null>(null);
  const [ownerName, setOwnerName] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    getRoomDetail(roomId)
      .then((r) => {
        setRoom(r);
        return getProfile(r.owner_id);
      })
      .then((profile) => setOwnerName(profile.display_name))
      .catch(() => router.replace("/home"));
  }, [roomId, user, router]);

  if (loading || !user || !room || !origin) return null;

  const inviteUrl = `${origin}/rooms/${roomId}/join/${room.invite_code}`;

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F7F9] text-[#4A5568]">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm text-center">

          <p className="mb-2 text-sm font-bold text-[#7FA9C9]">Invite QR</p>

          <h1 className="mb-1 text-2xl font-bold text-[#334155]">{room.name}</h1>

          <p className="mb-2 text-sm text-[#64748B]">created by {ownerName}</p>

          <p className="mb-6 text-sm text-[#64748B]">{room.description}</p>

          <div className="mx-auto w-fit rounded-2xl bg-white p-4 shadow-sm">
            <QRCode value={inviteUrl} size={220} />
          </div>

          {process.env.NODE_ENV !== "production" && (
            <p className="mt-4 break-all rounded-lg bg-[#F6F7F9] px-3 py-2 text-left text-xs text-[#64748B]">
              {inviteUrl}
            </p>
          )}

          <button
            type="button"
            onClick={() => router.push(`/rooms/${roomId}`)}
            className="mt-6 w-full rounded-xl bg-[#7FA9C9] py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#6F9ABB]"
          >
            チャットに戻る
          </button>
        </div>
      </main>
    </div>
  );
}
