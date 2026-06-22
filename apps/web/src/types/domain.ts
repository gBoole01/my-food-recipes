import type { RecipeInput } from "@my-food-recipes/contracts";

export type DietaryProfile = {
  regime: string | null;
  allergies: string[];
  appliances: string[];
  guestCount: number | null;
};

export type CollectionProgress = {
  regime: boolean;
  allergies: boolean;
  appliances: boolean;
  guestCount: boolean;
};

export type QuickReply = {
  id: string;
  label: string;
  value: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "agent";
  kind: "text" | "clarification";
  content: string;
  quickReplies?: QuickReply[];
  allowMultiple?: boolean;
  timestamp: number;
};

// Aligned with the backend's RecipeSchema (packages/contracts) rather than a
// frontend-only shape, so the active /api/recipes flow has one source of truth.
export type Recipe = RecipeInput & { personalizedNote?: string };

// UI-only fields (id, checked, estimatedPrice) have no backend equivalent —
// the API only returns name/quantity/unit per item, grouped by category.
export type ShoppingListItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
  estimatedPrice?: number;
};

export type ShoppingListGroup = {
  category: string;
  items: ShoppingListItem[];
};

export type AsyncStatus<T> =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success"; data: T }
  | { state: "error"; message: string };
