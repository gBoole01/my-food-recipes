"use client";

import { useState } from "react";
import type {
  BmiCategory,
  EnergyInput,
  MemberInput,
  PrimaryGoal,
} from "@my-food-recipes/contracts";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { TagListEditor } from "./TagListEditor";
import { ALLERGEN_OPTIONS, DIET_OPTIONS } from "./vocabulary";

export type MemberFormValues = MemberInput;

const WEIGHT_GOAL_STEPS = [
  { value: "perte_de_poids" as const, label: "Perte de poids" },
  { value: "stabilisation" as const, label: "Stabilisation" },
  { value: "prise_de_masse" as const, label: "Prise de masse" },
] satisfies { value: PrimaryGoal; label: string }[];

type WeightGoalValue = (typeof WEIGHT_GOAL_STEPS)[number]["value"];

function coerceWeightGoal(goal?: PrimaryGoal): WeightGoalValue {
  if (goal === "perte_de_poids" || goal === "prise_de_masse") return goal;
  return "stabilisation";
}

const GENDER_OPTIONS = [
  { value: "M" as const, label: "Homme" },
  { value: "F" as const, label: "Femme" },
];

const SPECIAL_CONDITION_OPTIONS = [
  { value: "pregnant" as const, label: "Enceinte" },
  { value: "breastfeeding" as const, label: "Allaitante" },
];

// Kept for potential future use in displaying inline result
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BMI_CATEGORY_LABELS: Record<BmiCategory, string> = {
  insuffisant: "Insuffisant",
  normal: "Normal",
  surpoids: "Surpoids",
  obese: "Obèse",
};

const DEFAULT_VALUES: MemberFormValues = {
  name: "",
  primaryGoal: "stabilisation",
  dailyCaloriesTarget: 2000,
  diet: "omnivore",
  allergens: [],
  excludedIngredients: [],
};

const DEFAULT_ENERGY_VALUES: Partial<EnergyInput> = {
  sittingHours: 8,
  standingLightHours: 6,
  moderateSportHours: 0,
  intenseSportHours: 0,
};

