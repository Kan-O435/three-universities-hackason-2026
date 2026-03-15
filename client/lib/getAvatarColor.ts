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

export function getAvatarColor(roomId: string, userId: string): string {
  const key = `${roomId}-${userId}`;
  let hash = 0;

  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }

  let index = hash % avatarColors.length;
  if (index < 0) {
    index += avatarColors.length;
  }

  return avatarColors[index];
}