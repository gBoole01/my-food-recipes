"use client";

import { useState } from "react";
import { EquipmentToggleGrid } from "@/components/household/EquipmentToggleGrid";
import { HouseholdRegistrationForm } from "@/components/household/HouseholdRegistrationForm";
import { MemberCard } from "@/components/household/MemberCard";
import { MemberForm } from "@/components/household/MemberForm";
import { TagListEditor } from "@/components/household/TagListEditor";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Spinner } from "@/components/ui/Spinner";
import { useHousehold } from "@/hooks/useHousehold";

export default function HouseholdPage() {
  const {
    household,
    request,
    reload,
    register,
    addMember,
    updateMember,
    removeMember,
    updateEquipment,
    updatePantry,
  } = useHousehold();
  const [addingMember, setAddingMember] = useState(false);

  if (request.state === "loading" && !household) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <Spinner size={32} />
        <p className="text-muted">Chargement de votre foyer…</p>
      </div>
    );
  }

  if (request.state === "error") {
    return <ErrorBanner message={request.message} onRetry={reload} />;
  }

  if (!household) {
    return <HouseholdRegistrationForm onRegister={register} />;
  }

  const toggleEquipment = (value: string) => {
    const next = household.equipment.includes(value)
      ? household.equipment.filter((v) => v !== value)
      : [...household.equipment, value];
    void updateEquipment({ equipment: next });
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div>
        <h1 className="font-head text-2xl font-bold">Mon foyer</h1>
        <p className="text-sm text-muted">Équipement, fond de placard et profils des membres.</p>
      </div>

      <Card className="p-4">
        <p className="mb-3 text-sm font-bold">Équipement disponible</p>
        <EquipmentToggleGrid selected={household.equipment} onToggle={toggleEquipment} />
      </Card>

      <Card className="p-4">
        <TagListEditor
          label="Fond de placard"
          values={household.pantryStaples}
          onChange={(next) => void updatePantry({ pantryStaples: next })}
          placeholder="Ex : Sel, Poivre, Huile d'olive"
        />
      </Card>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-head text-xl font-bold">Membres ({household.members.length})</h2>
          <Button variant="secondary" onClick={() => setAddingMember((v) => !v)}>
            {addingMember ? "Annuler" : "+ Ajouter un membre"}
          </Button>
        </div>

        {addingMember && (
          <Card className="p-4">
            <MemberForm
              submitLabel="Ajouter"
              onSubmit={async (values) => {
                await addMember(values);
                setAddingMember(false);
              }}
              onCancel={() => setAddingMember(false)}
            />
          </Card>
        )}

        {household.members.map((member) => (
          <MemberCard key={member.id} member={member} onUpdate={updateMember} onRemove={removeMember} />
        ))}
      </div>
    </div>
  );
}
