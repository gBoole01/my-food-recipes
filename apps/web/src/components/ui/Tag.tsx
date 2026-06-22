import type { ReactNode } from "react";

type TagTone = "primary" | "secondary";

const toneClasses: Record<TagTone, string> = {
  primary: "bg-primary-soft text-primary",
  secondary: "bg-secondary-soft text-secondary",
};

export function Tag({ tone = "secondary", children }: { tone?: TagTone; children: ReactNode }) {
  return (
    <span className={`rounded-pill px-3 py-1 text-xs font-bold whitespace-nowrap ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
