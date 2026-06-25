"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAppState } from "../../store/context";
import { StepIndicator } from "./StepIndicator";
import type { RouteStep } from "./StepIndicator";

const STEPS: RouteStep[] = [
  { href: "/", label: "Accueil" },
  { href: "/household", label: "Foyer" },
  { href: "/recipes", label: "Recettes" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/shopping-list", label: "Courses" },
];

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
      <g stroke="var(--color-primary)" strokeWidth="2.4" strokeLinecap="round">
        <line x1="9" y1="25" x2="22" y2="8" />
        <line x1="23" y1="25" x2="11" y2="9" />
      </g>
      <circle cx="16" cy="16" r="8.5" fill="var(--color-bg)" stroke="var(--color-primary)" strokeWidth="2.4" />
      <circle cx="16" cy="16" r="4" fill="none" stroke="var(--color-accent)" strokeWidth="1.6" />
    </svg>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const state = useAppState();
  const pathname = usePathname();

  const reached: Record<string, boolean> = {
    "/": true,
    "/household": true,
    "/recipes": state.recipes.length > 0,
    "/catalogue": true,
    "/shopping-list": state.shoppingList.length > 0,
  };

  return (
    <div className="min-h-screen bg-bg">
      <header className="no-print sticky top-0 z-10 border-b border-border bg-surface">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
          <Logo />
          <span className="font-head text-lg font-bold">My food recipes</span>
        </div>
        <div className="mx-auto max-w-3xl">
          <StepIndicator steps={STEPS} current={pathname} reached={reached} />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
    </div>
  );
}
