"use client";

import { useRef, useState, useTransition } from "react";
import type { IngredientAliasSuggestion } from "@my-food-recipes/contracts";
import { searchIngredientAliases } from "@/app/admin/recipes/actions";

interface Props {
  value: string;
  aliasId: string | null;
  onSelect: (name: string, aliasId: string | null, category: string | null) => void;
  inputClassName?: string;
  required?: boolean;
}

export function IngredientCombobox({ value, aliasId, onSelect, inputClassName, required }: Props) {
  const [suggestions, setSuggestions] = useState<IngredientAliasSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    onSelect(val, null, null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const results = await searchIngredientAliases(val);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      });
    }, 300);
  }

  function handleSelect(suggestion: IngredientAliasSuggestion) {
    onSelect(suggestion.alias, suggestion.id, suggestion.categoryName);
    setIsOpen(false);
    setSuggestions([]);
  }

  function handleBlur(e: React.FocusEvent) {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative" onBlur={handleBlur}>
      <div className="relative">
        <input
          className={inputClassName}
          value={value}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder="Rechercher un ingrédient…"
          required={required}
          autoComplete="off"
        />
        <span
          className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full ${
            aliasId ? "bg-green-500" : "bg-orange-400"
          }`}
          title={aliasId ? "Lié à CIQUAL" : "Non lié"}
        />
      </div>

      {aliasId && (
        <p className="mt-0.5 truncate text-xs text-green-600">
          CIQUAL lié
          <button
            type="button"
            onClick={() => onSelect(value, null, null)}
            className="ml-1.5 text-muted hover:text-ink"
            aria-label="Délier"
          >
            ×
          </button>
        </p>
      )}

      {isPending && (
        <p className="mt-0.5 text-xs text-muted">Recherche…</p>
      )}

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md border border-border bg-surface shadow-lg">
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(s)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-primary-soft"
              >
                <span className="font-medium">{s.alias}</span>
                {s.foodNutritionName && (
                  <span className="ml-2 text-xs text-muted">{s.foodNutritionName}</span>
                )}
                {s.categoryName && (
                  <span className="ml-1 text-xs text-muted">· {s.categoryName}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
