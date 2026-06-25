"use client";

import { useState } from "react";
import type { MemberInput } from "@my-food-recipes/contracts";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { TagListEditor } from "./TagListEditor";
import { ALLERGEN_OPTIONS, PRIMARY_GOAL_OPTIONS } from "./vocabulary";

export type MemberFormValues = MemberInput;

const DEFAULT_VALUES: MemberFormValues = {
  name: "",
  primaryGoal: "stabilisation",
  dailyCaloriesTarget: 2000,
  maxSodiumMg: 2300,
  consumptionTrackingEnabled: true,
  allergens: [],
  excludedIngredients: [],
};

export function MemberForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initialValues?: Partial<MemberFormValues>;
  submitLabel: string;
  onSubmit: (values: MemberFormValues) => Promise<void>;
  onCancel?: () => void;
}) {
  const [values, setValues] = useState<MemberFormValues>({ ...DEFAULT_VALUES, ...initialValues });
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof MemberFormValues>(key: K, value: MemberFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-bold">
        Prénom
        <input
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          className="min-h-11 rounded-md border-2 border-border bg-surface px-3 font-normal"
        />
      </label>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">Objectif principal</p>
        <div className="flex flex-wrap gap-2">
          {PRIMARY_GOAL_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              selected={values.primaryGoal === option.value}
              onClick={() => set("primaryGoal", option.value)}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm font-bold">
          Calories / jour
          <input
            type="number"
            value={values.dailyCaloriesTarget}
            onChange={(e) => set("dailyCaloriesTarget", Number(e.target.value))}
            className="min-h-11 rounded-md border-2 border-border bg-surface px-3 font-normal"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-bold">
          Sodium max (mg)
          <input
            type="number"
            value={values.maxSodiumMg}
            onChange={(e) => set("maxSodiumMg", Number(e.target.value))}
            className="min-h-11 rounded-md border-2 border-border bg-surface px-3 font-normal"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm font-bold">
        <input
          type="checkbox"
          checked={values.consumptionTrackingEnabled}
          onChange={(e) => set("consumptionTrackingEnabled", e.target.checked)}
          className="h-5 w-5 accent-primary"
        />
        Suivi de consommation activé
      </label>

      <TagListEditor
        label="Allergènes"
        values={values.allergens ?? []}
        suggestions={ALLERGEN_OPTIONS}
        onChange={(next) => set("allergens", next)}
        placeholder="Autre allergène…"
      />

      <TagListEditor
        label="Ingrédients exclus"
        values={values.excludedIngredients ?? []}
        onChange={(next) => set("excludedIngredients", next)}
        placeholder="Ex : champignons"
      />

      <div className="flex gap-3">
        <Button onClick={submit} disabled={submitting || !values.name.trim()}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={submitting}>
            Annuler
          </Button>
        )}
      </div>
    </div>
  );
}
