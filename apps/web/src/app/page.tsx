"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const STEPS = [
  { title: "Bienvenue", description: "Une promesse claire, une seule action principale." },
  { title: "Collecte par chat", description: "Régime, allergies, appareils, convives — via des puces rapides." },
  { title: "Recettes", description: "Des cartes avec temps de préparation, nutrition et tags régime/allergènes." },
  { title: "Liste de courses", description: "Groupée par rayon, cases à cocher, quantités ajustées aux convives." },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary-soft">
          <svg width="56" height="56" viewBox="0 0 32 32" aria-hidden="true">
            <g stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round">
              <line x1="9" y1="25" x2="22" y2="8" />
              <line x1="23" y1="25" x2="11" y2="9" />
            </g>
            <circle
              cx="16"
              cy="16"
              r="8.5"
              fill="var(--color-surface)"
              stroke="var(--color-primary)"
              strokeWidth="2"
            />
            <circle cx="16" cy="16" r="4" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
          </svg>
        </div>
        <h1 className="font-head text-4xl font-bold tracking-tight">Bien manger, sans y penser.</h1>
        <p className="max-w-md text-muted">
          Répondez à quelques questions, recevez des recettes diététiques sur mesure et votre liste de
          courses, consolidée et proportionnée au nombre de convives.
        </p>
        <Button onClick={() => router.push("/chat")}>Composer mes recettes</Button>
      </section>

      <section>
        <h2 className="mb-4 font-head text-xl font-bold">Le flux conversationnel</h2>
        <ol className="flex flex-col gap-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold">{step.title}</p>
                <p className="text-sm text-muted">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
