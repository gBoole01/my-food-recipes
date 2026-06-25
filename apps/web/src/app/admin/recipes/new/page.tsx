import { RecipeForm } from "@/components/admin/RecipeForm";

export default function NewRecipePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-head text-2xl font-bold">Nouvelle recette</h1>
        <p className="text-sm text-muted">
          Renseignez les quantités pour X personnes — elles seront divisées et stockées à l'échelle d'une portion.
        </p>
      </div>
      <RecipeForm mode="create" />
    </div>
  );
}
