import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Recipe } from '../recipes/recipe.entity';
import { RecipeIngredient } from '../recipes/recipe-ingredient.entity';
import { UserPlanning } from './user-planning.entity';

const HISTORY_DAYS = 3;
const MAX_MAIN_INGREDIENT_OCCURRENCES = 2;

@Injectable()
export class AntiRedundancyService {
  constructor(
    @InjectRepository(UserPlanning)
    private readonly planningRepository: Repository<UserPlanning>,
    @InjectRepository(RecipeIngredient)
    private readonly ingredientRepository: Repository<RecipeIngredient>,
  ) {}

  async findRedundantIds(
    householdId: string,
    candidates: Recipe[],
    inBatchRecipeIds: string[],
  ): Promise<Set<string>> {
    const since = new Date();
    since.setDate(since.getDate() - HISTORY_DAYS);
    const sinceStr = since.toISOString().slice(0, 10);

    const historyRows = await this.planningRepository
      .createQueryBuilder('up')
      .select('up.recipe_id', 'recipeId')
      .where('up.household_id = :householdId', { householdId })
      .andWhere('up.date_repas >= :since', { since: sinceStr })
      .getRawMany<{ recipeId: string }>();

    const consumedIds = [
      ...historyRows.map((r) => r.recipeId),
      ...inBatchRecipeIds,
    ];

    const ingredientCounts = new Map<string, number>();

    if (consumedIds.length > 0) {
      const mainIngredients = await this.ingredientRepository.find({
        where: { recipeId: In(consumedIds), position: 0 },
        select: ['recipeId', 'name'],
      });

      for (const ing of mainIngredients) {
        ingredientCounts.set(
          ing.name,
          (ingredientCounts.get(ing.name) ?? 0) + 1,
        );
      }
    }

    const redundantIds = new Set<string>();

    for (const recipe of candidates) {
      const mainIngredient = recipe.ingredients
        .filter((i) => i.position === 0)
        .sort((a, b) => a.name.localeCompare(b.name))[0];

      if (!mainIngredient) continue;

      const existingCount = ingredientCounts.get(mainIngredient.name) ?? 0;
      if (existingCount >= MAX_MAIN_INGREDIENT_OCCURRENCES) {
        redundantIds.add(recipe.id);
      }
    }

    return redundantIds;
  }
}
