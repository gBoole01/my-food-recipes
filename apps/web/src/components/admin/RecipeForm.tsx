"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminRecipeCreate, AdminRecipeResponse } from "@my-food-recipes/contracts";
import { createRecipe, updateRecipe } from "@/app/admin/recipes/actions";
import { Button } from "@/components/ui/Button";

const DIET_TAGS = ["omnivore", "vegetarien", "vegetalien", "paleo", "sans_gluten"];
const DIET_LABELS: Record<string, string> = {
  omnivore: "Omnivore",
  vegetarien: "Végétarien",
  vegetalien: "Végétalien",
  paleo: "Paléo",
  sans_gluten: "Sans gluten",
};
const ALLERGENS = [
  "gluten", "lactose", "oeufs", "arachides",
  "fruits_a_coque", "poisson", "crustaces", "soja", "sesame",
];
const ALLERGEN_LABELS: Record<string, string> = {
  gluten: "Gluten",
  lactose: "Lactose",
  oeufs: "Œufs",
  arachides: "Arachides",
  fruits_a_coque: "Fruits à coque",
  poisson: "Poisson",
  crustaces: "Crustacés",
  soja: "Soja",
  sesame: "Sésame",
};
const APPLIANCES = ["Four", "Micro-ondes", "Mixeur", "Robot culinaire", "Wok", "Friteuse", "Autocuiseur"];

interface IngredientRow {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

interface FormState {
  name: string;
  servingsInput: number;
  status: "draft" | "test" | "published";
  dietTags: string[];
  allergens: string[];
  requiredAppliances: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: IngredientRow[];
  steps: string[];
}

const DEFAULT: FormState = {
  name: "",
  servingsInput: 1,
  status: "draft",
  dietTags: [],
  allergens: [],
  requiredAppliances: [],
  prepTimeMinutes: 15,
  cookTimeMinutes: 0,
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  ingredients: [{ name: "", quantity: 100, unit: "g", category: "" }],
  steps: [""],
};

function fromInitialData(data: AdminRecipeResponse): FormState {
  return {
    name: data.name,
    servingsInput: 1,
    status: data.status,
    dietTags: data.dietTags,
    allergens: data.allergens,
    requiredAppliances: data.requiredAppliances,
    prepTimeMinutes: data.prepTimeMinutes,
    cookTimeMinutes: data.cookTimeMinutes,
    calories: data.nutrition.calories,
    protein: data.nutrition.protein,
    carbs: data.nutrition.carbs,
    fat: data.nutrition.fat,
    ingredients: data.ingredients.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      unit: i.unit,
      category: i.category,
    })),
    steps: [...data.steps],
  };
}

interface RecipeFormProps {
  mode: "create" | "edit";
  initialData?: AdminRecipeResponse;
  recipeId?: string;
}

