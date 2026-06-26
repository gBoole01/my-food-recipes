import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import type { NutritionalTargets } from '@my-food-recipes/contracts';
import { MemberProfile } from '../profile/member-profile.entity';
import {
  MicronutrientTargets,
  calculateMacroTargets,
  distributeCaloriesByMeal,
} from './nutrition-calculator';
import { MicronutrientTarget } from './micronutrient-target.entity';

const WEEKLY_CONSTRAINTS = {
  minFattyFishMeals: 2,
  maxDailyGlycemicLoad: 120,
  maxOmegaRatio: 5,
} as const;

@Injectable()
export class NutritionCalculatorService {
  constructor(
    @InjectRepository(MemberProfile)
    private readonly memberRepository: Repository<MemberProfile>,
    @InjectRepository(MicronutrientTarget)
    private readonly micronutrientTargetRepository: Repository<MicronutrientTarget>,
  ) {}

  async getFullNutritionalTargets(memberId: string): Promise<NutritionalTargets> {
    const member = await this.memberRepository.findOne({
      where: { id: memberId },
    });
    if (!member) {
      throw new NotFoundException(`Member ${memberId} not found`);
    }

    const macros = this.getMacroTargets(member);
    const micros = await this.getMicronutrientTargets(member);
    const calorieDistribution = distributeCaloriesByMeal(member.dailyCaloriesTarget);

    return {
      macros,
      micros,
      calorieDistribution,
      weeklyConstraints: { ...WEEKLY_CONSTRAINTS },
    };
  }

  getMacroTargets(member: MemberProfile): ReturnType<typeof calculateMacroTargets> {
    const isSportProfile = member.primaryGoal === 'prise_de_masse';
    return calculateMacroTargets(
      member.dailyCaloriesTarget,
      member.weightKg ?? 0,
      isSportProfile,
    );
  }

  async getMicronutrientTargets(member: MemberProfile): Promise<MicronutrientTargets> {
    const ageYears = member.birthDate != null ? deriveAge(member.birthDate) : null;
    const gender = member.gender ?? 'any';
    const specialCondition = member.specialCondition ?? null;

    const row = await this.resolveTargetRow(gender, ageYears, specialCondition);

    return {
      fiberG: row.fiberG,
      ironMg: row.ironMg,
      calciumMg: row.calciumMg,
      magnesiumMg: row.magnesiumMg,
      vitaminCMg: row.vitaminCMg,
    };
  }

  private async resolveTargetRow(
    gender: string,
    ageYears: number | null,
    specialCondition: string | null,
  ): Promise<MicronutrientTarget> {
    const age = ageYears ?? 30;

    const candidates = await this.micronutrientTargetRepository.find({
      where: [
        {
          gender: gender as 'M' | 'F' | 'any',
          ageMin: LessThanOrEqual(age),
          ageMax: MoreThanOrEqual(age),
          specialCondition: specialCondition ?? undefined,
        },
        {
          gender: 'any',
          ageMin: LessThanOrEqual(age),
          ageMax: MoreThanOrEqual(age),
          specialCondition: specialCondition ?? undefined,
        },
      ],
    });

    // Prefer exact gender match over 'any', prefer special condition match
    const sorted = candidates.sort((a, b) => {
      const aScore =
        (a.gender === gender ? 2 : 0) +
        (a.specialCondition === specialCondition ? 1 : 0);
      const bScore =
        (b.gender === gender ? 2 : 0) +
        (b.specialCondition === specialCondition ? 1 : 0);
      return bScore - aScore;
    });

    if (sorted[0]) return sorted[0];

    // Absolute fallback — should not happen after seeding
    return {
      id: '',
      gender: 'any',
      ageMin: 0,
      ageMax: 999,
      specialCondition: null,
      fiberG: 30,
      ironMg: 11,
      calciumMg: 950,
      magnesiumMg: 300,
      vitaminCMg: 110,
    };
  }
}

function deriveAge(birthDate: string): number {
  const birth = new Date(birthDate + 'T00:00:00');
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
