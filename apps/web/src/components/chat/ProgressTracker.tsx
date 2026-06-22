import type { CollectionProgress } from "../../types/domain";

const LABELS: { key: keyof CollectionProgress; label: string }[] = [
  { key: "regime", label: "Régime" },
  { key: "allergies", label: "Allergies" },
  { key: "appliances", label: "Appareils" },
  { key: "guestCount", label: "Convives" },
];

export function ProgressTracker({ progress }: { progress: CollectionProgress }) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Progression de la collecte d'informations">
      {LABELS.map(({ key, label }) => {
        const done = progress[key];
        return (
          <span
            key={key}
            className={`rounded-pill px-3 py-1 text-xs font-bold ${
              done ? "bg-secondary-soft text-secondary" : "bg-surface-alt text-muted"
            }`}
          >
            {done ? "✓ " : ""}
            {label}
          </span>
        );
      })}
    </div>
  );
}
