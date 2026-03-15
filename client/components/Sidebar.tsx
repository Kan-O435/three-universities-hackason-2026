"use client";

import { useState } from "react";
import Link from "next/link";
import TimeLimitCard from "@/components/TimeLimitCard";
import QrInviteCard from "@/components/QrInviteCard";

type SidebarProps = {
  roomId: string;
  activeChat: string;
  expiresAt?: string;
  members?: { userId: string; displayName: string }[];
};

export default function Sidebar({ roomId, activeChat, expiresAt, members = [] }: SidebarProps) {
  const [talksOpen, setTalksOpen] = useState(false);

  const chats = [
    { id: "all", name: "All", href: "" },
    ...members.map((m) => ({
      id: m.userId,
      name: m.displayName,
      href: `dm/${m.userId}`,
    })),
  ];

  return (
    <aside className="flex w-full flex-col gap-3 md:w-[220px] md:shrink-0 md:gap-4">
      <section>
        {/* モバイル: トグルボタン / md以上: 通常ヘッダー */}
        <button
          type="button"
          onClick={() => setTalksOpen((o) => !o)}
          className="mb-2 flex w-full items-center justify-between text-[16px] font-bold text-[#334155] md:hidden"
        >
          <span>Talks</span>
          <span className="text-sm text-[#94A3B8]">{talksOpen ? "▲" : "▼"}</span>
        </button>
        <h2 className="mb-2 hidden text-[16px] font-bold text-[#334155] md:block">Talks</h2>

        <div className={`rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm ${talksOpen ? "block" : "hidden"} md:block`}>
          <ul className="space-y-0.5">
            {chats.map((chat) => {
              const isActive = activeChat === chat.id;
              const href =
                chat.id === "all"
                  ? `/rooms/${roomId}`
                  : `/rooms/${roomId}/${chat.href}`;

              return (
                <li key={chat.id}>
                  <Link
                    href={href}
                    className={`flex w-full items-center rounded-xl px-2 py-1 text-left text-[16px] font-medium transition ${
                      isActive
                        ? "text-[#7FA9C9]"
                        : "text-[#4A5568] hover:bg-[#F6F7F9]"
                    }`}
                  >
                    <span className="mr-2 inline-block w-4">
                      {isActive ? ">" : ""}
                    </span>
                    <span>{chat.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* モバイル: 横並び / md以上: 縦並び */}
      <div className="flex gap-2 md:flex-col md:gap-4">
        {expiresAt && <TimeLimitCard expiresAt={expiresAt} />}
        <QrInviteCard roomId={roomId} />
      </div>
    </aside>
  );
}
