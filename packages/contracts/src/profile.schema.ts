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

export const GenderSchema = z.enum(['M', 'F']);
export type Gender = z.infer<typeof GenderSchema>;

export const BmiCategorySchema = z.enum([
  'insuffisant',
  'normal',
  'surpoids',
  'obese',
]);
export type BmiCategory = z.infer<typeof BmiCategorySchema>;

export const SpecialConditionSchema = z.enum(['pregnant', 'breastfeeding']);
export type SpecialCondition = z.infer<typeof SpecialConditionSchema>;

export const DietSchema = z.enum([
  'omnivore',
  'vegetarien',
  'vegetalien',
  'paleo',
  'sans_gluten',
]);
export type Diet = z.infer<typeof DietSchema>;

export const MemberInputSchema = z.object({
  name: z.string().min(1),
  primaryGoal: PrimaryGoalSchema,
  dailyCaloriesTarget: z.number().int().positive(),
  diet: DietSchema,
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
  diet: DietSchema,
  allergens: z.array(z.string()),
  excludedIngredients: z.array(z.string()),
  gender: GenderSchema.nullish(),
  birthDate: z.string().nullish(),
  weightKg: z.number().nullish(),
  heightCm: z.number().nullish(),
  sittingHours: z.number().nullish(),
  standingLightHours: z.number().nullish(),
  moderateSportHours: z.number().nullish(),
  intenseSportHours: z.number().nullish(),
  specialCondition: SpecialConditionSchema.nullish(),
  pregnancyTrimester: z.union([z.literal(1), z.literal(2), z.literal(3)]).nullish(),
  bmi: z.number().nullish(),
  bmiCategory: BmiCategorySchema.nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type MemberProfile = z.infer<typeof MemberProfileSchema>;

export const EnergyInputSchema = z
  .object({
    gender: GenderSchema,
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    weightKg: z.number().positive(),
    heightCm: z.number().positive(),
    sittingHours: z.number().min(0),
    standingLightHours: z.number().min(0),
    moderateSportHours: z.number().min(0),
    intenseSportHours: z.number().min(0),
    specialCondition: SpecialConditionSchema.optional(),
    pregnancyTrimester: z
      .union([z.literal(1), z.literal(2), z.literal(3)])
      .optional(),
  })
  .refine(
    (d) =>
      d.sittingHours +
        d.standingLightHours +
        d.moderateSportHours +
        d.intenseSportHours <=
      24,
    { message: 'Total activity hours cannot exceed 24 hours.' },
  )
  .refine(
    (d) => d.specialCondition !== 'pregnant' || d.pregnancyTrimester != null,
    { message: 'pregnancyTrimester is required when specialCondition is pregnant.', path: ['pregnancyTrimester'] },
  );
export type EnergyInput = z.infer<typeof EnergyInputSchema>;

export const EnergyResponseSchema = z.object({
  dailyCaloriesTarget: z.number().int(),
  pal: z.number(),
  bmi: z.number(),
  bmiCategory: BmiCategorySchema,
});
export type EnergyResponse = z.infer<typeof EnergyResponseSchema>;

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
