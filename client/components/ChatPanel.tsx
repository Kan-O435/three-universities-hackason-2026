"use client";

import { useEffect, useRef, useState } from "react";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import { getMessages, sendMessage, subscribeMessages } from "@/lib/messages";
import type { Message } from "@/types";

type ChatPanelProps = {
  title: string;
  roomId: string;
  currentUserId: string;
  isMemoryMode: boolean;
};

export default function ChatPanel({ title, roomId, currentUserId, isMemoryMode }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sendError, setSendError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMessages(roomId).then(setMessages).catch(console.error);
    const unsubscribe = subscribeMessages(roomId, setMessages);
    return unsubscribe;
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (content: string) => {
    setSendError(null);
    sendMessage(roomId, content).catch(() => {
      setSendError("Failed to send message. Please try again.");
    });
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
      <div className="shrink-0 border-b border-[#E5E7EB] pb-3">
        <p className="text-sm font-bold text-[#4A5568]">{title}</p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto py-3">
        {messages.length === 0 ? (
          <p className="m-auto text-sm text-[#94A3B8]">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              roomId={roomId}
              userId={msg.user_id}
              name={msg.users?.display_name ?? ""}
              message={msg.content}
              side={msg.user_id === currentUserId ? "right" : "left"}
              isMemoryMode={isMemoryMode}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 pt-3">
        {sendError && (
          <p className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {sendError}
          </p>
        )}
        <ChatInput onSend={handleSend} isMemoryMode={isMemoryMode} />
      </div>
    </section>
  );
}