export function MemberForm({
  initialValues,
  initialEnergyValues,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initialValues?: Partial<MemberFormValues>;
  initialEnergyValues?: Partial<EnergyInput>;
  submitLabel: string;
  onSubmit: (values: MemberFormValues, energy?: EnergyInput) => Promise<void>;
  onCancel?: () => void;
}) {
  const [values, setValues] = useState<MemberFormValues>({
    ...DEFAULT_VALUES,
    ...initialValues,
    primaryGoal: coerceWeightGoal(initialValues?.primaryGoal),
  });

  const [energyValues, setEnergyValues] = useState<Partial<EnergyInput>>({
    ...DEFAULT_ENERGY_VALUES,
    ...initialEnergyValues,
  });

  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof MemberFormValues>(key: K, value: MemberFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const setEnergy = <K extends keyof EnergyInput>(key: K, value: EnergyInput[K] | undefined) =>
    setEnergyValues((prev) => ({ ...prev, [key]: value }));

  const totalActivityHours =
    (energyValues.sittingHours ?? 0) +
    (energyValues.standingLightHours ?? 0) +
    (energyValues.moderateSportHours ?? 0) +
    (energyValues.intenseSportHours ?? 0);

  const pregnancyOk =
    energyValues.gender !== "F" ||
    energyValues.specialCondition !== "pregnant" ||
    energyValues.pregnancyTrimester != null;

  const isEnergyValid =
    !!energyValues.gender &&
    !!energyValues.birthDate &&
    (energyValues.weightKg ?? 0) > 0 &&
    (energyValues.heightCm ?? 0) > 0 &&
    totalActivityHours <= 24 &&
    pregnancyOk;

  const submit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(values, isEnergyValid ? (energyValues as EnergyInput) : undefined);
      onCancel?.();
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
        <p className="text-sm font-bold">Objectif poids</p>
        <div className="flex overflow-hidden rounded-md border-2 border-primary">
          {WEIGHT_GOAL_STEPS.map((step, i) => (
            <button
              key={step.value}
              type="button"
              onClick={() => set("primaryGoal", step.value)}
              className={`flex-1 py-2.5 text-xs font-bold transition ${
                values.primaryGoal === step.value
                  ? "bg-primary text-white"
                  : "bg-transparent text-primary hover:bg-primary-soft"
              } ${i > 0 ? "border-l-2 border-primary" : ""}`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Energy section */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">Sexe</p>
        <div className="flex gap-2">
          {GENDER_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              selected={energyValues.gender === o.value}
              onClick={() => setEnergy("gender", o.value)}
            >
              {o.label}
            </Chip>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1 text-sm font-bold">
        Date de naissance
        <input
          type="date"
          value={energyValues.birthDate ?? ""}
          onChange={(e) => setEnergy("birthDate", e.target.value)}
          className="min-h-11 rounded-md border-2 border-border bg-surface px-3 font-normal"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm font-bold">
          Poids (kg)
          <input
            type="number"
            min={20}
            max={300}
            step={0.1}
            value={energyValues.weightKg ?? ""}
            onChange={(e) => setEnergy("weightKg", Number(e.target.value) || undefined)}
            className="min-h-11 rounded-md border-2 border-border bg-surface px-3 font-normal"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-bold">
          Taille (cm)
          <input
            type="number"
            min={100}
            max={250}
            value={energyValues.heightCm ?? ""}
            onChange={(e) => setEnergy("heightCm", Number(e.target.value) || undefined)}
            className="min-h-11 rounded-md border-2 border-border bg-surface px-3 font-normal"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold">
          Activité quotidienne (heures/jour)
          {totalActivityHours > 24 && (
            <span className="ml-2 text-xs font-normal text-red-600">
              Total {totalActivityHours} h — max 24 h
            </span>
          )}
        </p>
        <ActivityHoursInput
          label="Assis (bureau, voiture, TV)"
          value={energyValues.sittingHours ?? 0}
          onChange={(v) => setEnergy("sittingHours", v)}
        />
        <ActivityHoursInput
          label="Debout / activité légère"
          value={energyValues.standingLightHours ?? 0}
          onChange={(v) => setEnergy("standingLightHours", v)}
        />
        <ActivityHoursInput
          label="Sport modéré (marche rapide, gym légère)"
          value={energyValues.moderateSportHours ?? 0}
          onChange={(v) => setEnergy("moderateSportHours", v)}
        />
        <ActivityHoursInput
          label="Sport intense (course, musculation)"
          value={energyValues.intenseSportHours ?? 0}
          onChange={(v) => setEnergy("intenseSportHours", v)}
        />
      </div>

      {energyValues.gender === "F" && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold">Condition particulière (optionnel)</p>
          <div className="flex flex-wrap gap-2">
            <Chip
              selected={!energyValues.specialCondition}
              onClick={() => {
                setEnergy("specialCondition", undefined);
                setEnergy("pregnancyTrimester", undefined);
              }}
            >
              Aucune
            </Chip>
            {SPECIAL_CONDITION_OPTIONS.map((o) => (
              <Chip
                key={o.value}
                selected={energyValues.specialCondition === o.value}
                onClick={() => {
                  setEnergy("specialCondition", o.value);
                  if (o.value !== "pregnant") setEnergy("pregnancyTrimester", undefined);
                }}
              >
                {o.label}
              </Chip>
            ))}
          </div>
          {energyValues.specialCondition === "pregnant" && (
            <div className="mt-1 flex gap-2">
              {([1, 2, 3] as const).map((t) => (
                <Chip
                  key={t}
                  selected={energyValues.pregnancyTrimester === t}
                  onClick={() => setEnergy("pregnancyTrimester", t)}
                >
                  {t}e trimestre
                </Chip>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">Régime alimentaire</p>
        <div className="flex flex-wrap gap-2">
          {DIET_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              selected={values.diet === option.value}
              onClick={() => set("diet", option.value)}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </div>

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
          {submitting ? "Enregistrement…" : submitLabel}
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

function ActivityHoursInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span className="text-ink">{label}</span>
      <input
        type="number"
        min={0}
        max={24}
        step={0.5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="min-h-9 w-20 rounded-md border-2 border-border bg-surface px-2 text-center font-normal"
      />
    </label>
  );
}
