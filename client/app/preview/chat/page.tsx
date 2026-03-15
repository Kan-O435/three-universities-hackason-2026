import ChatMessage from "@/components/ChatMessage";

export default function PreviewChatPage() {
  const roomId = "room-a";

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-[var(--page-padding)] py-8">
      <div className="mx-auto flex max-w-[720px] flex-col gap-4">
        <ChatMessage
          roomId={roomId}
          name="Jukiya"
          message="こんにちは！このグループどうしますか？"
          side="left"
        />

        <ChatMessage
          roomId={roomId}
          name="Yuki"
          message="まず役割分担を決めたいです。"
          side="right"
        />

        <ChatMessage
          roomId={roomId}
          name="Taro"
          message="長めの文章を入れたときの見た目も確認しておきたいです。改行や幅の感じが変じゃないか見ます。"
          side="left"
        />

        <ChatMessage
          roomId={roomId}
          name="A"
          message="これは思い出モードの表示です。"
          side="left"
          isMemoryMode
        />
      </div>
    </main>
  );
}