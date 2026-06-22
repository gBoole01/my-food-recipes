import type { ShoppingListGroup } from "../../types/domain";
import { ShoppingListItemRow } from "./ShoppingListItemRow";

export function ShoppingListGroupSection({
  group,
  onToggleItem,
}: {
  group: ShoppingListGroup;
  onToggleItem: (itemId: string) => void;
}) {
  return (
    <div>
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-secondary">{group.category}</h2>
      <div className="flex flex-col">
        {group.items.map((item) => (
          <ShoppingListItemRow key={item.id} item={item} onToggle={() => onToggleItem(item.id)} />
        ))}
      </div>
    </div>
  );
}
