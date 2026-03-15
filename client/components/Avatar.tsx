type AvatarProps = {
  name: string;
  color: string;
  isMemoryMode?: boolean;
  size?: "sm" | "md" | "lg";
};

export default function Avatar({
  name,
  color,
  isMemoryMode = false,
  size = "md",
}: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase();

  const sizeClass =
    size === "sm"
      ? "h-8 w-8 text-xs"
      : size === "lg"
      ? "h-12 w-12 text-base"
      : "h-10 w-10 text-sm";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${sizeClass}`}
      style={{
        backgroundColor: isMemoryMode ? "var(--color-memory)" : color,
        color: isMemoryMode ? "var(--color-text)" : "var(--color-surface)",
      }}
    >
      {isMemoryMode ? "◯" : initial}
    </div>
  );
}