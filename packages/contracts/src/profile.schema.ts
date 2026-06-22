import { z } from 'zod';

// No `.default()` on the array fields: this schema is used both to validate the
// /api/recipes request body AND as the structured-output target for profile extraction
// from the chat history. A default would turn an omitted (not-yet-discussed) field into
// `[]`, indistinguishable from the user having explicitly said "none" — breaking
// completeness/missing-field detection in ConversationService.
export const UserProfileSchema = z.object({
  dietType: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  dislikedFoods: z.array(z.string()).optional(),
  likedFoods: z.array(z.string()).optional(),
  availableAppliances: z.array(z.string()).optional(),
  // .min(1) rather than .positive(): this schema is also sent to Gemini as a
  // structured-output response_schema, and Gemini's schema subset rejects
  // `exclusiveMinimum` (which `.positive()` would emit).
  numberOfPeople: z.number().int().min(1).optional(),
});

export type UserProfileInput = z.infer<typeof UserProfileSchema>;
