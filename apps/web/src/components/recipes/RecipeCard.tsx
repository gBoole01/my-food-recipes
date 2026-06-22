import type { Recipe } from "../../types/domain";
import { Tag } from "../ui/Tag";

export function RecipeCard({
  recipe,
  selected,
  onToggle,
}: {
  recipe: Recipe;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`rounded-lg border-2 bg-surface transition ${selected ? "border-primary" : "border-border"}`}>
      <div className="h-24 rounded-t-lg bg-[repeating-linear-gradient(135deg,var(--color-surface-alt),var(--color-surface-alt)_11px,var(--color-primary-soft)_11px,var(--color-primary-soft)_22px)]" />
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-head text-lg font-bold leading-tight">{recipe.name}</h3>
          <label className="flex min-h-11 min-w-11 flex-none items-center justify-center">
            <span className="sr-only">Sélectionner {recipe.name}</span>
            <input
              type="checkbox"
              checked={selected}
              onChange={onToggle}
              className="h-5 w-5 accent-primary"
            />
          </label>
        </div>
        <div className="mb-3 flex gap-4 text-sm font-bold">
          <span>{recipe.prepTimeMinutes} min</span>
          <span>{recipe.nutrition.calories} kcal</span>
          <span>{recipe.nutrition.protein} g protéines</span>
        </div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {recipe.dietTags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <details>
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
      </div>
    </div>
  );
}
