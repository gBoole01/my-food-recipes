"use client";

import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Spinner } from "@/components/ui/Spinner";
import { useNutritionCatalog } from "@/hooks/useNutritionCatalog";

function formatNumber(value: number | null): string {
  return value === null ? "—" : value.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
}

export default function CatalogueNutritionPage() {
  const { items, total, page, pageSize, search, runSearch, goToPage, request } = useNutritionCatalog();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-head text-2xl font-bold">Table CIQUAL</h1>
        <p className="text-sm text-muted">{total} aliments référencés · valeurs pour 100 g</p>
      </div>

      <input
        value={search}
        onChange={(e) => runSearch(e.target.value)}
        placeholder="Rechercher un aliment…"
        className="min-h-11 rounded-md border-2 border-border bg-surface px-3 text-sm"
      />

      {request.state === "loading" && items.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16">
          <Spinner size={32} />
          <p className="text-muted">Chargement…</p>
        </div>
      )}

      {request.state === "error" && (
        <ErrorBanner message={request.message} onRetry={() => runSearch(search)} />
      )}

      {items.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-surface-alt text-left">
              <tr>
                <th className="p-3 font-bold">Aliment</th>
                <th className="p-3 font-bold">Groupe</th>
                <th className="p-3 text-right font-bold">kcal</th>
                <th className="p-3 text-right font-bold">Protéines</th>
                <th className="p-3 text-right font-bold">Glucides</th>
                <th className="p-3 text-right font-bold">Lipides</th>
                <th className="p-3 text-right font-bold">Sel</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="p-3 font-semibold">{item.nameFr}</td>
                  <td className="p-3 text-muted">{item.groupName}</td>
                  <td className="p-3 text-right">{formatNumber(item.energyKcal)}</td>
                  <td className="p-3 text-right">{formatNumber(item.protein)}</td>
                  <td className="p-3 text-right">{formatNumber(item.carbohydrate)}</td>
                  <td className="p-3 text-right">{formatNumber(item.fat)}</td>
                  <td className="p-3 text-right">{formatNumber(item.salt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {items.length === 0 && request.state === "success" && (
        <p className="text-sm text-muted">Aucun aliment ne correspond à votre recherche.</p>
      )}

      {total > pageSize && (
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            className="min-h-11 font-bold text-primary underline disabled:cursor-not-allowed disabled:text-muted disabled:no-underline"
          >
            ← Précédent
          </button>
          <span className="text-muted">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
            className="min-h-11 font-bold text-primary underline disabled:cursor-not-allowed disabled:text-muted disabled:no-underline"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}
