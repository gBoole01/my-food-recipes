"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "../../types/domain";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

export function ChatWindow({ messages, isTyping }: { messages: ChatMessage[]; isTyping: boolean }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  return (
    <div className="flex max-h-[60vh] min-h-[40vh] flex-col gap-2 overflow-y-auto rounded-lg border border-border bg-surface p-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={endRef} />
    </div>
  );
}
