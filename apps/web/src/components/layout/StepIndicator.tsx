"use client";

import { useRouter } from "next/navigation";

export type RouteStep = { href: string; label: string };

export function StepIndicator({
  steps,
  current,
  reached,
  onNavigate,
}: {
  steps: RouteStep[];
  current: string;
  reached: Record<string, boolean>;
  onNavigate?: (href: string) => void;
}) {
  const router = useRouter();

  return (
    <nav className="no-print flex gap-2 overflow-x-auto px-4 py-3" aria-label="Étapes">
      {steps.map((step) => {
        const isActive = step.href === current;
        const isReachable = reached[step.href];
        return (
          <button
            key={step.href}
            type="button"
            disabled={!isReachable}
            onClick={() => (onNavigate ? onNavigate(step.href) : router.push(step.href))}
            aria-current={isActive ? "step" : undefined}
            className={`min-h-11 flex-none rounded-pill px-4 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
              isActive ? "bg-primary text-white" : "border-2 border-border bg-surface text-muted"
            }`}
          >
            {step.label}
          </button>
        );
      })}
    </nav>
  );
}
