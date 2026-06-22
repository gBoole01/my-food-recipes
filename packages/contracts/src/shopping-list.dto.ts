import { z } from 'zod';

export const ShoppingListRequestSchema = z.object({
  recipeIds: z.array(z.string().min(1)).min(1),
  numberOfPeople: z.number().int().positive(),
});

export type ShoppingListRequest = z.infer<typeof ShoppingListRequestSchema>;
