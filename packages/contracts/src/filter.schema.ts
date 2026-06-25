import { z } from 'zod';
import { RecipeSchema } from './recipe.schema';

export const FilteredCatalogSchema = z.object({
  recipes: z.array(RecipeSchema),
  warning: z.boolean(),
  warningMessage: z.string().optional(),
  layersApplied: z.number().int().min(1).max(3),
});

export type FilteredCatalog = z.infer<typeof FilteredCatalogSchema>;
