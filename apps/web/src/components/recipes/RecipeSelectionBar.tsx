"use client";

import { useRouter } from "next/navigation";
import { useShoppingList } from "../../hooks/useShoppingList";
import { Button } from "../ui/Button";

export function RecipeSelectionBar({ selectedCount }: { selectedCount: number }) {
  const router = useRouter();
  const { generateList } = useShoppingList();

  const handleClick = () => {
    router.push("/shopping-list");
    void generateList();
  };

  return (
    <div className="no-print fixed inset-x-0 bottom-0 border-t border-border bg-surface p-4">
      <div className="mx-auto max-w-3xl">
        <Button onClick={handleClick} disabled={selectedCount === 0} className="w-full">
          {selectedCount > 0
            ? `Générer la liste de courses (${selectedCount})`
            : "Sélectionnez au moins une recette"}
        </Button>
      </div>
    </div>
  );
}
