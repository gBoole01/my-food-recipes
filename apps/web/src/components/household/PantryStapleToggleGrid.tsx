"use client";

import { useEffect, useState } from "react";
import type { GlobalPantryStaple } from "@my-food-recipes/contracts";
import { getGlobalPantryStaples } from "@/api/profile";
import { Chip } from "../ui/Chip";
import { Spinner } from "../ui/Spinner";

export function PantryStapleToggleGrid({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (name: string) => void;
}) {
  const [staples, setStaples] = useState<GlobalPantryStaple[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGlobalPantryStaples()
      .then(setStaples)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Spinner size={20} />;
  }

  if (staples.length === 0) {
    return (
      <p className="text-sm text-muted">
        Aucun fond de placard configuré par l'administrateur.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {staples.map((staple) => (
        <Chip
          key={staple.id}
          selected={selected.includes(staple.name)}
          onClick={() => onToggle(staple.name)}
        >
          {staple.name}
        </Chip>
      ))}
    </div>
  );
}
