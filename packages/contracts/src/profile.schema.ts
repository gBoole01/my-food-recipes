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

// --- Household / member profile persistence (EP1.5) ---
// Distinct from UserProfileSchema above: that schema is the ephemeral,
// single-subject shape used by the legacy chat extraction flow. The schemas
// below model the persisted domain: one household (shared kitchen, currently
// app-wide singleton) containing multiple member profiles (individual diet
// goals/allergens/exclusions).

export const PrimaryGoalSchema = z.enum([
  'perte_de_poids',
  'stabilisation',
  'prise_de_masse',
  'sante_cardio',
]);
export type PrimaryGoal = z.infer<typeof PrimaryGoalSchema>;

export const MemberInputSchema = z.object({
  name: z.string().min(1),
  primaryGoal: PrimaryGoalSchema,
  dailyCaloriesTarget: z.number().int().positive(),
  maxSodiumMg: z.number().int().positive(),
  consumptionTrackingEnabled: z.boolean().optional().default(true),
  allergens: z.array(z.string()).optional().default([]),
  excludedIngredients: z.array(z.string()).optional().default([]),
});
export type MemberInput = z.infer<typeof MemberInputSchema>;

export const MemberUpdateRequestSchema = MemberInputSchema.partial();
export type MemberUpdateRequest = z.infer<typeof MemberUpdateRequestSchema>;

export const HouseholdRegistrationRequestSchema = z.object({
  equipment: z.array(z.string()).optional().default([]),
  pantryStaples: z.array(z.string()).optional().default([]),
  members: z.array(MemberInputSchema).min(1),
});
export type HouseholdRegistrationRequest = z.infer<
  typeof HouseholdRegistrationRequestSchema
>;

export const MemberProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  primaryGoal: PrimaryGoalSchema,
  dailyCaloriesTarget: z.number().int(),
  maxSodiumMg: z.number().int(),
  consumptionTrackingEnabled: z.boolean(),
  allergens: z.array(z.string()),
  excludedIngredients: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type MemberProfile = z.infer<typeof MemberProfileSchema>;

export const HouseholdSchema = z.object({
  id: z.string(),
  equipment: z.array(z.string()),
  pantryStaples: z.array(z.string()),
  members: z.array(MemberProfileSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Household = z.infer<typeof HouseholdSchema>;

// --- Granular profile patches (EP1.6) ---
// Scoped to match the household/member split above rather than a flat
// user_id model: equipment/pantry are household-level (singleton), while
// restrictions are member-level since allergies are personal.

export const EquipmentPatchRequestSchema = z.object({
  equipment: z.array(z.string()),
});
export type EquipmentPatchRequest = z.infer<typeof EquipmentPatchRequestSchema>;

export const PantryPatchRequestSchema = z.object({
  pantryStaples: z.array(z.string()),
});
export type PantryPatchRequest = z.infer<typeof PantryPatchRequestSchema>;

export const RestrictionsPatchRequestSchema = z.object({
  allergens: z.array(z.string()).optional(),
  excludedIngredients: z.array(z.string()).optional(),
});
export type RestrictionsPatchRequest = z.infer<
  typeof RestrictionsPatchRequestSchema
>;
