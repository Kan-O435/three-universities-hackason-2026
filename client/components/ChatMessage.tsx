type ChatMessageProps = {
  name: string;
  message: string;
  side?: "left" | "right";
  avatarText?: string;
  avatarColor?: string;
  isMemoryMode?: boolean;
};

export default function ChatMessage({
  name,
  message,
  side = "left",
  avatarText = "A",
  avatarColor = "var(--color-avatar-1)",
  isMemoryMode = false,
}: ChatMessageProps) {
  const isRight = side === "right";

  return (
    <div className={`flex w-full ${isRight ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[85%] items-start gap-3 ${
          isRight ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-[var(--color-surface)]"
          style={{
            backgroundColor: isMemoryMode ? "var(--color-memory)" : avatarColor,
            color: isMemoryMode
              ? "var(--color-text)"
              : "var(--color-surface)",
          }}
        >
          {isMemoryMode ? "◯" : avatarText}
        </div>

        {/* Message area */}
        <div
          className={`flex flex-col ${
            isRight ? "items-end" : "items-start"
          }`}
        >
          <span className="mb-1 text-sm font-semibold text-[var(--color-text)]">
            {isMemoryMode ? "Memory" : name}
          </span>

          <div
            className={`
              rounded-[20px] px-4 py-3 text-sm leading-relaxed
              shadow-[var(--shadow-card)]
              ${
                isMemoryMode
                  ? "bg-[var(--color-memory)] text-[var(--color-text)]"
                  : isRight
                  ? "bg-[var(--color-accent-2)] text-[var(--color-surface)]"
                  : "bg-[var(--color-surface)] text-[var(--color-text)]"
              }
            `}
          >
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}