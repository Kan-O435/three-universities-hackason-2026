import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ChatPanel from "@/components/ChatPanel";

type RoomPageProps = {
  params: {
    roomId: string;
  };
};

export default async function RoomPage({ params }: RoomPageProps) {
  const { roomId } = await params;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F6F7F9] text-[#4A5568]">
      <Header />

      <main className="mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col gap-4 px-3 py-3 md:flex-row md:gap-5 md:px-5 md:py-4">
        <Sidebar roomId={roomId} />

        <ChatPanel />
      </main>
    </div>
  );
}