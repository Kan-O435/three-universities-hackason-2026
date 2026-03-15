const avatarColors = [
  "var(--color-avatar-1)",
  "var(--color-avatar-2)",
  "var(--color-avatar-3)",
  "var(--color-avatar-4)",
  "var(--color-avatar-5)",
  "var(--color-avatar-6)",
  "var(--color-avatar-7)",
  "var(--color-avatar-8)",
];

export function getAvatarColor(roomId: string, name: string): string {
  const key = `${roomId}-${name}`;
  let hash = 0;

  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % avatarColors.length;
  }

  return avatarColors[Math.abs(hash) % avatarColors.length];
}