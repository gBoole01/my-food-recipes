"use client";

import { useState } from "react";
import type {
  BmiCategory,
  EnergyInput,
  EnergyResponse,
  MemberProfile,
  MemberUpdateRequest,
} from "@my-food-recipes/contracts";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Tag } from "../ui/Tag";
import { MemberForm } from "./MemberForm";
import { DIET_OPTIONS, PRIMARY_GOAL_OPTIONS } from "./vocabulary";

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
  const goalLabel =
    PRIMARY_GOAL_OPTIONS.find((o) => o.value === member.primaryGoal)?.label ??
    member.primaryGoal;
  const dietLabel =
    DIET_OPTIONS.find((o) => o.value === member.diet)?.label ?? member.diet;

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
        <Tag>{member.dailyCaloriesTarget} kcal/j</Tag>
        {member.bmi != null && member.bmiCategory != null && (
          <span
            className={`rounded-pill px-3 py-1 text-xs font-bold whitespace-nowrap ${BMI_CATEGORY_COLORS[member.bmiCategory]}`}
          >
            IMC {member.bmi} · {BMI_CATEGORY_LABELS[member.bmiCategory]}
          </span>
        )}
      </div>

      {member.allergens.length > 0 && (
        <p className="mb-1 text-sm text-muted">
          <span className="font-bold text-ink">Allergènes : </span>
          {member.allergens.join(", ")}
        </p>
      )}
      {member.excludedIngredients.length > 0 && (
        <p className="text-sm text-muted">
          <span className="font-bold text-ink">Exclusions : </span>
          {member.excludedIngredients.join(", ")}
        </p>
      )}
    </Card>
  );
}
