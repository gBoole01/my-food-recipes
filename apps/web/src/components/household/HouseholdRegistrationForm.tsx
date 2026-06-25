"use client";

import { useState } from "react";
import type { EnergyInput, EnergyResponse, Household, HouseholdRegistrationRequest } from "@my-food-recipes/contracts";
import { Card } from "../ui/Card";
import { EquipmentToggleGrid } from "./EquipmentToggleGrid";
import { MemberForm } from "./MemberForm";
import { TagListEditor } from "./TagListEditor";
import { EQUIPMENT_OPTIONS } from "./vocabulary";

export function HouseholdRegistrationForm({
  onRegister,
  onUpdateMemberEnergy,
}: {
  onRegister: (input: HouseholdRegistrationRequest) => Promise<Household>;
  onUpdateMemberEnergy: (memberId: string, input: EnergyInput) => Promise<EnergyResponse>;
}) {
  const [equipment, setEquipment] = useState<string[]>(EQUIPMENT_OPTIONS.map((o) => o.value));
  const [pantryStaples, setPantryStaples] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const toggleEquipment = (value: string) =>
    setEquipment((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-head text-2xl font-bold">Bienvenue !</h1>
        <p className="text-sm text-muted">
          Configurons votre foyer : équipement de cuisine, fond de placard, et au moins un membre.
        </p>
      </div>

      <Card className="p-4">
        <p className="mb-3 text-sm font-bold">Équipement disponible</p>
        <EquipmentToggleGrid selected={equipment} onToggle={toggleEquipment} />
      </Card>

      <Card className="p-4">
        <TagListEditor
          label="Fond de placard"
          values={pantryStaples}
          onChange={setPantryStaples}
          placeholder="Ex : Sel, Poivre, Huile d'olive"
        />
      </Card>

      <Card className="p-4">
        <p className="mb-3 text-sm font-bold">Premier membre du foyer</p>
        <MemberForm
          submitLabel="Créer mon foyer"
          onSubmit={async (values, energy) => {
            setError(null);
            try {
              const household = await onRegister({ equipment, pantryStaples, members: [values] });
              if (energy && household.members[0]) {
                await onUpdateMemberEnergy(household.members[0].id, energy);
              }
            } catch {
              setError("Impossible de créer le foyer. Réessayez.");
            }
          }}
        />
        {error && <p className="mt-3 text-sm text-error">{error}</p>}
      </Card>
    </div>
  );
}
