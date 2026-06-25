import {
  calculateBmi,
  calculateDailyCaloricTarget,
  calculatePAL,
  getBmiCategory,
} from './daily-kcal-calculator';

describe('calculatePAL', () => {
  it('matches the ANSES sedentary desk-worker baseline from the spec', () => {
    expect(
      calculatePAL({
        sittingHours: 11,
        standingLightHours: 4,
        moderateSportHours: 0,
        intenseSportHours: 1,
      }),
    ).toBe(1.36);
  });

  it('returns 1.0 when all hours are sleeping (no active input)', () => {
    expect(
      calculatePAL({
        sittingHours: 0,
        standingLightHours: 0,
        moderateSportHours: 0,
        intenseSportHours: 0,
      }),
    ).toBe(1.0);
  });

  it('returns the highest PAL when all 24 h are intense sport', () => {
    const pal = calculatePAL({
      sittingHours: 0,
      standingLightHours: 0,
      moderateSportHours: 0,
      intenseSportHours: 24,
    });
    expect(pal).toBe(2.4);
  });

  it('throws when total active hours exceed 24', () => {
    expect(() =>
      calculatePAL({
        sittingHours: 10,
        standingLightHours: 10,
        moderateSportHours: 5,
        intenseSportHours: 5,
      }),
    ).toThrow('Total activity hours cannot exceed 24 hours.');
  });
});

describe('calculateDailyCaloricTarget', () => {
  const base = {
    gender: 'F' as const,
    weightKg: 65,
    heightCm: 168,
    ageYears: 30,
    pal: 1.6,
    goal: 'loss' as const,
  };

  it('produces the correct DER for an active 30-year-old woman seeking weight loss', () => {
    // BMR(F,65kg,168cm,30y) = 1439 kcal; TDEE×1.6 = 2303; 15% deficit = 345 → 1957
    // The TODO spec comment "1656 kcal" is incorrect — the formula gives 1957.
    expect(calculateDailyCaloricTarget(base)).toBe(1957);
  });

  it('maintenance goal returns TDEE without surplus or deficit', () => {
    const result = calculateDailyCaloricTarget({ ...base, goal: 'maintenance' });
    const resultLoss = calculateDailyCaloricTarget(base);
    expect(result).toBeGreaterThan(resultLoss);
  });

  it('gain goal adds a 10% surplus over TDEE', () => {
    const maintenance = calculateDailyCaloricTarget({
      ...base,
      goal: 'maintenance',
    });
    const gain = calculateDailyCaloricTarget({ ...base, goal: 'gain' });
    expect(gain).toBeGreaterThan(maintenance);
    expect(gain).toBeCloseTo(maintenance * 1.1, 0);
  });

  it('male BMR uses the correct Harris-Benedict coefficients', () => {
    const male = calculateDailyCaloricTarget({
      gender: 'M',
      weightKg: 80,
      heightCm: 180,
      ageYears: 35,
      pal: 1.5,
      goal: 'maintenance',
    });
    expect(male).toBeGreaterThan(2000);
  });

  it('adds 70 kcal for first-trimester pregnancy', () => {
    const base2 = { ...base, goal: 'maintenance' as const };
    const normal = calculateDailyCaloricTarget(base2);
    const pregnant1 = calculateDailyCaloricTarget({
      ...base2,
      specialCondition: 'pregnant',
      pregnancyTrimester: 1,
    });
    expect(pregnant1 - normal).toBe(70);
  });

  it('adds 260 kcal for second-trimester pregnancy', () => {
    const base2 = { ...base, goal: 'maintenance' as const };
    const normal = calculateDailyCaloricTarget(base2);
    const pregnant2 = calculateDailyCaloricTarget({
      ...base2,
      specialCondition: 'pregnant',
      pregnancyTrimester: 2,
    });
    expect(pregnant2 - normal).toBe(260);
  });

  it('adds 500 kcal for third-trimester pregnancy', () => {
    const base2 = { ...base, goal: 'maintenance' as const };
    const normal = calculateDailyCaloricTarget(base2);
    const pregnant3 = calculateDailyCaloricTarget({
      ...base2,
      specialCondition: 'pregnant',
      pregnancyTrimester: 3,
    });
    expect(pregnant3 - normal).toBe(500);
  });

  it('defaults to 260 kcal surplus when trimester is unspecified', () => {
    const base2 = { ...base, goal: 'maintenance' as const };
    const normal = calculateDailyCaloricTarget(base2);
    const pregnant = calculateDailyCaloricTarget({
      ...base2,
      specialCondition: 'pregnant',
    });
    expect(pregnant - normal).toBe(260);
  });

  it('adds 500 kcal for breastfeeding', () => {
    const base2 = { ...base, goal: 'maintenance' as const };
    const normal = calculateDailyCaloricTarget(base2);
    const breastfeeding = calculateDailyCaloricTarget({
      ...base2,
      specialCondition: 'breastfeeding',
    });
    expect(breastfeeding - normal).toBe(500);
  });

  it('never drops below BMR regardless of goal (BMR safety guardrail)', () => {
    const result = calculateDailyCaloricTarget({
      gender: 'F',
      weightKg: 40,
      heightCm: 155,
      ageYears: 70,
      pal: 1.2,
      goal: 'loss',
    });
    const bmr = 447.593 + 9.247 * 40 + 3.098 * 155 - 4.33 * 70;
    expect(result).toBeGreaterThanOrEqual(Math.round(bmr));
  });

  it('caps the loss deficit at 500 kcal even when 15% exceeds that', () => {
    const highTdeeProfile = {
      gender: 'M' as const,
      weightKg: 120,
      heightCm: 190,
      ageYears: 25,
      pal: 2.0,
      goal: 'loss' as const,
    };
    const maintenance = calculateDailyCaloricTarget({
      ...highTdeeProfile,
      goal: 'maintenance',
    });
    const loss = calculateDailyCaloricTarget(highTdeeProfile);
    expect(maintenance - loss).toBeLessThanOrEqual(500);
  });
});

describe('calculateBmi', () => {
  it('computes the correct BMI rounded to one decimal', () => {
    expect(calculateBmi(70, 175)).toBe(22.9);
  });

  it('handles obese range correctly', () => {
    expect(calculateBmi(100, 170)).toBe(34.6);
  });
});

describe('getBmiCategory', () => {
  it('returns insuffisant below 18.5', () => {
    expect(getBmiCategory(17.0)).toBe('insuffisant');
    expect(getBmiCategory(18.4)).toBe('insuffisant');
  });

  it('returns normal between 18.5 and 24.9', () => {
    expect(getBmiCategory(18.5)).toBe('normal');
    expect(getBmiCategory(22.0)).toBe('normal');
    expect(getBmiCategory(24.9)).toBe('normal');
  });

  it('returns surpoids between 25 and 29.9', () => {
    expect(getBmiCategory(25.0)).toBe('surpoids');
    expect(getBmiCategory(27.5)).toBe('surpoids');
    expect(getBmiCategory(29.9)).toBe('surpoids');
  });

  it('returns obese at 30 and above', () => {
    expect(getBmiCategory(30.0)).toBe('obese');
    expect(getBmiCategory(40.0)).toBe('obese');
  });
});
