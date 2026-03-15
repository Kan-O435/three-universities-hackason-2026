import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ChatPanel from "@/components/ChatPanel";

type DmPageProps = {
  params: Promise<{
    roomId: string;
    userId: string;
  }>;
};

const userNames: Record<string, string> = {
  u1: "AAAAA",
  u2: "BBBBB",
  u3: "CCCCC",
};

export default async function DmPage({ params }: DmPageProps) {
  const { roomId, userId } = await params;
  const chatName = userNames[userId] ?? "Unknown";

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F6F7F9] text-[#4A5568]">
      <Header />

      <main className="mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col gap-4 px-3 py-3 md:flex-row md:gap-5 md:px-5 md:py-4">
        <Sidebar roomId={roomId} activeChat={userId} />
        <ChatPanel title={`Chat: ${chatName}`} />
      </main>
    </div>
  );
}