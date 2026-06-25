"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteRecipe } from "@/app/admin/recipes/actions";

export function DeleteRecipeButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    if (!confirm("Supprimer cette recette définitivement ?")) return;
    startTransition(async () => {
      await deleteRecipe(id);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-sm font-semibold text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? "…" : "Supprimer"}
    </button>
  );
}
