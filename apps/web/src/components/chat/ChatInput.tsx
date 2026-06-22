"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "../ui/Button";

export function ChatInput({ onSend, disabled }: { onSend: (text: string) => void; disabled: boolean }) {
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={disabled}
        placeholder="Écrivez votre réponse…"
        aria-label="Votre message"
        className="min-h-11 flex-1 rounded-md border-2 border-border bg-surface px-4 py-2 text-base outline-none focus:border-primary disabled:bg-surface-alt"
      />
      <Button type="submit" disabled={disabled || value.trim() === ""}>
        Envoyer
      </Button>
    </form>
  );
}
