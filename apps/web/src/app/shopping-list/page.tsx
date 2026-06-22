"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ExportPrintButton } from "@/components/shopping-list/ExportPrintButton";
import { ShoppingListGroupSection } from "@/components/shopping-list/ShoppingListGroupSection";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Spinner } from "@/components/ui/Spinner";
import { useShoppingList } from "@/hooks/useShoppingList";

export default function ShoppingListPage() {
  const { shoppingList, shoppingListRequest, profile, generateList, adjustGuestCount, toggleItem } =
    useShoppingList();
  const router = useRouter();

  useEffect(() => {
    if (shoppingListRequest.state === "idle") void generateList();
  }, [shoppingListRequest.state, generateList]);

  if (shoppingListRequest.state === "loading" && shoppingList.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <Spinner size={32} />
        <p className="text-muted">Préparation de votre liste de courses…</p>
      </div>
    );
  }

  if (shoppingListRequest.state === "error" && shoppingList.length === 0) {
    return <ErrorBanner message={shoppingListRequest.message} onRetry={generateList} />;
  }

  const totalItems = shoppingList.reduce((sum, group) => sum + group.items.length, 0);
  const checkedCount = shoppingList.reduce(
    (sum, group) => sum + group.items.filter((item) => item.checked).length,
    0,
  );
  const progressPct = totalItems ? Math.round((checkedCount / totalItems) * 100) : 0;
  const estimate = shoppingList
    .reduce(
      (sum, group) => sum + group.items.reduce((itemSum, item) => itemSum + (item.estimatedPrice ?? 0), 0),
      0,
    )
    .toFixed(2)
    .replace(".", ",");

  return (
    <div className="flex flex-col gap-6 pb-28">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="font-head text-2xl font-bold">Liste de courses</h1>
          <ExportPrintButton />
        </div>
        <p className="text-sm text-muted">
          {checkedCount} / {totalItems} cochés
        </p>
      </div>

      <div className="no-print flex items-center justify-between rounded-md border border-border bg-surface p-3">
        <span className="font-semibold">Quantités pour</span>
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Moins de convives"
            onClick={() => adjustGuestCount(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-border text-xl"
          >
            −
          </button>
          <span className="min-w-16 text-center font-head text-lg font-bold">
            {profile.guestCount ?? 2} pers.
          </span>
          <button
            type="button"
            aria-label="Plus de convives"
            onClick={() => adjustGuestCount(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-primary text-xl text-white"
          >
            +
          </button>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-pill bg-surface-alt">
        <div className="h-full rounded-pill bg-secondary transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      {shoppingListRequest.state === "error" && (
        <ErrorBanner message={shoppingListRequest.message} onRetry={generateList} />
      )}

      <div className="flex flex-col gap-6">
        {shoppingList.map((group) => (
          <ShoppingListGroupSection key={group.category} group={group} onToggleItem={toggleItem} />
        ))}
      </div>

      <div className="no-print fixed inset-x-0 bottom-0 border-t border-border bg-surface p-4">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
          <div className="text-sm text-muted">
            Estimation
            <br />
            <span className="font-head text-lg font-bold text-ink">{estimate} €</span>
          </div>
          <Button variant="secondary" onClick={() => router.push("/")}>
            Terminé
          </Button>
        </div>
      </div>
    </div>
  );
}
