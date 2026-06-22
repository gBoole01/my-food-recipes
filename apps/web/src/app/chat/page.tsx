"use client";

import { useEffect } from "react";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ProgressTracker } from "@/components/chat/ProgressTracker";
import { QuickReplyChips } from "@/components/chat/QuickReplyChips";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useChat } from "@/hooks/useChat";

export default function ChatPage() {
  const { messages, progress, chatRequest, sendMessage, retry, startConversation } = useChat();

  useEffect(() => {
    if (messages.length === 0) startConversation();
  }, [messages.length, startConversation]);

  const lastAgentMessage = [...messages].reverse().find((message) => message.role === "agent");
  const isLoading = chatRequest.state === "loading";

  return (
    <div className="flex flex-col gap-4">
      <ProgressTracker progress={progress} />
      <ChatWindow messages={messages} isTyping={isLoading} />
      {chatRequest.state === "error" && <ErrorBanner message={chatRequest.message} onRetry={retry} />}
      {!isLoading && lastAgentMessage?.quickReplies && (
        <QuickReplyChips
          quickReplies={lastAgentMessage.quickReplies}
          allowMultiple={!!lastAgentMessage.allowMultiple}
          onSubmit={sendMessage}
        />
      )}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
