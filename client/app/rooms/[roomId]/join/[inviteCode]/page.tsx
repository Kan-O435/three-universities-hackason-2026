import Header from "@/components/Header";

type JoinPageProps = {
  params: Promise<{
    roomId: string;
    inviteCode: string;
  }>;
};

export default async function JoinPage({ params }: JoinPageProps) {
  const { roomId, inviteCode } = await params;

  const room = {
    name: "HazyRoom Talk",
    owner: "AAAAA",
    description: "短期間だけつながるSNSのテストルームです。",
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F7F9] text-[#4A5568]">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

          <p className="mb-2 text-sm font-bold text-[#7FA9C9]">
            Invitation
          </p>

          <h1 className="mb-1 text-xl font-bold text-[#334155]">
            {room.name}
          </h1>

          <p className="mb-3 text-sm text-[#64748B]">
            created by {room.owner}
          </p>

          <p className="mb-6 text-sm text-[#64748B]">
            {room.description}
          </p>

          <button
            type="button"
            className="w-full rounded-xl bg-[#7FA9C9] py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#6F9ABB]"
          >
            Join Room
          </button>

        </div>
      </main>
    </div>
  );
}