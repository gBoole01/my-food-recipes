"use client";

import { useState } from "react";
import type { RecipeFeedbackVote } from "@my-food-recipes/contracts";
import { recordFeedback } from "@/api/profile";
import { CatalogRecipeCard } from "@/components/catalogue/CatalogRecipeCard";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Spinner } from "@/components/ui/Spinner";
import { useHousehold } from "@/hooks/useHousehold";
import { useRecipeCatalog } from "@/hooks/useRecipeCatalog";

export default function CatalogueRecipesPage() {
  const { recipes, request, fetchCatalog } = useRecipeCatalog();
  const { household } = useHousehold();
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const memberId = selectedMemberId ?? household?.members[0]?.id ?? null;

  const castVote = async (recipeId: string, vote: RecipeFeedbackVote) => {
    if (!memberId) return;
    await recordFeedback(memberId, { recipeId, vote });
  };

  if (request.state === "loading" && recipes.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <Spinner size={32} />
        <p className="text-muted">Chargement du catalogue de recettes…</p>
      </div>
    );
  }

  if (request.state === "error") {
    return <ErrorBanner message={request.message} onRetry={fetchCatalog} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-head text-2xl font-bold">Catalogue de recettes</h1>
        <p className="text-sm text-muted">{recipes.length} recettes seedées dans le corpus.</p>
      </div>

      {household && household.members.length > 0 && (
        <label className="flex items-center gap-2 text-sm font-bold">
          Voter en tant que
          <select
            value={memberId ?? ""}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="min-h-11 rounded-md border-2 border-border bg-surface px-3 font-normal"
          >
            {household.members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <CatalogRecipeCard key={recipe.id} recipe={recipe} memberId={memberId} onVote={castVote} />
        ))}
      </div>
    </div>
  );
}
