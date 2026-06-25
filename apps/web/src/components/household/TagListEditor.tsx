"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { Tag } from "../ui/Tag";

export function TagListEditor({
  label,
  values,
  suggestions = [],
  onChange,
  placeholder = "Ajouter…",
  allowCustom = true,
}: {
  label: string;
  values: string[];
  suggestions?: { value: string; label: string }[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  allowCustom?: boolean;
}) {
  const [draft, setDraft] = useState("");

  const add = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onChange([...values, trimmed]);
    setDraft("");
  };

  const remove = (value: string) => onChange(values.filter((v) => v !== value));

  const remainingSuggestions = suggestions.filter((s) => !values.includes(s.value));

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-bold">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {values.length === 0 && <p className="text-sm text-muted">Aucun pour le moment.</p>}
        {values.map((value) => (
          <button key={value} type="button" onClick={() => remove(value)} aria-label={`Retirer ${value}`}>
            <Tag tone="primary">{value} ×</Tag>
          </button>
        ))}
      </div>
      {remainingSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {remainingSuggestions.map((s) => (
            <Chip key={s.value} onClick={() => add(s.value)}>
              {s.label}
            </Chip>
          ))}
        </div>
      )}
      {allowCustom && (
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add(draft);
              }
            }}
            placeholder={placeholder}
            className="min-h-11 flex-1 rounded-md border-2 border-border bg-surface px-3 text-sm"
          />
          <Button type="button" variant="secondary" onClick={() => add(draft)}>
            Ajouter
          </Button>
        </div>
      )}
    </div>
  );
}
