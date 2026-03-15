export function formatTimeLabel(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now()

  if (diff <= 0) return "00:00"

  const totalSeconds = Math.floor(diff / 1000)
  const totalMinutes = Math.floor(totalSeconds / 60)
  const totalHours = Math.floor(totalMinutes / 60)
  const totalDays = Math.floor(totalHours / 24)

  if (totalDays >= 1) return `${totalDays}日`
  if (totalHours >= 1) return `${totalHours}時間`

  const mm = String(totalMinutes).padStart(2, "0")
  const ss = String(totalSeconds % 60).padStart(2, "0")
  return `${mm}:${ss}`
}

export function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() <= Date.now()
}
