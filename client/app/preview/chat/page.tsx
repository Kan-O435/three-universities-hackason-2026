import ChatMessage from "@/components/ChatMessage";

export default function PreviewChatPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-[var(--page-padding)] py-8">
      <div className="mx-auto flex max-w-[720px] flex-col gap-4">
        <ChatMessage
          name="Jukiya"
          message="こんにちは！このグループどうしますか？"
          side="left"
          avatarText="J"
          avatarColor="var(--color-avatar-1)"
        />

        <ChatMessage
          name="Yuki"
          message="まず役割分担を決めたいです。"
          side="right"
          avatarText="Y"
          avatarColor="var(--color-avatar-3)"
        />

        <ChatMessage
          name="A"
          message="これは思い出モードの表示です。"
          side="left"
          avatarText="A"
          avatarColor="var(--color-avatar-2)"
          isMemoryMode
        />
      </div>
    </main>
  );
}