import { z } from 'zod';
import { UserProfileSchema } from './profile.schema';

export const RecipesRequestSchema = z.object({
  profile: UserProfileSchema,
});

export type RecipesRequest = z.infer<typeof RecipesRequestSchema>;
