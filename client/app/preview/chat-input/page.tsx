"use client";

import ChatInput from "@/components/ChatInput";

export default function PreviewChatInputPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-[var(--page-padding)] py-8">
      <div className="mx-auto flex max-w-[720px] flex-col gap-6">
        <ChatInput onSend={(message) => console.log(message)} />
      </div>
    </main>
  );
}