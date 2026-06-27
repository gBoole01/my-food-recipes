import Link from "next/link";
import type { IngredientAliasListResponse } from "@my-food-recipes/contracts";
import { IngredientsSearchBar } from "@/components/admin/IngredientsSearchBar";
import { Suspense } from "react";

const PAGE_SIZE = 30;

async function fetchAliases(
  search: string,
  page: number,
): Promise<IngredientAliasListResponse> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const key = process.env.ADMIN_API_KEY ?? "";
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set("search", search);
  const res = await fetch(`${base}/api/admin/ingredients?${params.toString()}`, {
    headers: { "X-Admin-Key": key },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
  return res.json() as Promise<IngredientAliasListResponse>;
}

function PaginationLink({
  href,
  children,
  disabled,
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span className="rounded-md border border-border px-3 py-1.5 text-sm text-muted opacity-40">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-primary-soft"
    >
      {children}
    </Link>
  );
}

export default async function IngredientsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search = "", page: pageParam = "1" } = await searchParams;
  const page = Math.max(1, parseInt(pageParam) || 1);

  const data = await fetchAliases(search, page);
  const totalPages = Math.ceil(data.total / PAGE_SIZE);

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(p));
    return `/admin/ingredients?${params.toString()}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-head text-2xl font-bold">Catalogue d&apos;ingrédients</h1>
        <p className="mt-1 text-sm text-muted">
          {data.total} alias{data.total !== 1 ? "" : ""} dans le catalogue — ces entrées apparaissent dans la recherche lors de la saisie des recettes.
        </p>
      </div>

      <Suspense>
        <IngredientsSearchBar defaultValue={search} />
      </Suspense>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface">
            <tr>
              <th className="px-4 py-3 text-left font-bold">Alias (recette)</th>
              <th className="px-4 py-3 text-left font-bold">Nom CIQUAL</th>
              <th className="px-4 py-3 text-left font-bold">Catégorie</th>
              <th className="px-4 py-3 text-center font-bold">Type</th>
              <th className="px-4 py-3 text-center font-bold">Lié</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Aucun résultat pour &laquo; {search} &raquo;
                </td>
              </tr>
            )}
            {data.items.map((item) => (
              <tr key={item.id} className="hover:bg-surface">
                <td className="px-4 py-3 font-medium">{item.alias}</td>
                <td className="px-4 py-3 text-muted">
                  {item.foodNutritionName ?? (
                    <span className="italic text-orange-400">non lié</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted">{item.categoryName ?? "—"}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex flex-wrap justify-center gap-1">
                    {item.isPantryStaple && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        placard
                      </span>
                    )}
                    {item.seasonalType === 'fruit' && (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                        fruit
                      </span>
                    )}
                    {item.seasonalType === 'legume' && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        légume
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${
                      item.foodNutritionId ? "bg-green-500" : "bg-orange-400"
                    }`}
                    title={item.foodNutritionId ? "Lié à CIQUAL" : "Non lié"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <PaginationLink href={buildHref(page - 1)} disabled={page <= 1}>
            ← Précédent
          </PaginationLink>
          <span className="text-sm text-muted">
            Page {page} / {totalPages}
          </span>
          <PaginationLink href={buildHref(page + 1)} disabled={page >= totalPages}>
            Suivant →
          </PaginationLink>
        </div>
      )}
    </div>
  );
}
