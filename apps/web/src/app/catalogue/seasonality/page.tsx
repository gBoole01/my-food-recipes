"use client";

import { Chip } from "@/components/ui/Chip";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Spinner } from "@/components/ui/Spinner";
import { useSeasonality } from "@/hooks/useSeasonality";

const MONTH_LABELS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export default function CatalogueSeasonalityPage() {
  const { items, type, filterByType, request } = useSeasonality();
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-head text-2xl font-bold">Saisonnalité (ADEME)</h1>
        <p className="text-sm text-muted">{items.length} ingrédients · mois en cours surligné</p>
      </div>

      <div className="flex gap-2">
        <Chip selected={type === undefined} onClick={() => filterByType(undefined)}>
          Tous
        </Chip>
        <Chip selected={type === "fruit"} onClick={() => filterByType("fruit")}>
          Fruits
        </Chip>
        <Chip selected={type === "legume"} onClick={() => filterByType("legume")}>
          Légumes
        </Chip>
      </div>

      {request.state === "loading" && items.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16">
          <Spinner size={32} />
          <p className="text-muted">Chargement…</p>
        </div>
      )}

      {request.state === "error" && (
        <ErrorBanner message={request.message} onRetry={() => filterByType(type)} />
      )}

      {items.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-surface-alt text-left">
              <tr>
                <th className="p-3 font-bold">Ingrédient</th>
                {MONTH_LABELS.map((label, index) => (
                  <th
                    key={index}
                    className={`p-2 text-center font-bold ${index + 1 === currentMonth ? "text-primary" : ""}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={`${item.type}:${item.name}`} className="border-t border-border">
                  <td className="p-3 font-semibold">{item.name}</td>
                  {MONTH_LABELS.map((_, index) => {
                    const month = index + 1;
                    const inSeason = item.months.includes(month);
                    return (
                      <td key={month} className="p-2 text-center">
                        {inSeason ? (
                          <span
                            className={`inline-block h-3 w-3 rounded-full ${
                              month === currentMonth ? "bg-primary" : "bg-primary-soft"
                            }`}
                            aria-label="En saison"
                          />
                        ) : (
                          <span aria-hidden="true">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
