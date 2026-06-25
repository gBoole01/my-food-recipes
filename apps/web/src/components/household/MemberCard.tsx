"use client";

import { useState } from "react";
import type { MemberProfile, MemberUpdateRequest } from "@my-food-recipes/contracts";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Tag } from "../ui/Tag";
import { MemberForm } from "./MemberForm";
import { PRIMARY_GOAL_OPTIONS } from "./vocabulary";

export function MemberCard({
  member,
  onUpdate,
  onRemove,
}: {
  member: MemberProfile;
  onUpdate: (memberId: string, input: MemberUpdateRequest) => Promise<void>;
  onRemove: (memberId: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [removing, setRemoving] = useState(false);
  const goalLabel = PRIMARY_GOAL_OPTIONS.find((o) => o.value === member.primaryGoal)?.label ?? member.primaryGoal;

  if (editing) {
    return (
      <Card className="p-4">
        <MemberForm
          initialValues={member}
          submitLabel="Enregistrer"
          onSubmit={async (values) => {
            await onUpdate(member.id, values);
            setEditing(false);
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
        <Tag>{member.dailyCaloriesTarget} kcal/j</Tag>
        <Tag>{member.maxSodiumMg} mg sodium max</Tag>
        {!member.consumptionTrackingEnabled && <Tag tone="secondary">Suivi désactivé</Tag>}
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
