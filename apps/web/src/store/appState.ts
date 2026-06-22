import type {
  AsyncStatus,
  ChatMessage,
  CollectionProgress,
  DietaryProfile,
  Recipe,
  ShoppingListGroup,
} from "../types/domain";

export type AppState = {
  messages: ChatMessage[];
  progress: CollectionProgress;
  profile: DietaryProfile;
  chatRequest: AsyncStatus<null>;
  recipes: Recipe[];
  selectedRecipeIds: Set<string>;
  recipesRequest: AsyncStatus<Recipe[]>;
  shoppingList: ShoppingListGroup[];
  shoppingListRequest: AsyncStatus<ShoppingListGroup[]>;
};

export const initialProfile: DietaryProfile = {
  regime: null,
  allergies: [],
  appliances: [],
  guestCount: null,
};

export const initialProgress: CollectionProgress = {
  regime: false,
  allergies: false,
  appliances: false,
  guestCount: false,
};

export const initialState: AppState = {
  messages: [],
  progress: initialProgress,
  profile: initialProfile,
  chatRequest: { state: "idle" },
  recipes: [],
  selectedRecipeIds: new Set(),
  recipesRequest: { state: "idle" },
  shoppingList: [],
  shoppingListRequest: { state: "idle" },
};
