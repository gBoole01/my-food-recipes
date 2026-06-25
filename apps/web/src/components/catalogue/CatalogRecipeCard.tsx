"use client";

import { useState } from "react";
import type { RecipeFeedbackVote, RecipeInput } from "@my-food-recipes/contracts";
import { Button } from "../ui/Button";
import { Tag } from "../ui/Tag";

export function CatalogRecipeCard({
  recipe,
  memberId,
  onVote,
}: {
  recipe: RecipeInput;
  memberId: string | null;
  onVote: (recipeId: string, vote: RecipeFeedbackVote) => Promise<void>;
}) {
  const [vote, setVote] = useState<RecipeFeedbackVote | null>(null);
  const [voting, setVoting] = useState(false);

  const castVote = async (next: RecipeFeedbackVote) => {
    setVoting(true);
    try {
      await onVote(recipe.id, next);
      setVote(next);
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="rounded-lg border-2 border-border bg-surface">
      <div className="h-24 rounded-t-lg bg-[repeating-linear-gradient(135deg,var(--color-surface-alt),var(--color-surface-alt)_11px,var(--color-primary-soft)_11px,var(--color-primary-soft)_22px)]" />
      <div className="p-4">
        <h3 className="mb-2 font-head text-lg font-bold leading-tight">{recipe.name}</h3>
        <div className="mb-3 flex gap-4 text-sm font-bold">
          <span>{recipe.prepTimeMinutes} min</span>
          <span>{recipe.nutrition.calories} kcal</span>
          <span>{recipe.servings} pers.</span>
        </div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {recipe.dietTags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          {recipe.allergens.map((allergen) => (
            <Tag key={allergen} tone="secondary">
              {allergen}
            </Tag>
          ))}
        </div>
        <details className="mb-3">
          <summary className="cursor-pointer text-sm font-bold text-primary">
            Voir les ingrédients et les étapes
          </summary>
          <div className="mt-3 flex flex-col gap-3 text-sm">
            <div>
              <p className="mb-1 font-bold">Ingrédients</p>
              <ul className="list-inside list-disc text-muted">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.name}>
                    {ingredient.name} — {ingredient.quantity} {ingredient.unit}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 font-bold">Étapes</p>
              <ol className="list-inside list-decimal text-muted">
                {recipe.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </details>
        <div className="flex gap-2">
          <Button
            variant={vote === "like" ? "primary" : "secondary"}
            disabled={!memberId || voting}
            onClick={() => castVote("like")}
          >
            J&apos;aime
          </Button>
          <Button
            variant={vote === "dislike" ? "primary" : "secondary"}
            disabled={!memberId || voting}
            onClick={() => castVote("dislike")}
          >
            Je n&apos;aime pas
          </Button>
        </div>
      </div>
    </div>
  );
}
