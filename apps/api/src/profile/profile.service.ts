import {
  EnergyInput,
  EnergyResponse as EnergyResponseDto,
  EquipmentPatchRequest,
  Household as HouseholdDto,
  HouseholdRegistrationRequest,
  MemberInput,
  MemberProfile as MemberProfileDto,
  MemberUpdateRequest,
  PantryPatchRequest,
  RecipeFeedback as RecipeFeedbackDto,
  RecipeFeedbackRequest,
  RestrictionsPatchRequest,
} from '@my-food-recipes/contracts';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Recipe } from '../recipes/recipe.entity';
import {
  BmiCategory,
  Goal,
  SpecialCondition,
  calculateBmi,
  calculateDailyCaloricTarget,
  calculatePAL,
  getBmiCategory,
} from './daily-kcal-calculator';
import { HouseholdEquipment } from './household-equipment.entity';
import { HouseholdPantryStaple } from './household-pantry-staple.entity';
import { Household } from './household.entity';
import { MemberAllergen } from './member-allergen.entity';
import { MemberExcludedIngredient } from './member-excluded-ingredient.entity';
import { MemberProfile, PrimaryGoal } from './member-profile.entity';
import { RecipeFeedback } from './recipe-feedback.entity';

@Injectable()
export class ProfileService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Household)
    private readonly householdRepository: Repository<Household>,
    @InjectRepository(MemberProfile)
    private readonly memberRepository: Repository<MemberProfile>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(RecipeFeedback)
    private readonly recipeFeedbackRepository: Repository<RecipeFeedback>,
  ) {}

  async registerHousehold(
    input: HouseholdRegistrationRequest,
  ): Promise<HouseholdDto> {
    const existing = await this.householdRepository.find({ take: 1 });
    if (existing.length > 0) {
      throw new ConflictException('A household is already registered');
    }

    const householdId = await this.dataSource.transaction(async (manager) => {
      const household = await manager.save(
        Household,
        manager.create(Household, {}),
      );

      if (input.equipment.length > 0) {
        await manager.save(
          HouseholdEquipment,
          input.equipment.map((equipmentName) =>
            manager.create(HouseholdEquipment, {
              householdId: household.id,
              equipmentName,
            }),
          ),
        );
      }

      if (input.pantryStaples.length > 0) {
        await manager.save(
          HouseholdPantryStaple,
          input.pantryStaples.map((ingredientName) =>
            manager.create(HouseholdPantryStaple, {
              householdId: household.id,
              ingredientName,
            }),
          ),
        );
      }

      for (const member of input.members) {
        await this.createMember(manager, household.id, member);
      }

      return household.id;
    });

    return this.getHousehold(householdId);
  }

  async getHousehold(householdId?: string): Promise<HouseholdDto> {
    const households = await this.householdRepository.find({
      where: householdId ? { id: householdId } : {},
      relations: {
        equipment: true,
        pantryStaples: true,
        members: { allergens: true, excludedIngredients: true },
      },
      take: 1,
    });

    const household = households[0];
    if (!household) {
      throw new NotFoundException('No household has been registered yet');
    }

    return toHouseholdResponse(household);
  }

  async addMember(input: MemberInput): Promise<MemberProfileDto> {
    const household = await this.getHouseholdEntity();

    const memberId = await this.dataSource.transaction(async (manager) => {
      const member = await this.createMember(manager, household.id, input);
      return member.id;
    });

    return this.getMember(memberId);
  }

  async updateMember(
    memberId: string,
    input: MemberUpdateRequest,
  ): Promise<MemberProfileDto> {
    await this.getMemberEntity(memberId);

    await this.dataSource.transaction(async (manager) => {
      const { allergens, excludedIngredients, ...fields } = input;

      if (Object.keys(fields).length > 0) {
        await manager.update(MemberProfile, memberId, fields);
      }

      if (allergens !== undefined) {
        await manager.delete(MemberAllergen, { memberId });
        if (allergens.length > 0) {
          await manager.save(
            MemberAllergen,
            allergens.map((allergen) =>
              manager.create(MemberAllergen, { memberId, allergen }),
            ),
          );
        }
      }

      if (excludedIngredients !== undefined) {
        await manager.delete(MemberExcludedIngredient, { memberId });
        if (excludedIngredients.length > 0) {
          await manager.save(
            MemberExcludedIngredient,
            excludedIngredients.map((ingredientName) =>
              manager.create(MemberExcludedIngredient, {
                memberId,
                ingredientName,
              }),
            ),
          );
        }
      }
    });

    return this.getMember(memberId);
  }

  async removeMember(memberId: string): Promise<void> {
    const result = await this.memberRepository.delete(memberId);
    if (!result.affected) {
      throw new NotFoundException(`Member ${memberId} not found`);
    }
  }

  async updateEquipment(input: EquipmentPatchRequest): Promise<HouseholdDto> {
    const household = await this.getHouseholdEntity();

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(HouseholdEquipment, { householdId: household.id });
      if (input.equipment.length > 0) {
        await manager.save(
          HouseholdEquipment,
          input.equipment.map((equipmentName) =>
            manager.create(HouseholdEquipment, {
              householdId: household.id,
              equipmentName,
            }),
          ),
        );
      }
    });

    return this.getHousehold(household.id);
  }

  async updatePantry(input: PantryPatchRequest): Promise<HouseholdDto> {
    const household = await this.getHouseholdEntity();

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(HouseholdPantryStaple, {
        householdId: household.id,
      });
      if (input.pantryStaples.length > 0) {
        await manager.save(
          HouseholdPantryStaple,
          input.pantryStaples.map((ingredientName) =>
            manager.create(HouseholdPantryStaple, {
              householdId: household.id,
              ingredientName,
            }),
          ),
        );
      }
    });

    return this.getHousehold(household.id);
  }

  async updateRestrictions(
    memberId: string,
    input: RestrictionsPatchRequest,
  ): Promise<MemberProfileDto> {
    await this.getMemberEntity(memberId);

    await this.dataSource.transaction(async (manager) => {
      const { allergens, excludedIngredients } = input;

      if (allergens !== undefined) {
        await manager.delete(MemberAllergen, { memberId });
        if (allergens.length > 0) {
          await manager.save(
            MemberAllergen,
            allergens.map((allergen) =>
              manager.create(MemberAllergen, { memberId, allergen }),
            ),
          );
        }
      }

      if (excludedIngredients !== undefined) {
        await manager.delete(MemberExcludedIngredient, { memberId });
        if (excludedIngredients.length > 0) {
          await manager.save(
            MemberExcludedIngredient,
            excludedIngredients.map((ingredientName) =>
              manager.create(MemberExcludedIngredient, {
                memberId,
                ingredientName,
              }),
            ),
          );
        }
      }
    });

    return this.getMember(memberId);
  }

  async recordFeedback(
    memberId: string,
    input: RecipeFeedbackRequest,
  ): Promise<RecipeFeedbackDto> {
    await this.getMemberEntity(memberId);

    const recipe = await this.recipeRepository.findOne({
      where: { id: input.recipeId },
    });
    if (!recipe) {
      throw new NotFoundException(`Recipe ${input.recipeId} not found`);
    }

    await this.recipeFeedbackRepository.upsert(
      { memberId, recipeId: input.recipeId, vote: input.vote },
      ['memberId', 'recipeId'],
    );

    const feedback = await this.recipeFeedbackRepository.findOneOrFail({
      where: { memberId, recipeId: input.recipeId },
    });
    return toFeedbackResponse(feedback);
  }

  async updateMemberEnergy(
    memberId: string,
    input: EnergyInput,
  ): Promise<EnergyResponseDto> {
    const member = await this.getMemberEntity(memberId);

    const pal = calculatePAL({
      sittingHours: input.sittingHours,
      standingLightHours: input.standingLightHours,
      moderateSportHours: input.moderateSportHours,
      intenseSportHours: input.intenseSportHours,
    });

    const birthDate = new Date(input.birthDate + 'T00:00:00');
    const today = new Date();
    let ageYears = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      ageYears--;
    }

    const dailyCaloriesTarget = calculateDailyCaloricTarget({
      gender: input.gender,
      weightKg: input.weightKg,
      heightCm: input.heightCm,
      ageYears,
      pal,
      goal: mapPrimaryGoalToGoal(member.primaryGoal),
      specialCondition: input.specialCondition as SpecialCondition | undefined,
      pregnancyTrimester: input.pregnancyTrimester,
    });

    const bmi = calculateBmi(input.weightKg, input.heightCm);
    const bmiCategory = getBmiCategory(bmi);

    await this.memberRepository.update(memberId, {
      gender: input.gender,
      birthDate: input.birthDate,
      weightKg: input.weightKg,
      heightCm: input.heightCm,
      sittingHours: input.sittingHours,
      standingLightHours: input.standingLightHours,
      moderateSportHours: input.moderateSportHours,
      intenseSportHours: input.intenseSportHours,
      specialCondition: input.specialCondition ?? null,
      pregnancyTrimester: input.pregnancyTrimester ?? null,
      dailyCaloriesTarget,
    });

    return { dailyCaloriesTarget, pal, bmi, bmiCategory };
  }

  private async getHouseholdEntity(): Promise<Household> {
    const households = await this.householdRepository.find({ take: 1 });
    const household = households[0];
    if (!household) {
      throw new NotFoundException('No household has been registered yet');
    }
    return household;
  }

  private async createMember(
    manager: EntityManager,
    householdId: string,
    input: MemberInput,
  ): Promise<MemberProfile> {
    const member = await manager.save(
      MemberProfile,
      manager.create(MemberProfile, {
        householdId,
        name: input.name,
        primaryGoal: input.primaryGoal,
        dailyCaloriesTarget: input.dailyCaloriesTarget,
        diet: input.diet,
        secondaryDiets: input.secondaryDiets ?? [],
      }),
    );

    if (input.allergens.length > 0) {
      await manager.save(
        MemberAllergen,
        input.allergens.map((allergen) =>
          manager.create(MemberAllergen, { memberId: member.id, allergen }),
        ),
      );
    }

    if (input.excludedIngredients.length > 0) {
      await manager.save(
        MemberExcludedIngredient,
        input.excludedIngredients.map((ingredientName) =>
          manager.create(MemberExcludedIngredient, {
            memberId: member.id,
            ingredientName,
          }),
        ),
      );
    }

    return member;
  }

  private async getMemberEntity(memberId: string): Promise<MemberProfile> {
    const member = await this.memberRepository.findOne({
      where: { id: memberId },
      relations: { allergens: true, excludedIngredients: true },
    });
    if (!member) {
      throw new NotFoundException(`Member ${memberId} not found`);
    }
    return member;
  }

  private async getMember(memberId: string): Promise<MemberProfileDto> {
    return toMemberResponse(await this.getMemberEntity(memberId));
  }
}

