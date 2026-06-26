"use client";

import { useState } from "react";
import type {
  BmiCategory,
  EnergyInput,
  EnergyResponse,
  MemberProfile,
  MemberUpdateRequest,
  NutritionalTargets,
  SpecialCondition,
} from "@my-food-recipes/contracts";
import { getNutritionalTargets } from "@/api/profile";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Spinner } from "../ui/Spinner";
import { Tag } from "../ui/Tag";
import { MemberForm } from "./MemberForm";
import { DIET_OPTIONS, PRIMARY_GOAL_OPTIONS, SECONDARY_DIET_OPTIONS } from "./vocabulary";

const SPECIAL_CONDITION_LABELS: Record<SpecialCondition, string> = {
  pregnant: "Enceinte",
  breastfeeding: "Allaitante",
};

const TRIMESTER_LABELS: Record<1 | 2 | 3, string> = {
  1: "1er trimestre",
  2: "2e trimestre",
  3: "3e trimestre",
};

const BMI_CATEGORY_LABELS: Record<BmiCategory, string> = {
  insuffisant: "Insuffisant",
  normal: "Normal",
  surpoids: "Surpoids",
  obese: "Obèse",
};

const BMI_CATEGORY_COLORS: Record<BmiCategory, string> = {
  insuffisant: "bg-blue-100 text-blue-700",
  normal: "bg-green-100 text-green-700",
  surpoids: "bg-yellow-100 text-yellow-700",
  obese: "bg-red-100 text-red-700",
};

