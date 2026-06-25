import { z } from 'zod';
import { RecipeSchema } from './recipe.schema';

// --- Read-only catalog browsing endpoints ---
// Distinct from the active /api/recipes (Gemini recommendation) and
// /api/profile (household CRUD) flows: these expose the raw seeded data
// (recipe corpus, CIQUAL nutrition table, ADEME seasonality table) for
// browsing/verification, independent of any user profile.

export const RecipeCatalogResponseSchema = z.object({
  recipes: z.array(RecipeSchema),
});
export type RecipeCatalogResponse = z.infer<typeof RecipeCatalogResponseSchema>;

export const FoodNutritionSummarySchema = z.object({
  id: z.string(),
  alimCode: z.string(),
  nameFr: z.string(),
  groupName: z.string(),
  subgroupName: z.string(),
  energyKcal: z.number().nullable(),
  protein: z.number().nullable(),
  carbohydrate: z.number().nullable(),
  fat: z.number().nullable(),
  sugarTotal: z.number().nullable(),
  fiber: z.number().nullable(),
  salt: z.number().nullable(),
});
export type FoodNutritionSummary = z.infer<typeof FoodNutritionSummarySchema>;

export const FoodNutritionListResponseSchema = z.object({
  items: z.array(FoodNutritionSummarySchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});
export type FoodNutritionListResponse = z.infer<
  typeof FoodNutritionListResponseSchema
>;

export const SeasonalityTypeSchema = z.enum(['fruit', 'legume']);
export type SeasonalityType = z.infer<typeof SeasonalityTypeSchema>;

export const SeasonalityItemSchema = z.object({
  name: z.string(),
  type: SeasonalityTypeSchema,
  months: z.array(z.number().int().min(1).max(12)),
});
export type SeasonalityItem = z.infer<typeof SeasonalityItemSchema>;

export const SeasonalityListResponseSchema = z.object({
  items: z.array(SeasonalityItemSchema),
});
export type SeasonalityListResponse = z.infer<
  typeof SeasonalityListResponseSchema
>;
