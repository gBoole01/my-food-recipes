import { z } from 'zod';

export const MacroTargetsSchema = z.object({
  proteinGrams: z.number(),
  fatGrams: z.number(),
  carbGrams: z.number(),
});
export type MacroTargets = z.infer<typeof MacroTargetsSchema>;

export const MicronutrientTargetsSchema = z.object({
  fiberG: z.number(),
  ironMg: z.number(),
  calciumMg: z.number(),
  magnesiumMg: z.number(),
  vitaminCMg: z.number(),
});
export type MicronutrientTargets = z.infer<typeof MicronutrientTargetsSchema>;

export const CalorieDistributionSchema = z.object({
  breakfast: z.number().int(),
  lunch: z.number().int(),
  dinner: z.number().int(),
  snack: z.number().int(),
});
export type CalorieDistribution = z.infer<typeof CalorieDistributionSchema>;

export const WeeklyConstraintsSchema = z.object({
  minFattyFishMeals: z.number().int(),
  maxDailyGlycemicLoad: z.number(),
  maxOmegaRatio: z.number(),
});
export type WeeklyConstraints = z.infer<typeof WeeklyConstraintsSchema>;

export const NutritionalTargetsSchema = z.object({
  macros: MacroTargetsSchema,
  micros: MicronutrientTargetsSchema,
  calorieDistribution: CalorieDistributionSchema,
  weeklyConstraints: WeeklyConstraintsSchema,
});
export type NutritionalTargets = z.infer<typeof NutritionalTargetsSchema>;
