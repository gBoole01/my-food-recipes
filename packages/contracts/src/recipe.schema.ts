import { z } from 'zod';

export const IngredientSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  category: z.string().min(1),
});

export const IngredientAliasSuggestionSchema = z.object({
  id: z.string().uuid(),
  alias: z.string(),
  isPantryStaple: z.boolean(),
  seasonalType: z.enum(['fruit', 'legume']).nullable(),
  seasonalMonths: z.array(z.number().int().min(1).max(12)).nullable(),
  foodNutritionId: z.string().uuid().nullable(),
  foodNutritionName: z.string().nullable(),
  categoryName: z.string().nullable(),
});
export type IngredientAliasSuggestion = z.infer<typeof IngredientAliasSuggestionSchema>;

export const IngredientAliasListResponseSchema = z.object({
  items: z.array(IngredientAliasSuggestionSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});
export type IngredientAliasListResponse = z.infer<typeof IngredientAliasListResponseSchema>;

export const AdminIngredientInputSchema = IngredientSchema.extend({
  aliasId: z.string().uuid().nullable().optional(),
});
export type AdminIngredientInput = z.infer<typeof AdminIngredientInputSchema>;

export const AdminIngredientResponseSchema = IngredientSchema.extend({
  aliasId: z.string().uuid().nullable(),
});
export type AdminIngredientResponse = z.infer<typeof AdminIngredientResponseSchema>;

export const NutritionSchema = z.object({
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fat: z.number().nonnegative(),
});

export const RecipeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  servings: z.number().int().positive(),
  dietTags: z.array(z.string()),
  allergens: z.array(z.string()),
  requiredAppliances: z.array(z.string()),
  prepTimeMinutes: z.number().int().positive(),
  cookTimeMinutes: z.number().int().nonnegative(),
  nutrition: NutritionSchema,
  ingredients: z.array(IngredientSchema).min(1),
  steps: z.array(z.string().min(1)).min(1),
});

export const RecipeCorpusSchema = z.array(RecipeSchema);

export type RecipeInput = z.infer<typeof RecipeSchema>;

// --- Admin schemas (EP4.1) ---

export const RecipeStatusSchema = z.enum(['draft', 'test', 'published']);
export type RecipeStatus = z.infer<typeof RecipeStatusSchema>;

export const AdminRecipeCreateSchema = z.object({
  name: z.string().min(1),
  servingsInput: z.number().int().positive(),
  dietTags: z.array(z.string()),
  allergens: z.array(z.string()),
  requiredAppliances: z.array(z.string()),
  prepTimeMinutes: z.number().int().positive(),
  cookTimeMinutes: z.number().int().nonnegative(),
  nutrition: NutritionSchema,
  ingredients: z.array(AdminIngredientInputSchema).min(1),
  steps: z.array(z.string().min(1)).min(1),
  status: RecipeStatusSchema.optional().default('draft'),
});
export type AdminRecipeCreate = z.infer<typeof AdminRecipeCreateSchema>;

export const AdminRecipeUpdateSchema = AdminRecipeCreateSchema.partial();
export type AdminRecipeUpdate = z.infer<typeof AdminRecipeUpdateSchema>;

export const AdminRecipeResponseSchema = RecipeSchema.omit({ ingredients: true }).extend({
  status: RecipeStatusSchema,
  ingredients: z.array(AdminIngredientResponseSchema).min(1),
});
export type AdminRecipeResponse = z.infer<typeof AdminRecipeResponseSchema>;
