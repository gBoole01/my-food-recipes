import type { Recipe } from "../../types/domain";
import { RecipeCard } from "./RecipeCard";

export function RecipeGrid({
  recipes,
  selectedRecipeIds,
  onToggle,
}: {
  recipes: Recipe[];
  selectedRecipeIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          selected={selectedRecipeIds.has(recipe.id)}
          onToggle={() => onToggle(recipe.id)}
        />
      ))}
    </div>
  );
}
