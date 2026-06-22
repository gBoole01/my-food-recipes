import type { ChatMessage } from "../../types/domain";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isAgent = message.role === "agent";
  const isClarification = message.kind === "clarification";

  return (
    <div className={`flex ${isAgent ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
          isAgent
            ? isClarification
              ? "rounded-tl-sm bg-accent/15 text-ink"
              : "rounded-tl-sm bg-surface-alt text-ink"
            : "rounded-tr-sm bg-primary text-white"
        }`}
      >
        {isClarification && <span className="mr-1 font-bold">?</span>}
        {message.content}
      </div>
    </div>
  );
}