function toMemberResponse(member: MemberProfile): MemberProfileDto {
  const bmi =
    member.weightKg != null && member.heightCm != null
      ? calculateBmi(member.weightKg, member.heightCm)
      : null;

  return {
    id: member.id,
    name: member.name,
    primaryGoal: member.primaryGoal,
    dailyCaloriesTarget: member.dailyCaloriesTarget,
    diet: member.diet,
    secondaryDiets: member.secondaryDiets ?? [],
    allergens: (member.allergens ?? []).map((a) => a.allergen),
    excludedIngredients: (member.excludedIngredients ?? []).map(
      (e) => e.ingredientName,
    ),
    gender: (member.gender as MemberProfileDto['gender']) ?? null,
    birthDate: member.birthDate ?? null,
    weightKg: member.weightKg ?? null,
    heightCm: member.heightCm ?? null,
    sittingHours: member.sittingHours ?? null,
    standingLightHours: member.standingLightHours ?? null,
    moderateSportHours: member.moderateSportHours ?? null,
    intenseSportHours: member.intenseSportHours ?? null,
    specialCondition:
      (member.specialCondition as MemberProfileDto['specialCondition']) ?? null,
    pregnancyTrimester:
      (member.pregnancyTrimester as MemberProfileDto['pregnancyTrimester']) ??
      null,
    bmi: bmi ?? null,
    bmiCategory: bmi != null ? (getBmiCategory(bmi) as BmiCategory) : null,
    createdAt: member.createdAt.toISOString(),
    updatedAt: member.updatedAt.toISOString(),
  };
}

function toFeedbackResponse(feedback: RecipeFeedback): RecipeFeedbackDto {
  return {
    memberId: feedback.memberId,
    recipeId: feedback.recipeId,
    vote: feedback.vote,
    createdAt: feedback.createdAt.toISOString(),
    updatedAt: feedback.updatedAt.toISOString(),
  };
}

function mapPrimaryGoalToGoal(primaryGoal: PrimaryGoal): Goal {
  switch (primaryGoal) {
    case 'perte_de_poids':
      return 'loss';
    case 'prise_de_masse':
      return 'gain';
    default:
      return 'maintenance';
  }
}

function toHouseholdResponse(household: Household): HouseholdDto {
  return {
    id: household.id,
    equipment: (household.equipment ?? []).map((e) => e.equipmentName),
    pantryStaples: (household.pantryStaples ?? []).map((p) => p.ingredientName),
    members: (household.members ?? []).map(toMemberResponse),
    createdAt: household.createdAt.toISOString(),
    updatedAt: household.updatedAt.toISOString(),
  };
}
