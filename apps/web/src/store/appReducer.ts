import type { AppState } from "./appState";
import type {
  ChatMessage,
  CollectionProgress,
  DietaryProfile,
  Recipe,
  ShoppingListGroup,
} from "../types/domain";

export type AppAction =
  | { type: "SEND_MESSAGE_START"; message?: ChatMessage }
  | {
      type: "SEND_MESSAGE_SUCCESS";
      agentMessage: ChatMessage;
      progress: CollectionProgress;
      profile: DietaryProfile;
      isComplete: boolean;
    }
  | { type: "SEND_MESSAGE_ERROR"; errorMessage: string }
  | { type: "FETCH_RECIPES_START" }
  | { type: "FETCH_RECIPES_SUCCESS"; recipes: Recipe[] }
  | { type: "FETCH_RECIPES_ERROR"; errorMessage: string }
  | { type: "TOGGLE_RECIPE_SELECTION"; recipeId: string }
  | { type: "FETCH_SHOPPING_LIST_START" }
  | { type: "FETCH_SHOPPING_LIST_SUCCESS"; groups: ShoppingListGroup[] }
  | { type: "FETCH_SHOPPING_LIST_ERROR"; errorMessage: string }
  | { type: "TOGGLE_ITEM_CHECKED"; itemId: string }
  | { type: "SET_GUEST_COUNT"; guestCount: number };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SEND_MESSAGE_START":
      return {
        ...state,
        messages: action.message ? [...state.messages, action.message] : state.messages,
        chatRequest: { state: "loading" },
      };

    case "SEND_MESSAGE_SUCCESS":
      return {
        ...state,
        messages: [...state.messages, action.agentMessage],
        progress: action.progress,
        profile: action.profile,
        chatRequest: { state: "success", data: null },
      };

    case "SEND_MESSAGE_ERROR":
      return { ...state, chatRequest: { state: "error", message: action.errorMessage } };

    case "FETCH_RECIPES_START":
      return { ...state, recipesRequest: { state: "loading" } };

    case "FETCH_RECIPES_SUCCESS":
      return {
        ...state,
        recipes: action.recipes,
        recipesRequest: { state: "success", data: action.recipes },
      };

    case "FETCH_RECIPES_ERROR":
      return { ...state, recipesRequest: { state: "error", message: action.errorMessage } };

    case "TOGGLE_RECIPE_SELECTION": {
      const selected = new Set(state.selectedRecipeIds);
      if (selected.has(action.recipeId)) selected.delete(action.recipeId);
      else selected.add(action.recipeId);
      return { ...state, selectedRecipeIds: selected };
    }

    case "FETCH_SHOPPING_LIST_START":
      return { ...state, shoppingListRequest: { state: "loading" } };

    case "FETCH_SHOPPING_LIST_SUCCESS":
      return {
        ...state,
        shoppingList: action.groups,
        shoppingListRequest: { state: "success", data: action.groups },
      };

    case "FETCH_SHOPPING_LIST_ERROR":
      return { ...state, shoppingListRequest: { state: "error", message: action.errorMessage } };

    case "TOGGLE_ITEM_CHECKED":
      return {
        ...state,
        shoppingList: state.shoppingList.map((group) => ({
          ...group,
          items: group.items.map((item) =>
            item.id === action.itemId ? { ...item, checked: !item.checked } : item,
          ),
        })),
      };

    case "SET_GUEST_COUNT":
      return { ...state, profile: { ...state.profile, guestCount: action.guestCount } };
  }
}
