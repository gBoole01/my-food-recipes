"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RecipeGrid } from "@/components/recipes/RecipeGrid";
import { RecipeSelectionBar } from "@/components/recipes/RecipeSelectionBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Spinner } from "@/components/ui/Spinner";
import { useRecipes } from "@/hooks/useRecipes";

export default function RecipesPage() {
  const { recipes, recipesRequest, selectedRecipeIds, toggleSelection, fetchRecipes, profile } = useRecipes();
  const router = useRouter();

  useEffect(() => {
    if (recipesRequest.state === "idle") void fetchRecipes();
  }, [recipesRequest.state, fetchRecipes]);

  if (recipesRequest.state === "loading") {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <Spinner size={32} />
        <p className="text-muted">Composition de vos recettes…</p>
      </div>
    );
  }

  if (recipesRequest.state === "error") {
    return <ErrorBanner message={recipesRequest.message} onRetry={fetchRecipes} />;
  }

  if (recipes.length === 0) {
    return (
      <EmptyState
        title="Aucune recette trouvée"
        description="Votre profil est peut-être trop restrictif. Essayez d'assouplir vos préférences."
        action={
          <button
            type="button"
            onClick={() => router.push("/chat")}
            className="min-h-11 font-bold text-primary underline"
          >
            Retour au chat
          </button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-24">
      <div>
        <h1 className="font-head text-2xl font-bold">Vos recettes</h1>
        <p className="text-sm text-muted">
          {recipes.length} plats · {profile.guestCount ?? "—"} convives · équilibrés
        </p>
      </div>
      <RecipeGrid recipes={recipes} selectedRecipeIds={selectedRecipeIds} onToggle={toggleSelection} />
      <RecipeSelectionBar selectedCount={selectedRecipeIds.size} />
    </div>
  );
}
