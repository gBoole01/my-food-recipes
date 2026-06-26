export interface MacroTargets {
  proteinGrams: number;
  fatGrams: number;
  carbGrams: number;
}

export interface MicronutrientTargets {
  fiberG: number;
  ironMg: number;
  calciumMg: number;
  magnesiumMg: number;
  vitaminCMg: number;
}

export interface GlycemicLoadResult {
  gl: number;
  level: 'low' | 'moderate' | 'high';
}

export interface CalorieDistribution {
  breakfast: number;
  lunch: number;
  dinner: number;
  snack: number;
}

export interface WeeklyConstraints {
  minFattyFishMeals: number;
  maxDailyGlycemicLoad: number;
  maxOmegaRatio: number;
}

export interface NutritionalTargets {
  macros: MacroTargets;
  micros: MicronutrientTargets;
  calorieDistribution: CalorieDistribution;
  weeklyConstraints: WeeklyConstraints;
}

const DEFAULT_WEIGHT_KG = 70;

export function calculateMacroTargets(
  calories: number,
  weightKg: number,
  isSportProfile: boolean,
): MacroTargets {
  const weight = weightKg > 0 ? weightKg : DEFAULT_WEIGHT_KG;

  let proteinCalories: number;
  if (isSportProfile) {
    proteinCalories = weight * 1.6 * 4;
  } else {
    proteinCalories = calories * 0.15;
  }

  const fatCalories = calories * 0.35;
  const carbCalories = calories - proteinCalories - fatCalories;

  return {
    proteinGrams: Math.round(proteinCalories / 4),
    fatGrams: Math.round(fatCalories / 9),
    carbGrams: Math.max(0, Math.round(carbCalories / 4)),
  };
}

export function calculateGlycemicLoad(
  glycemicIndex: number,
  netCarbsG: number,
): GlycemicLoadResult {
  const gl = Math.round((glycemicIndex * netCarbsG) / 100);

  let level: GlycemicLoadResult['level'];
  if (gl <= 10) {
    level = 'low';
  } else if (gl <= 19) {
    level = 'moderate';
  } else {
    level = 'high';
  }

  return { gl, level };
}

export function calculateOmegaRatio(omega6G: number, omega3G: number): number {
  if (omega3G <= 0) return Infinity;
  return Math.round((omega6G / omega3G) * 10) / 10;
}

export function checkSaturatedFatLimit(
  saturatedFatG: number,
  totalCalories: number,
): boolean {
  if (totalCalories <= 0) return true;
  const saturatedFatCalories = saturatedFatG * 9;
  return saturatedFatCalories / totalCalories < 0.08;
}

// Molar masses: Na = 22.99 g/mol, K = 39.10 g/mol
// Molar ratio = (sodiumMg / 22.99) / (potassiumMg / 39.10)
export function checkSodiumPotassiumRatio(
  sodiumMg: number,
  potassiumMg: number,
): boolean {
  if (potassiumMg <= 0) return false;
  const molarRatio = (sodiumMg / 22.99) / (potassiumMg / 39.1);
  return molarRatio < 1;
}

export function distributeCaloriesByMeal(
  dailyCalories: number,
): CalorieDistribution {
  const breakfast = Math.round(dailyCalories * 0.225);
  const lunch = Math.round(dailyCalories * 0.375);
  const snack = Math.round(dailyCalories * 0.1);
  const dinner = dailyCalories - breakfast - lunch - snack;

  return { breakfast, lunch, dinner, snack };
}
