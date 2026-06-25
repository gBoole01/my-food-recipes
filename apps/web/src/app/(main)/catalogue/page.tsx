import Link from "next/link";
import { Card } from "@/components/ui/Card";

const SECTIONS = [
  {
    href: "/catalogue/recipes",
    title: "Recettes",
    description: "Parcourir les recettes du corpus, indépendamment de votre profil.",
  },
  {
    href: "/catalogue/nutrition",
    title: "Nutrition (CIQUAL)",
    description: "Rechercher un aliment et consulter ses valeurs nutritionnelles pour 100 g.",
  },
  {
    href: "/catalogue/seasonality",
    title: "Saisonnalité",
    description: "Voir les mois de pleine saison de chaque fruit ou légume (ADEME).",
  },
];

export default function CataloguePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-head text-2xl font-bold">Données du catalogue</h1>
        <p className="text-sm text-muted">Explorez les jeux de données qui alimentent les recommandations.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full p-4 transition hover:border-primary">
              <h2 className="mb-1 font-head text-lg font-bold">{section.title}</h2>
              <p className="text-sm text-muted">{section.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
