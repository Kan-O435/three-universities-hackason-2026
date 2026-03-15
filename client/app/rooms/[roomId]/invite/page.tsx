import Header from "@/components/Header";
import QRCode from "react-qr-code";

type InviteQrPageProps = {
  params: Promise<{
    roomId: string;
  }>;
};

export default async function InviteQrPage({ params }: InviteQrPageProps) {
  const { roomId } = await params;

  // 仮データ（後でAPI）
  const room = {
    name: "HazyRoom Talk",
    owner: "AAAAA",
    description: "短期間だけつながるSNSのテストルームです。",
  };

  const inviteCode = "abc123";
  const inviteUrl = `http://localhost:3000/rooms/${roomId}/join/${inviteCode}`;

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F7F9] text-[#4A5568]">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm text-center">

          <p className="mb-2 text-sm font-bold text-[#7FA9C9]">
            Invite QR
          </p>

          <h1 className="mb-1 text-2xl font-bold text-[#334155]">
            {room.name}
          </h1>

          <p className="mb-2 text-sm text-[#64748B]">
            created by {room.owner}
          </p>

          <p className="mb-6 text-sm text-[#64748B]">
            {room.description}
          </p>

          <div className="mx-auto w-fit rounded-2xl bg-white p-4 shadow-sm">
            <QRCode value={inviteUrl} size={220} />
          </div>

        </div>
      </main>
    </div>
  );
}