import type { ShoppingListItem } from "../../types/domain";

export function ShoppingListItemRow({
  item,
  onToggle,
}: {
  item: ShoppingListItem;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex min-h-11 items-center gap-3 border-b border-border py-2 text-left"
    >
      <span
        className={`flex h-6 w-6 flex-none items-center justify-center rounded-md border-2 ${
          item.checked ? "border-secondary bg-secondary" : "border-border"
        }`}
        aria-hidden="true"
      >
        {item.checked && (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </span>
      <span className={`flex-1 font-medium ${item.checked ? "text-muted line-through" : "text-ink"}`}>
        {item.name}
      </span>
      <span className="font-bold text-muted">
        {item.quantity} {item.unit}
      </span>
    </button>
  );
}
