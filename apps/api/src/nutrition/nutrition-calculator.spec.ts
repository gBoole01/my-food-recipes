import {
  calculateGlycemicLoad,
  calculateMacroTargets,
  calculateOmegaRatio,
  checkSaturatedFatLimit,
  checkSodiumPotassiumRatio,
  distributeCaloriesByMeal,
} from './nutrition-calculator';

describe('calculateMacroTargets', () => {
  it('standard profile: 15% protein, 35% fat, remainder carbs', () => {
    const result = calculateMacroTargets(2000, 70, false);
    // protein: 2000 * 0.15 / 4 = 75g
    // fat: 2000 * 0.35 / 9 = 78g
    // carbs: (2000 - 300 - 700) / 4 = 250g
    expect(result.proteinGrams).toBe(75);
    expect(result.fatGrams).toBe(78);
    expect(result.carbGrams).toBe(250);
  });

  it('sport profile: protein based on 1.6g/kg body weight', () => {
    const result = calculateMacroTargets(2500, 80, true);
    // protein: 80 * 1.6 = 128g
    // fat: 2500 * 0.35 / 9 = 97g
    // carbs: (2500 - 512 - 875) / 4 = 278g
    expect(result.proteinGrams).toBe(128);
    expect(result.fatGrams).toBe(97);
    expect(result.carbGrams).toBe(278);
  });

  it('falls back to 70kg when weightKg is 0', () => {
    const withZero = calculateMacroTargets(2000, 0, true);
    const withDefault = calculateMacroTargets(2000, 70, true);
    expect(withZero.proteinGrams).toBe(withDefault.proteinGrams);
  });

  it('carbGrams never goes negative when protein+fat exceed calories', () => {
    // Very high sport profile with low calories
    const result = calculateMacroTargets(500, 100, true);
    expect(result.carbGrams).toBeGreaterThanOrEqual(0);
  });
});

describe('calculateGlycemicLoad', () => {
  it('classifies as low when GL ≤ 10', () => {
    // GI=50, carbs=18g → GL = 9
    const result = calculateGlycemicLoad(50, 18);
    expect(result.gl).toBe(9);
    expect(result.level).toBe('low');
  });

  it('classifies as moderate when 11 ≤ GL ≤ 19', () => {
    // GI=70, carbs=20g → GL = 14
    const result = calculateGlycemicLoad(70, 20);
    expect(result.gl).toBe(14);
    expect(result.level).toBe('moderate');
  });

  it('classifies as high when GL ≥ 20', () => {
    // GI=85, carbs=50g → GL = 43
    const result = calculateGlycemicLoad(85, 50);
    expect(result.gl).toBe(43);
    expect(result.level).toBe('high');
  });

  it('returns GL=10 as low (boundary)', () => {
    const result = calculateGlycemicLoad(100, 10);
    expect(result.gl).toBe(10);
    expect(result.level).toBe('low');
  });
});

describe('calculateOmegaRatio', () => {
  it('returns the correct ratio rounded to one decimal', () => {
    // linoleic 10g / (ALA 1g + EPA 0.5g + DHA 0.5g) = 10 / 2 = 5.0
    expect(calculateOmegaRatio(10, 2)).toBe(5.0);
  });

  it('returns Infinity when omega-3 is zero', () => {
    expect(calculateOmegaRatio(5, 0)).toBe(Infinity);
  });

  it('returns a ratio below 5 for a well-balanced profile', () => {
    // 8g omega-6, 2.5g omega-3 → 3.2
    expect(calculateOmegaRatio(8, 2.5)).toBe(3.2);
  });
});

describe('checkSaturatedFatLimit', () => {
  it('returns true when saturated fat is below 8% of total energy', () => {
    // 15g sat fat × 9 kcal/g = 135 kcal; 135 / 2000 = 6.75% < 8%
    expect(checkSaturatedFatLimit(15, 2000)).toBe(true);
  });

  it('returns false when saturated fat exceeds 8% of total energy', () => {
    // 25g sat fat × 9 = 225 kcal; 225 / 2000 = 11.25% > 8%
    expect(checkSaturatedFatLimit(25, 2000)).toBe(false);
  });

  it('returns true when totalCalories is 0 (guard against division by zero)', () => {
    expect(checkSaturatedFatLimit(10, 0)).toBe(true);
  });
});

describe('checkSodiumPotassiumRatio', () => {
  it('returns true when molar Na/K ratio is below 1', () => {
    // Na=500mg, K=2000mg → molar: (500/22.99)/(2000/39.1) = 21.75/51.15 ≈ 0.425 < 1
    expect(checkSodiumPotassiumRatio(500, 2000)).toBe(true);
  });

  it('returns false when molar Na/K ratio exceeds 1', () => {
    // Na=3000mg, K=500mg → molar: (3000/22.99)/(500/39.1) = 130.5/12.8 ≈ 10.2 > 1
    expect(checkSodiumPotassiumRatio(3000, 500)).toBe(false);
  });

  it('returns false when potassium is 0', () => {
    expect(checkSodiumPotassiumRatio(100, 0)).toBe(false);
  });
});

describe('distributeCaloriesByMeal', () => {
  it('distributes 2000 kcal across meals summing to 2000', () => {
    const dist = distributeCaloriesByMeal(2000);
    expect(dist.breakfast + dist.lunch + dist.dinner + dist.snack).toBe(2000);
  });

  it('breakfast is ~22.5%, lunch ~37.5%, snack ~10%, dinner is remainder', () => {
    const dist = distributeCaloriesByMeal(2000);
    expect(dist.breakfast).toBe(450);  // 2000 * 0.225
    expect(dist.lunch).toBe(750);      // 2000 * 0.375
    expect(dist.snack).toBe(200);      // 2000 * 0.1
    expect(dist.dinner).toBe(600);     // 2000 - 450 - 750 - 200
  });

  it('handles an odd calorie total without losing kcal (dinner absorbs rounding)', () => {
    const dist = distributeCaloriesByMeal(1857);
    expect(dist.breakfast + dist.lunch + dist.dinner + dist.snack).toBe(1857);
  });
});
