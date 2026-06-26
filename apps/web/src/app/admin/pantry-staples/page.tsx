import type { GlobalPantryStaple } from "@my-food-recipes/contracts";
import { PantryStaplesClient } from "@/components/admin/PantryStaplesClient";

async function fetchPantryStaples(): Promise<GlobalPantryStaple[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const key = process.env.ADMIN_API_KEY ?? "";

  const res = await fetch(`${base}/api/admin/pantry-staples`, {
    headers: { "X-Admin-Key": key },
    cache: "no-store",
  });
  if (!res.ok)
    throw new Error(`Impossible de charger les fonds de placard (${res.status})`);
  return res.json() as Promise<GlobalPantryStaple[]>;
}

export default async function PantryStaplesPage() {
  const staples = await fetchPantryStaples();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-head text-2xl font-bold">Fond de placard universel</h1>
        <p className="mt-1 text-sm text-muted">
          Les ingrédients listés ici sont exclus automatiquement de toutes les
          listes de courses.{" "}
          <span className="font-semibold text-ink">
            {staples.length} ingrédient{staples.length !== 1 ? "s" : ""} configuré
            {staples.length !== 1 ? "s" : ""}
          </span>
          .
        </p>
      </div>

      <PantryStaplesClient initialStaples={staples} />
    </div>
  );
}
