"use client";

import { useState } from "react";

type ChatInputProps = {
  onSend?: (message: string) => void;
  isMemoryMode?: boolean;
};

export default function ChatInput({
  onSend,
  isMemoryMode = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const send = () => {
    if (isMemoryMode) return;

    const trimmed = message.trim();
    if (!trimmed) return;

    onSend?.(trimmed);
    setMessage("");
  };

  return (
    <div
      className="flex w-full items-center gap-2 rounded-full px-3 py-2 shadow-[var(--shadow-card)]"
      style={{
        backgroundColor: isMemoryMode
          ? "var(--color-memory)"
          : "var(--color-accent-1)",
      }}
    >
      {/* plus */}
      <button
        disabled
        className="flex h-7 w-7 items-center justify-center text-lg text-[var(--color-text)]"
      >
        +
      </button>

      {/* input */}
      <div className="flex-1 rounded-full bg-[var(--color-surface)] px-3 py-2">
        <input
          value={message}
          disabled={isMemoryMode}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={isMemoryMode ? "Memory mode" : "Type message"}
          className="w-full bg-transparent text-[var(--color-text)] outline-none"
        />
      </div>

      {/* send */}
      <button
        onClick={send}
        disabled={!message.trim() || isMemoryMode}
        className="flex h-7 w-7 items-center justify-center text-lg text-[var(--color-text)] transition hover:-translate-y-[1px] disabled:opacity-40"
      >
        ➤
      </button>
    </div>
  );
}