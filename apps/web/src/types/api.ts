import type {
  RecipeInput,
  RecipesRequest as ContractRecipesRequest,
  ShoppingListRequest as ContractShoppingListRequest,
} from "@my-food-recipes/contracts";
import type { CollectionProgress, DietaryProfile, QuickReply } from "./domain";

// Chat is reference-only (superseded by the wizard/dashboard flow in TODO.md):
// kept as the frontend's original local contract, not reconciled against the backend.
export type ChatRequest = {
  message: string;
  profile: DietaryProfile;
  progress: CollectionProgress;
};

export type ChatResponse = {
  reply: string;
  needsClarification: boolean;
  quickReplies?: QuickReply[];
  allowMultiple?: boolean;
  progress: CollectionProgress;
  profile: DietaryProfile;
  isComplete: boolean;
};

// Recipes & shopping-list are the active flow: requests mirror the backend's
// Zod schemas (packages/contracts) so the wire format can't drift again.
export type RecipesRequest = ContractRecipesRequest;

export type RecommendedRecipe = RecipeInput & { personalizedNote: string };

export type RecipesResponse = {
  recipes: RecommendedRecipe[];
};

export type ShoppingListRequest = ContractShoppingListRequest;

export type ShoppingListResponseItem = {
  name: string;
  quantity: number;
  unit: string;
};

export type ShoppingListResponseCategory = {
  category: string;
  items: ShoppingListResponseItem[];
};

export type ShoppingListResponse = {
  categories: ShoppingListResponseCategory[];
};
