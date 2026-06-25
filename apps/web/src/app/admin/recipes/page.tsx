import { DeleteRecipeButton } from "@/components/admin/DeleteRecipeButton";
import { Button } from "@/components/ui/Button";
import type { AdminRecipeResponse } from "@my-food-recipes/contracts";
import Link from "next/link";

async function fetchAdminRecipes(): Promise<AdminRecipeResponse[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const key = process.env.ADMIN_API_KEY ?? "";

  const res = await fetch(`${base}/api/admin/recipes`, {
    headers: { "X-Admin-Key": key },
    cache: "no-store",
  });
  if (!res.ok)
    throw new Error(`Impossible de charger les recettes (${res.status})`);
  return res.json() as Promise<AdminRecipeResponse[]>;
}

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-surface-alt text-muted",
  test: "bg-amber-100 text-amber-700",
  published: "bg-green-100 text-green-700",
};
const STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  test: "Test",
  published: "Publié",
};

export default async function AdminRecipesPage() {
  const recipes = await fetchAdminRecipes();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-head text-2xl font-bold">Recettes</h1>
          <p className="text-sm text-muted">
            {recipes.length} recette{recipes.length !== 1 ? "s" : ""} dans le
            catalogue
          </p>
        </div>
        <Link href="/admin/recipes/new">
          <Button>+ Nouvelle recette</Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-alt text-left">
              <th className="px-4 py-3 font-bold">Titre</th>
              <th className="px-4 py-3 font-bold">Statut</th>
              <th className="px-4 py-3 font-bold">Temps total</th>
              <th className="px-4 py-3 font-bold">Tags diète</th>
              <th className="px-4 py-3 font-bold sr-only">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr
                key={recipe.id}
                className="border-b border-border last:border-0 hover:bg-surface-alt/50"
              >
                <td className="px-4 py-3 font-semibold">{recipe.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-pill px-2 py-0.5 text-xs font-bold ${STATUS_STYLES[recipe.status] ?? ""}`}
                  >
                    {STATUS_LABELS[recipe.status] ?? recipe.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {recipe.dietTags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-pill bg-primary-soft px-2 py-0.5 text-xs text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                    {recipe.dietTags.length > 3 && (
                      <span className="text-xs text-muted">
                        +{recipe.dietTags.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/recipes/${recipe.id}/edit`}
                      className="font-semibold text-primary hover:underline"
                    >
                      Modifier
                    </Link>
                    <DeleteRecipeButton id={recipe.id} />
                  </div>
                </td>
              </tr>
            ))}
            {recipes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  Aucune recette.{" "}
                  <Link
                    href="/admin/recipes/new"
                    className="text-primary hover:underline"
                  >
                    Créer la première
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
