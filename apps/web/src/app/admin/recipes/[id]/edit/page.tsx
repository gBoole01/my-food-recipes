import { notFound } from "next/navigation";
import type { AdminRecipeResponse } from "@my-food-recipes/contracts";
import { RecipeForm } from "@/components/admin/RecipeForm";

async function fetchRecipe(id: string): Promise<AdminRecipeResponse | null> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const key = process.env.ADMIN_API_KEY ?? "";
  const res = await fetch(`${base}/api/admin/recipes/${id}`, {
    headers: { "X-Admin-Key": key },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
  return res.json() as Promise<AdminRecipeResponse>;
}

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await fetchRecipe(id);
  if (!recipe) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-head text-2xl font-bold">Modifier la recette</h1>
        <p className="text-sm text-muted">{recipe.name}</p>
      </div>
      <RecipeForm mode="edit" initialData={recipe} recipeId={id} />
    </div>
  );
}
