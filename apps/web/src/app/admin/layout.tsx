import Link from "next/link";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-10 border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-head text-lg font-bold">Admin</span>
            <span className="text-muted">·</span>
            <Link
              href="/admin/recipes"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Recettes
            </Link>
            <span className="text-muted">·</span>
            <Link
              href="/admin/pantry-staples"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Fond de placard
            </Link>
            <span className="text-muted">·</span>
            <Link
              href="/admin/ingredients"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Ingrédients
            </Link>
          </div>
          <Link href="/" className="text-sm text-muted hover:text-ink">
            ← Retour à l'app
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
