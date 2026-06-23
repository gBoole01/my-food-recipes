import { z } from 'zod';

// --- Recipe feedback (EP1.7) ---
// Scoped by member_id, not user_id: per the household/member split (EP1.5),
// a recipe vote is personal to the member who cast it. Upsert semantics on
// (member_id, recipe_id) — voting again overwrites the prior vote, there is
// no append-only history.

export const RecipeFeedbackVoteSchema = z.enum(['like', 'dislike']);
export type RecipeFeedbackVote = z.infer<typeof RecipeFeedbackVoteSchema>;

export const RecipeFeedbackRequestSchema = z.object({
  recipeId: z.string().min(1),
  vote: RecipeFeedbackVoteSchema,
});
export type RecipeFeedbackRequest = z.infer<typeof RecipeFeedbackRequestSchema>;

export const RecipeFeedbackSchema = z.object({
  memberId: z.string(),
  recipeId: z.string(),
  vote: RecipeFeedbackVoteSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type RecipeFeedback = z.infer<typeof RecipeFeedbackSchema>;
