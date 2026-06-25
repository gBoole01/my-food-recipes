import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FilteredCatalog } from '@my-food-recipes/contracts';
import { HouseholdEquipment } from '../profile/household-equipment.entity';
import { MemberAllergen } from '../profile/member-allergen.entity';
import { MemberExcludedIngredient } from '../profile/member-excluded-ingredient.entity';
import { MemberProfile } from '../profile/member-profile.entity';
import { RecipeFeedback } from '../profile/recipe-feedback.entity';
import { Recipe } from '../recipes/recipe.entity';
import { AntiRedundancyService } from './anti-redundancy.service';

type Diet = MemberProfile['diet'];

const DIET_COMPATIBLE_TAGS: Record<Diet, string[]> = {
  omnivore: [],
  vegetarien: ['vegetarien', 'vegetalien'],
  vegetalien: ['vegetalien'],
  pescetarien: ['pescetarien', 'vegetarien', 'vegetalien'],
  flexitarien: [],
};

const DISLIKE_WARNING_MESSAGE =
  "Avertissement : certaines préférences de recettes ont été assouplies pour proposer des résultats disponibles.";

@Injectable()
export class RecipeFilterService {
  constructor(
    @InjectRepository(MemberProfile)
    private readonly memberRepository: Repository<MemberProfile>,
    @InjectRepository(MemberAllergen)
    private readonly allergenRepository: Repository<MemberAllergen>,
    @InjectRepository(MemberExcludedIngredient)
    private readonly excludedRepository: Repository<MemberExcludedIngredient>,
    @InjectRepository(HouseholdEquipment)
    private readonly equipmentRepository: Repository<HouseholdEquipment>,
    @InjectRepository(RecipeFeedback)
    private readonly feedbackRepository: Repository<RecipeFeedback>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    private readonly antiRedundancyService: AntiRedundancyService,
  ) {}

  async filter(
    memberId: string,
    inBatchRecipeIds: string[],
  ): Promise<FilteredCatalog> {
    const member = await this.memberRepository.findOne({
      where: { id: memberId },
    });
    if (!member) throw new NotFoundException(`Member ${memberId} not found`);

    const [allergenRows, excludedRows, equipmentRows, dislikeRows, allRecipes] =
      await Promise.all([
        this.allergenRepository.find({ where: { memberId } }),
        this.excludedRepository.find({ where: { memberId } }),
        this.equipmentRepository.find({
          where: { householdId: member.householdId },
        }),
        this.feedbackRepository.find({
          where: { memberId, vote: 'dislike' },
          select: ['recipeId'],
        }),
        this.recipeRepository.find({
          where: { status: 'published' },
          relations: ['ingredients'],
        }),
      ]);

    const allergenSet = new Set(allergenRows.map((a) => a.allergen));
    const excludedSet = new Set(excludedRows.map((e) => e.ingredientName));
    const equipmentSet = new Set(equipmentRows.map((e) => e.equipmentName));
    const dislikedIds = new Set(dislikeRows.map((f) => f.recipeId));

    const l1 = allRecipes.filter((r) =>
      passesHardFilters(r, member.diet, allergenSet, excludedSet, equipmentSet),
    );

    if (l1.length === 0) {
      return { recipes: [], warning: false, layersApplied: 1 };
    }

    const redundantIds = await this.antiRedundancyService.findRedundantIds(
      member.householdId,
      l1,
      inBatchRecipeIds,
    );

    const l2 = l1.filter((r) => !redundantIds.has(r.id));
    const workingCatalog = l2.length === 0 ? l1 : l2;
    const layersAfterAntiRedundancy = l2.length === 0 ? 1 : 2;

    const l3 = workingCatalog.filter((r) => !dislikedIds.has(r.id));

    if (l3.length === 0) {
      return {
        recipes: workingCatalog.map(toRecipeInput),
        warning: true,
        warningMessage: DISLIKE_WARNING_MESSAGE,
        layersApplied: layersAfterAntiRedundancy,
      };
    }

    return {
      recipes: l3.map(toRecipeInput),
      warning: false,
      layersApplied: 3,
    };
  }
}

function passesHardFilters(
  recipe: Recipe,
  diet: Diet,
  allergenSet: Set<string>,
  excludedSet: Set<string>,
  equipmentSet: Set<string>,
): boolean {
  if (recipe.allergens.some((a) => allergenSet.has(a))) return false;

  if (recipe.ingredients.some((i) => excludedSet.has(i.name))) return false;

  if (!recipe.requiredAppliances.every((a) => equipmentSet.has(a))) return false;

  const requiredTags = DIET_COMPATIBLE_TAGS[diet];
  if (
    requiredTags.length > 0 &&
    !requiredTags.some((tag) => recipe.dietTags.includes(tag))
  ) {
    return false;
  }

  return true;
}

function toRecipeInput(recipe: Recipe) {
  return {
    id: recipe.id,
    name: recipe.name,
    servings: recipe.servings,
    dietTags: recipe.dietTags,
    allergens: recipe.allergens,
    requiredAppliances: recipe.requiredAppliances,
    prepTimeMinutes: recipe.prepTimeMinutes,
    cookTimeMinutes: recipe.cookTimeMinutes,
    nutrition: {
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
    },
    ingredients: [...recipe.ingredients]
      .sort((a, b) => a.position - b.position)
      .map((i) => ({
        name: i.name,
        quantity: i.quantity,
        unit: i.unit,
        category: i.category,
      })),
    steps: recipe.steps,
  };
}
