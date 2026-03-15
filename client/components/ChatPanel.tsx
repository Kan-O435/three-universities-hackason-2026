import ChatInput from "@/components/ChatInput";

export default function ChatPanel() {
  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">

      <div className="shrink-0 border-b border-[#E5E7EB] pb-3">
        <p className="text-sm font-bold text-[#4A5568]">chat</p>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center text-sm text-[#94A3B8]">
        messages
      </div>

      <div className="shrink-0 pt-3">
        <ChatInput />
      </div>

    </section>
  );
}