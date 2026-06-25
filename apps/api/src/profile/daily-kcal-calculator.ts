export type Gender = 'M' | 'F';
export type Goal = 'loss' | 'maintenance' | 'gain';
export type SpecialCondition = 'pregnant' | 'breastfeeding';
export type BmiCategory = 'insuffisant' | 'normal' | 'surpoids' | 'obese';

export interface TimeBudgetInput {
  sittingHours: number;
  standingLightHours: number;
  moderateSportHours: number;
  intenseSportHours: number;
}

export interface DerInput {
  gender: Gender;
  weightKg: number;
  heightCm: number;
  ageYears: number;
  pal: number;
  goal: Goal;
  specialCondition?: SpecialCondition;
  pregnancyTrimester?: 1 | 2 | 3;
}

export function calculatePAL(input: TimeBudgetInput): number {
  const { sittingHours, standingLightHours, moderateSportHours, intenseSportHours } =
    input;

  const activeHours =
    sittingHours + standingLightHours + moderateSportHours + intenseSportHours;

  if (activeHours > 24) {
    throw new Error('Total activity hours cannot exceed 24 hours.');
  }

  const sleepingHours = 24 - activeHours;

  const totalWeightedScores =
    sleepingHours * 1.0 +
    sittingHours * 1.4 +
    standingLightHours * 1.7 +
    moderateSportHours * 2.0 +
    intenseSportHours * 2.4;

  return Math.round((totalWeightedScores / 24) * 100) / 100;
}

export function calculateDailyCaloricTarget(input: DerInput): number {
  const {
    gender,
    weightKg,
    heightCm,
    ageYears,
    pal,
    goal,
    specialCondition,
    pregnancyTrimester,
  } = input;

  let bmr: number;
  if (gender === 'M') {
    bmr = 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * ageYears;
  } else {
    bmr = 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * ageYears;
  }

  let tdee = bmr * pal;

  if (specialCondition === 'pregnant') {
    switch (pregnancyTrimester) {
      case 1:
        tdee += 70;
        break;
      case 2:
        tdee += 260;
        break;
      case 3:
        tdee += 500;
        break;
      default:
        tdee += 260;
    }
  } else if (specialCondition === 'breastfeeding') {
    tdee += 500;
  }

  let targetCalories = tdee;
  if (goal === 'loss') {
    const deficit = Math.min(tdee * 0.15, 500);
    targetCalories = tdee - deficit;
  } else if (goal === 'gain') {
    targetCalories = tdee + tdee * 0.1;
  }

  if (targetCalories < bmr) {
    targetCalories = bmr;
  }

  return Math.round(targetCalories);
}

export function calculateBmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return 'insuffisant';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'surpoids';
  return 'obese';
}
