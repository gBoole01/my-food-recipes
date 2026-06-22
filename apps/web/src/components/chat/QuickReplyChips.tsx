"use client";

import { useState } from "react";
import type { QuickReply } from "../../types/domain";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";

const NONE_VALUE = "Aucune";

export function QuickReplyChips({
  quickReplies,
  allowMultiple,
  onSubmit,
}: {
  quickReplies: QuickReply[];
  allowMultiple: boolean;
  onSubmit: (value: string) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (reply: QuickReply) => {
    if (!allowMultiple) {
      onSubmit(reply.value);
      return;
    }
    setSelected((prev) => {
      if (reply.value === NONE_VALUE) return prev.includes(NONE_VALUE) ? [] : [NONE_VALUE];
      const withoutNone = prev.filter((value) => value !== NONE_VALUE);
      return withoutNone.includes(reply.value)
        ? withoutNone.filter((value) => value !== reply.value)
        : [...withoutNone, reply.value];
    });
  };

  const confirm = () => {
    onSubmit(selected.length > 0 ? selected.join(", ") : NONE_VALUE);
    setSelected([]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {quickReplies.map((reply) => (
          <Chip key={reply.id} selected={selected.includes(reply.value)} onClick={() => toggle(reply)}>
            {reply.label}
          </Chip>
        ))}
      </div>
      {allowMultiple && (
        <Button onClick={confirm} disabled={selected.length === 0} className="w-full">
          Valider →
        </Button>
      )}
    </div>
  );
}
