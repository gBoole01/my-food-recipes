"use client";

import { useState } from "react";
import type { BmiCategory, EnergyInput, EnergyResponse } from "@my-food-recipes/contracts";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";

const GENDER_OPTIONS = [
  { value: "M" as const, label: "Homme" },
  { value: "F" as const, label: "Femme" },
];

const SPECIAL_CONDITION_OPTIONS = [
  { value: "pregnant" as const, label: "Enceinte" },
  { value: "breastfeeding" as const, label: "Allaitante" },
];

const BMI_CATEGORY_LABELS: Record<BmiCategory, string> = {
  insuffisant: "Insuffisant",
  normal: "Normal",
  surpoids: "Surpoids",
  obese: "Obèse",
};

const BMI_CATEGORY_COLORS: Record<BmiCategory, string> = {
  insuffisant: "text-blue-700 bg-blue-100",
  normal: "text-green-700 bg-green-100",
  surpoids: "text-yellow-700 bg-yellow-100",
  obese: "text-red-700 bg-red-100",
};

type FormValues = Partial<EnergyInput>;

export function EnergyForm({
  initialValues,
  onSubmit,
  onCancel,
}: {
  initialValues?: FormValues;
  onSubmit: (values: EnergyInput) => Promise<EnergyResponse>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<FormValues>({
    sittingHours: 8,
    standingLightHours: 6,
    moderateSportHours: 0,
    intenseSportHours: 0,
    ...initialValues,
  });
  const [result, setResult] = useState<EnergyResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof EnergyInput>(key: K, value: EnergyInput[K] | undefined) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const totalActivityHours =
    (values.sittingHours ?? 0) +
    (values.standingLightHours ?? 0) +
    (values.moderateSportHours ?? 0) +
    (values.intenseSportHours ?? 0);

  const pregnancyOk =
    values.gender !== "F" ||
    values.specialCondition !== "pregnant" ||
    values.pregnancyTrimester != null;

  const isValid =
    !!values.gender &&
    !!values.birthDate &&
    (values.weightKg ?? 0) > 0 &&
    (values.heightCm ?? 0) > 0 &&
    totalActivityHours <= 24 &&
    pregnancyOk;

  const submit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await onSubmit(values as EnergyInput);
      setResult(res);
    } catch {
      setError("Erreur lors du calcul. Vérifiez vos données.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {result && (
        <div className="rounded-md border-2 border-primary bg-primary-soft p-3 flex flex-wrap gap-3 items-center">
          <span className="font-bold text-primary">{result.dailyCaloriesTarget} kcal/j</span>
          <span className="text-sm text-ink">PAL : {result.pal}</span>
          <span className="text-sm text-ink">IMC : {result.bmi}</span>
          <span
            className={`rounded-pill px-3 py-1 text-xs font-bold ${BMI_CATEGORY_COLORS[result.bmiCategory]}`}
          >
            {BMI_CATEGORY_LABELS[result.bmiCategory]}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">Sexe</p>
        <div className="flex gap-2">
          {GENDER_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              selected={values.gender === o.value}
              onClick={() => set("gender", o.value)}
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
          value={values.birthDate ?? ""}
          onChange={(e) => set("birthDate", e.target.value)}
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
            value={values.weightKg ?? ""}
            onChange={(e) => set("weightKg", Number(e.target.value) || undefined)}
            className="min-h-11 rounded-md border-2 border-border bg-surface px-3 font-normal"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-bold">
          Taille (cm)
          <input
            type="number"
            min={100}
            max={250}
            value={values.heightCm ?? ""}
            onChange={(e) => set("heightCm", Number(e.target.value) || undefined)}
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
          value={values.sittingHours ?? 0}
          onChange={(v) => set("sittingHours", v)}
        />
        <ActivityHoursInput
          label="Debout / activité légère"
          value={values.standingLightHours ?? 0}
          onChange={(v) => set("standingLightHours", v)}
        />
        <ActivityHoursInput
          label="Sport modéré (marche rapide, gym légère)"
          value={values.moderateSportHours ?? 0}
          onChange={(v) => set("moderateSportHours", v)}
        />
        <ActivityHoursInput
          label="Sport intense (course, musculation)"
          value={values.intenseSportHours ?? 0}
          onChange={(v) => set("intenseSportHours", v)}
        />
      </div>

      {values.gender === "F" && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold">Condition particulière (optionnel)</p>
          <div className="flex flex-wrap gap-2">
            <Chip
              selected={!values.specialCondition}
              onClick={() => {
                set("specialCondition", undefined);
                set("pregnancyTrimester", undefined);
              }}
            >
              Aucune
            </Chip>
            {SPECIAL_CONDITION_OPTIONS.map((o) => (
              <Chip
                key={o.value}
                selected={values.specialCondition === o.value}
                onClick={() => {
                  set("specialCondition", o.value);
                  if (o.value !== "pregnant") set("pregnancyTrimester", undefined);
                }}
              >
                {o.label}
              </Chip>
            ))}
          </div>
          {values.specialCondition === "pregnant" && (
            <div className="flex gap-2 mt-1">
              {([1, 2, 3] as const).map((t) => (
                <Chip
                  key={t}
                  selected={values.pregnancyTrimester === t}
                  onClick={() => set("pregnancyTrimester", t)}
                >
                  {t}e trimestre
                </Chip>
              ))}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button onClick={submit} disabled={!isValid || submitting}>
          {submitting ? "Calcul…" : "Calculer mon BEJ"}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Fermer
        </Button>
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
        className="w-20 min-h-9 rounded-md border-2 border-border bg-surface px-2 text-center font-normal"
      />
    </label>
  );
}
