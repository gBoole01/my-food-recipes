import { ChatMessageInput, UserProfileInput } from '@my-food-recipes/contracts';

export type UserProfile = UserProfileInput;

export type ChatMessage = ChatMessageInput;

export interface ProfileCompleteness {
  isComplete: boolean;
  missingFields: string[];
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  id: string;
  name: string;
  servings: number;
  dietTags: string[];
  allergens: string[];
  requiredAppliances: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  nutrition: Nutrition;
  ingredients: Ingredient[];
  steps: string[];
}

export interface RecommendedRecipe extends Recipe {
  personalizedNote: string;
}

export interface ShoppingListItem {
  name: string;
  quantity: number;
  unit: string;
}

export interface ShoppingListCategory {
  category: string;
  items: ShoppingListItem[];
}
