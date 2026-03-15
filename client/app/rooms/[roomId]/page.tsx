"use client";

import Header from "@/components/Header";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function RoomPage() {
  const params = useParams<{ roomId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const roomId = params.roomId;
  const inviteCode = searchParams.get("inviteCode") ?? "DEMO2026";

  const navigateToQrPage = () => {
    const query = new URLSearchParams({ inviteCode });
    router.push(`/rooms/${roomId}/qrcode?${query.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header />

      <main className="mx-auto w-full max-w-(--max-width-content) px-(--page-padding) py-8">
        <section className="rounded-[var(--radius-card)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]">
          <h2 className="text-2xl font-bold text-[var(--color-text)]">Group {roomId}</h2>
          <p className="mt-2 text-sm text-[var(--color-text)]/80">
            QRコードボタンを押すと、参加URLを埋め込んだQRコードを表示します。
          </p>

          <button
            type="button"
            onClick={navigateToQrPage}
            className="mt-6 rounded-full bg-[var(--color-accent-1)] px-6 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:brightness-95"
          >
            QRコードはこちら
          </button>

          <p className="mt-3 text-xs text-[var(--color-text)]/70">
            現在の inviteCode: {inviteCode}
          </p>
        </section>
      </main>
    </div>
  );
}