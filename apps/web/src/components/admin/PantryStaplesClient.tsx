"use client";

import { useState, useTransition } from "react";
import type { GlobalPantryStaple } from "@my-food-recipes/contracts";
import {
  addPantryStaple,
  removePantryStaple,
} from "@/app/admin/pantry-staples/actions";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

interface Props {
  initialStaples: GlobalPantryStaple[];
}

export function PantryStaplesClient({ initialStaples }: Props) {
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = initialStaples.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    setError(null);
    startTransition(async () => {
      const result = await addPantryStaple(trimmed);
      if (result.error) {
        setError(result.error);
      } else {
        setNewName("");
      }
    });
  }

  function handleRemove(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await removePantryStaple(id);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4"
      >
        <input
          className="min-h-11 flex-1 rounded-md border-2 border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
          placeholder="Ajouter un ingrédient (ex: Eau, Poivre blanc…)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending || !newName.trim()}>
          {isPending ? <Spinner size={18} /> : "+ Ajouter"}
        </Button>
      </form>

      {/* Search */}
      <input
        className="min-h-11 w-full rounded-md border-2 border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
        placeholder="Rechercher dans la liste…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Staples list */}
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">
          {search
            ? `Aucun résultat pour "${search}".`
            : "Aucun fond de placard universel configuré."}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {filtered.map((staple) => (
            <span
              key={staple.id}
              className="flex items-center gap-1.5 rounded-pill bg-primary-soft px-3 py-1.5 text-sm font-semibold text-primary"
            >
              {staple.name}
              <button
                type="button"
                onClick={() => handleRemove(staple.id)}
                disabled={isPending}
                aria-label={`Retirer ${staple.name}`}
                className="ml-1 rounded-full text-primary opacity-60 hover:opacity-100 disabled:cursor-not-allowed"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {search && filtered.length > 0 && (
        <p className="text-xs text-muted">
          {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} sur{" "}
          {initialStaples.length}
        </p>
      )}
    </div>
  );
}
