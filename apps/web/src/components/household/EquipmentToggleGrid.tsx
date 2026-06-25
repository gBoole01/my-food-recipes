import { Chip } from "../ui/Chip";
import { EQUIPMENT_OPTIONS } from "./vocabulary";

export function EquipmentToggleGrid({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {EQUIPMENT_OPTIONS.map((option) => (
        <Chip key={option.value} selected={selected.includes(option.value)} onClick={() => onToggle(option.value)}>
          {option.label}
        </Chip>
      ))}
    </div>
  );
}
