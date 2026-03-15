import Avatar from "./Avatar";
import { getAvatarColor } from "../lib/getAvatarColor";

type ChatMessageProps = {
  roomId: string;
  name: string;
  message: string;
  side?: "left" | "right";
  isMemoryMode?: boolean;
};

export default function ChatMessage({
  roomId,
  name,
  message,
  side = "left",
  isMemoryMode = false,
}: ChatMessageProps) {
  const isRight = side === "right";
  const avatarColor = getAvatarColor(roomId, name);

  return (
    <div className={`flex w-full ${isRight ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[85%] items-start gap-3 ${
          isRight ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        {!isRight && (
          <Avatar
            name={name}
            color={avatarColor}
            isMemoryMode={isMemoryMode}
            size="md"
          />
        )}
        

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