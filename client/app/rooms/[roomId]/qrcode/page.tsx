"use client";

import Header from "@/components/Header";
import QRcode from "@/components/QRcode";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function RoomQrCodePage() {
  const params = useParams<{ roomId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const roomId = params.roomId;
  const inviteCode = searchParams.get("inviteCode");

  if (!inviteCode) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <Header />
        <main className="mx-auto w-full max-w-(--max-width-content) px-(--page-padding) py-8">
          <section className="rounded-[var(--radius-card)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-xl font-bold text-[var(--color-text)]">QRコードを発行できません</h2>
            <p className="mt-3 text-sm text-[var(--color-text)]/80">
              inviteCode が指定されていないため、QRコードを生成できませんでした。
            </p>
            <button
              type="button"
              onClick={() => router.push(`/rooms/${roomId}`)}
              className="mt-5 rounded-full bg-[var(--color-accent-1)] px-5 py-2 font-semibold text-[var(--color-text)] transition hover:brightness-95"
            >
              ルームへ戻る
            </button>
          </section>
        </main>
      </div>
    );
  }

  const targetPath = `/rooms/join/${encodeURIComponent(inviteCode)}`;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header />

      <main className="mx-auto w-full max-w-(--max-width-content) px-(--page-padding) py-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-[var(--color-text)]">Group {roomId} / QRコード</h2>
          <button
            type="button"
            onClick={() => router.push(`/rooms/${roomId}`)}
            className="rounded-full bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] shadow-[var(--shadow-card)] transition hover:brightness-95"
          >
            戻る
          </button>
        </div>

        <QRcode title="参加用QRコード" targetPath={targetPath} />
      </main>
    </div>
  );
}