export function MemberCard({
  member,
  onUpdate,
  onRemove,
  onUpdateEnergy,
}: {
  member: MemberProfile;
  onUpdate: (memberId: string, input: MemberUpdateRequest) => Promise<void>;
  onRemove: (memberId: string) => Promise<void>;
  onUpdateEnergy: (memberId: string, input: EnergyInput) => Promise<EnergyResponse>;
}) {
  const [editing, setEditing] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [showTargets, setShowTargets] = useState(false);
  const [targets, setTargets] = useState<NutritionalTargets | null>(null);
  const [targetsError, setTargetsError] = useState<string | null>(null);
  const [targetsLoading, setTargetsLoading] = useState(false);

  const goalLabel =
    PRIMARY_GOAL_OPTIONS.find((o) => o.value === member.primaryGoal)?.label ??
    member.primaryGoal;
  const dietLabel =
    DIET_OPTIONS.find((o) => o.value === member.diet)?.label ?? member.diet;

  const handleToggleTargets = async () => {
    if (showTargets) {
      setShowTargets(false);
      return;
    }
    setShowTargets(true);
    if (targets !== null) return;
    setTargetsLoading(true);
    setTargetsError(null);
    try {
      const data = await getNutritionalTargets(member.id);
      setTargets(data);
    } catch {
      setTargetsError("Impossible de charger les objectifs nutritionnels.");
    } finally {
      setTargetsLoading(false);
    }
  };

  if (editing) {
    const energyInitialValues: Partial<EnergyInput> = {
      gender: member.gender ?? undefined,
      birthDate: member.birthDate ?? undefined,
      weightKg: member.weightKg ?? undefined,
      heightCm: member.heightCm ?? undefined,
      sittingHours: member.sittingHours ?? undefined,
      standingLightHours: member.standingLightHours ?? undefined,
      moderateSportHours: member.moderateSportHours ?? undefined,
      intenseSportHours: member.intenseSportHours ?? undefined,
      specialCondition: member.specialCondition ?? undefined,
      pregnancyTrimester: member.pregnancyTrimester ?? undefined,
    };

    return (
      <Card className="p-4">
        <MemberForm
          initialValues={member}
          initialEnergyValues={energyInitialValues}
          submitLabel="Enregistrer"
          onSubmit={async (values, energy) => {
            await onUpdate(member.id, values);
            if (energy) await onUpdateEnergy(member.id, energy);
          }}
          onCancel={() => setEditing(false)}
        />
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-head text-lg font-bold">{member.name}</h3>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setEditing(true)}>
            Modifier
          </Button>
          <Button
            variant="ghost"
            disabled={removing}
            onClick={async () => {
              setRemoving(true);
              await onRemove(member.id);
              setRemoving(false);
            }}
          >
            Retirer
          </Button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        <Tag>{goalLabel}</Tag>
        <Tag>{dietLabel}</Tag>
        {(member.secondaryDiets ?? []).map((sd) => (
          <Tag key={sd}>
            {SECONDARY_DIET_OPTIONS.find((o) => o.value === sd)?.label ?? sd}
          </Tag>
        ))}
        <Tag>{member.dailyCaloriesTarget} kcal/j</Tag>
        {member.bmi != null && member.bmiCategory != null && (
          <span
            className={`rounded-pill px-3 py-1 text-xs font-bold whitespace-nowrap ${BMI_CATEGORY_COLORS[member.bmiCategory]}`}
          >
            IMC {member.bmi} · {BMI_CATEGORY_LABELS[member.bmiCategory]}
          </span>
        )}
        {member.specialCondition != null && (
          <Tag>
            {SPECIAL_CONDITION_LABELS[member.specialCondition]}
            {member.specialCondition === "pregnant" && member.pregnancyTrimester != null
              ? ` · ${TRIMESTER_LABELS[member.pregnancyTrimester]}`
              : ""}
          </Tag>
        )}
      </div>

      {member.allergens.length > 0 && (
        <p className="mb-1 text-sm text-muted">
          <span className="font-bold text-ink">Allergènes : </span>
          {member.allergens.join(", ")}
        </p>
      )}
      {member.excludedIngredients.length > 0 && (
        <p className="mb-3 text-sm text-muted">
          <span className="font-bold text-ink">Exclusions : </span>
          {member.excludedIngredients.join(", ")}
        </p>
      )}

      {member.dailyCaloriesTarget > 0 && (
        <div className="border-t border-border pt-3">
          <button
            type="button"
            onClick={() => void handleToggleTargets()}
            className="flex w-full items-center gap-1.5 text-left text-sm font-semibold text-ink hover:text-primary transition-colors"
          >
            <span
              className={`inline-block transition-transform duration-200 ${showTargets ? "rotate-90" : ""}`}
            >
              ▶
            </span>
            Objectifs nutritionnels
          </button>

          {showTargets && (
            <div className="mt-3">
              {targetsLoading && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Spinner size={14} />
                  <span>Calcul en cours…</span>
                </div>
              )}

              {targetsError && (
                <p className="text-sm text-red-600">{targetsError}</p>
              )}

              {targets && (
                <div className="flex flex-col gap-4">
                  {/* Macros */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
                      Macronutriments / jour
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <MacroCell label="Protéines" value={targets.macros.proteinGrams} unit="g" color="bg-blue-50 text-blue-700" />
                      <MacroCell label="Lipides" value={targets.macros.fatGrams} unit="g" color="bg-yellow-50 text-yellow-700" />
                      <MacroCell label="Glucides" value={targets.macros.carbGrams} unit="g" color="bg-orange-50 text-orange-700" />
                    </div>
                  </div>

                  {/* Calorie distribution */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
                      Répartition calorique
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <DistRow icon="🌅" label="Petit-déjeuner" value={targets.calorieDistribution.breakfast} />
                      <DistRow icon="☀️" label="Déjeuner" value={targets.calorieDistribution.lunch} />
                      <DistRow icon="🌙" label="Dîner" value={targets.calorieDistribution.dinner} />
                      <DistRow icon="🍎" label="Collation" value={targets.calorieDistribution.snack} />
                    </div>
                  </div>

                  {/* Micronutrients */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
                      Micronutriments / jour (ANSES)
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <MicroRow label="Fibres" value={targets.micros.fiberG} unit="g" />
                      <MicroRow label="Fer" value={targets.micros.ironMg} unit="mg" />
                      <MicroRow label="Calcium" value={targets.micros.calciumMg} unit="mg" />
                      <MicroRow label="Magnésium" value={targets.micros.magnesiumMg} unit="mg" />
                      <MicroRow label="Vitamine C" value={targets.micros.vitaminCMg} unit="mg" />
                    </div>
                  </div>

                  {/* Weekly constraints */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
                      Contraintes hebdomadaires
                    </p>
                    <div className="flex flex-col gap-1 text-sm text-muted">
                      <span>🐟 Min. <strong className="text-ink">{targets.weeklyConstraints.minFattyFishMeals}</strong> repas poissons gras / semaine</span>
                      <span>📊 Charge glycémique ≤ <strong className="text-ink">{targets.weeklyConstraints.maxDailyGlycemicLoad}</strong> / jour</span>
                      <span>⚖️ Ratio Oméga-6 / Oméga-3 ≤ <strong className="text-ink">{targets.weeklyConstraints.maxOmegaRatio}</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function MacroCell({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  return (
    <div className={`rounded-lg p-2.5 text-center ${color}`}>
      <p className="text-lg font-bold leading-none">
        {value}<span className="text-xs font-normal">{unit}</span>
      </p>
      <p className="mt-0.5 text-xs opacity-80">{label}</p>
    </div>
  );
}

function DistRow({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">
        {icon} {label}
      </span>
      <span className="font-semibold text-ink">{value} kcal</span>
    </div>
  );
}

function MicroRow({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className="font-semibold text-ink">
        {value} {unit}
      </span>
    </div>
  );
}