export function RecipeForm({ mode, initialData, recipeId }: RecipeFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>(
    initialData ? fromInitialData(initialData) : DEFAULT,
  );
  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleArray(
    field: "dietTags" | "allergens" | "requiredAppliances",
    value: string,
  ) {
    setForm((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  }

  function setStep(index: number, value: string) {
    setForm((prev) => {
      const steps = [...prev.steps];
      steps[index] = value;
      return { ...prev, steps };
    });
  }

  function setIngredient(
    index: number,
    key: keyof IngredientRow,
    value: string | number,
  ) {
    setForm((prev) => {
      const ingredients = [...prev.ingredients];
      ingredients[index] = { ...ingredients[index], [key]: value };
      return { ...prev, ingredients };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload: AdminRecipeCreate = {
      name: form.name,
      servingsInput: form.servingsInput,
      status: form.status,
      dietTags: form.dietTags,
      allergens: form.allergens,
      requiredAppliances: form.requiredAppliances,
      prepTimeMinutes: form.prepTimeMinutes,
      cookTimeMinutes: form.cookTimeMinutes,
      nutrition: {
        calories: form.calories,
        protein: form.protein,
        carbs: form.carbs,
        fat: form.fat,
      },
      ingredients: form.ingredients,
      steps: form.steps.filter((s) => s.trim().length > 0),
    };

    startTransition(async () => {
      const result =
        mode === "edit" && recipeId
          ? await updateRecipe(recipeId, payload)
          : await createRecipe(payload);

      if (result.error) {
        setError(result.error);
      } else {
        router.push("/admin/recipes");
      }
    });
  }

  const input =
    "min-h-11 w-full rounded-md border-2 border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none";
  const label = "block text-sm font-bold mb-1";
  const section = "rounded-lg border border-border bg-surface p-4 flex flex-col gap-4";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* General info */}
      <section className={section}>
        <h2 className="font-head text-base font-bold">Informations générales</h2>

        <div className="sm:col-span-2">
          <label className={label}>Titre *</label>
          <input
            className={input}
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Ex : Poulet rôti au citron et aux herbes"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Statut</label>
            <select
              className={input}
              value={form.status}
              onChange={(e) =>
                setField("status", e.target.value as FormState["status"])
              }
            >
              <option value="draft">Brouillon</option>
              <option value="test">Test</option>
              <option value="published">Publié</option>
            </select>
          </div>

          <div>
            <label className={label}>Quantités saisies pour X personnes</label>
            <input
              className={input}
              type="number"
              min={1}
              value={form.servingsInput}
              onChange={(e) =>
                setField("servingsInput", Math.max(1, parseInt(e.target.value) || 1))
              }
            />
            <p className="mt-1 text-xs text-muted">
              Les quantités seront divisées par ce nombre avant stockage (1 personne).
            </p>
          </div>

          <div>
            <label className={label}>Temps de préparation (min) *</label>
            <input
              className={input}
              type="number"
              min={1}
              value={form.prepTimeMinutes}
              onChange={(e) =>
                setField("prepTimeMinutes", parseInt(e.target.value) || 0)
              }
              required
            />
          </div>

          <div>
            <label className={label}>Temps de cuisson (min)</label>
            <input
              className={input}
              type="number"
              min={0}
              value={form.cookTimeMinutes}
              onChange={(e) =>
                setField("cookTimeMinutes", parseInt(e.target.value) || 0)
              }
            />
          </div>
        </div>
      </section>

      {/* Tags & restrictions */}
      <section className={section}>
        <h2 className="font-head text-base font-bold">Tags & restrictions</h2>

        <div>
          <p className={label}>Régime alimentaire</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {DIET_TAGS.map((tag) => (
              <label key={tag} className="flex cursor-pointer items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={form.dietTags.includes(tag)}
                  onChange={() => toggleArray("dietTags", tag)}
                  className="h-4 w-4 accent-primary"
                />
                {DIET_LABELS[tag]}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className={label}>Allergènes</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {ALLERGENS.map((a) => (
              <label key={a} className="flex cursor-pointer items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={form.allergens.includes(a)}
                  onChange={() => toggleArray("allergens", a)}
                  className="h-4 w-4 accent-primary"
                />
                {ALLERGEN_LABELS[a]}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className={label}>Appareils requis</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {APPLIANCES.map((appliance) => (
              <label key={appliance} className="flex cursor-pointer items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={form.requiredAppliances.includes(appliance)}
                  onChange={() => toggleArray("requiredAppliances", appliance)}
                  className="h-4 w-4 accent-primary"
                />
                {appliance}
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Nutrition */}
      <section className={section}>
        <h2 className="font-head text-base font-bold">
          Valeurs nutritionnelles (pour 1 personne stockée)
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(
            [
              { key: "calories", label: "Calories (kcal)" },
              { key: "protein", label: "Protéines (g)" },
              { key: "carbs", label: "Glucides (g)" },
              { key: "fat", label: "Lipides (g)" },
            ] as const
          ).map(({ key, label: lbl }) => (
            <div key={key}>
              <label className={label}>{lbl}</label>
              <input
                className={input}
                type="number"
                min={0}
                step="0.1"
                value={form[key]}
                onChange={(e) =>
                  setField(key, parseFloat(e.target.value) || 0)
                }
              />
            </div>
          ))}
        </div>
      </section>

      {/* Ingredients */}
      <section className={section}>
        <div className="flex items-center justify-between">
          <h2 className="font-head text-base font-bold">Ingrédients</h2>
          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                ingredients: [
                  ...prev.ingredients,
                  { name: "", quantity: 100, unit: "g", category: "" },
                ],
              }))
            }
            className="text-sm font-semibold text-primary hover:underline"
          >
            + Ajouter
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-[1fr_80px_70px_1fr_auto] gap-2 text-xs font-bold text-muted">
            <span>Nom</span>
            <span>Qté</span>
            <span>Unité</span>
            <span>Catégorie</span>
            <span />
          </div>
          {form.ingredients.map((ing, i) => (
            <div key={i} className="grid grid-cols-[1fr_80px_70px_1fr_auto] gap-2 items-center">
              <input
                className={input}
                placeholder="Nom"
                value={ing.name}
                onChange={(e) => setIngredient(i, "name", e.target.value)}
                required
              />
              <input
                className={input}
                type="number"
                min={0}
                step="0.01"
                value={ing.quantity}
                onChange={(e) =>
                  setIngredient(i, "quantity", parseFloat(e.target.value) || 0)
                }
                required
              />
              <input
                className={input}
                placeholder="g"
                value={ing.unit}
                onChange={(e) => setIngredient(i, "unit", e.target.value)}
                required
              />
              <input
                className={input}
                placeholder="Catégorie"
                value={ing.category}
                onChange={(e) => setIngredient(i, "category", e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    ingredients: prev.ingredients.filter((_, j) => j !== i),
                  }))
                }
                disabled={form.ingredients.length === 1}
                className="px-2 text-lg text-muted hover:text-ink disabled:opacity-30"
                aria-label="Supprimer l'ingrédient"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className={section}>
        <div className="flex items-center justify-between">
          <h2 className="font-head text-base font-bold">Étapes de préparation</h2>
          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({ ...prev, steps: [...prev.steps, ""] }))
            }
            className="text-sm font-semibold text-primary hover:underline"
          >
            + Ajouter
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {form.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-3 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                {i + 1}
              </span>
              <textarea
                className={`${input} resize-none`}
                rows={2}
                placeholder={`Étape ${i + 1}`}
                value={step}
                onChange={(e) => setStep(i, e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    steps: prev.steps.filter((_, j) => j !== i),
                  }))
                }
                disabled={form.steps.length === 1}
                className="mt-2 px-2 text-lg text-muted hover:text-ink disabled:opacity-30"
                aria-label="Supprimer l'étape"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Enregistrement…"
            : mode === "create"
              ? "Créer la recette"
              : "Enregistrer les modifications"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/recipes")}
          disabled={isPending}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
