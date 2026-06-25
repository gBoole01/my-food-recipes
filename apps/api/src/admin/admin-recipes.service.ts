import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { DataSource, Repository } from 'typeorm';
import type {
  AdminRecipeCreate,
  AdminRecipeResponse,
  AdminRecipeUpdate,
} from '@my-food-recipes/contracts';
import { Recipe } from '../recipes/recipe.entity';
import { RecipeIngredient } from '../recipes/recipe-ingredient.entity';

@Injectable()
export class AdminRecipesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(RecipeIngredient)
    private readonly ingredientRepository: Repository<RecipeIngredient>,
  ) {}

  async findAll(): Promise<AdminRecipeResponse[]> {
    const entities = await this.recipeRepository.find({
      relations: ['ingredients'],
      order: { name: 'ASC' },
    });
    return entities.map(toAdminResponse);
  }

  async findOne(id: string): Promise<AdminRecipeResponse> {
    const entity = await this.recipeRepository.findOne({
      where: { id },
      relations: ['ingredients'],
    });
    if (!entity) throw new NotFoundException(`Recipe ${id} not found`);
    return toAdminResponse(entity);
  }

  async create(input: AdminRecipeCreate): Promise<AdminRecipeResponse> {
    return this.dataSource.transaction(async (manager) => {
      const id = randomUUID();
      const recipe = manager.create(Recipe, {
        id,
        name: input.name,
        servings: 1,
        dietTags: input.dietTags,
        allergens: input.allergens,
        requiredAppliances: input.requiredAppliances,
        prepTimeMinutes: input.prepTimeMinutes,
        cookTimeMinutes: input.cookTimeMinutes,
        calories: input.nutrition.calories,
        protein: input.nutrition.protein,
        carbs: input.nutrition.carbs,
        fat: input.nutrition.fat,
        steps: input.steps,
        status: input.status,
      });
      await manager.save(Recipe, recipe);

      const ingredients = input.ingredients.map((ing, index) =>
        manager.create(RecipeIngredient, {
          recipeId: id,
          position: index,
          name: ing.name,
          quantity: ing.quantity / input.servingsInput,
          unit: ing.unit,
          category: ing.category,
        }),
      );
      await manager.save(RecipeIngredient, ingredients);

      const saved = await manager.findOne(Recipe, {
        where: { id },
        relations: ['ingredients'],
      });
      return toAdminResponse(saved!);
    });
  }

  async update(id: string, input: AdminRecipeUpdate): Promise<AdminRecipeResponse> {
    return this.dataSource.transaction(async (manager) => {
      const existing = await manager.findOne(Recipe, {
        where: { id },
        relations: ['ingredients'],
      });
      if (!existing) throw new NotFoundException(`Recipe ${id} not found`);

      if (input.name !== undefined) existing.name = input.name;
      if (input.dietTags !== undefined) existing.dietTags = input.dietTags;
      if (input.allergens !== undefined) existing.allergens = input.allergens;
      if (input.requiredAppliances !== undefined) existing.requiredAppliances = input.requiredAppliances;
      if (input.prepTimeMinutes !== undefined) existing.prepTimeMinutes = input.prepTimeMinutes;
      if (input.cookTimeMinutes !== undefined) existing.cookTimeMinutes = input.cookTimeMinutes;
      if (input.nutrition !== undefined) {
        existing.calories = input.nutrition.calories;
        existing.protein = input.nutrition.protein;
        existing.carbs = input.nutrition.carbs;
        existing.fat = input.nutrition.fat;
      }
      if (input.steps !== undefined) existing.steps = input.steps;
      if (input.status !== undefined) existing.status = input.status;
      await manager.save(Recipe, existing);

      if (input.ingredients !== undefined) {
        const divisor = input.servingsInput ?? 1;
        await manager.delete(RecipeIngredient, { recipeId: id });
        const ingredients = input.ingredients.map((ing, index) =>
          manager.create(RecipeIngredient, {
            recipeId: id,
            position: index,
            name: ing.name,
            quantity: ing.quantity / divisor,
            unit: ing.unit,
            category: ing.category,
          }),
        );
        await manager.save(RecipeIngredient, ingredients);
      }

      const updated = await manager.findOne(Recipe, {
        where: { id },
        relations: ['ingredients'],
      });
      return toAdminResponse(updated!);
    });
  }

  async remove(id: string): Promise<void> {
    const exists = await this.recipeRepository.existsBy({ id });
    if (!exists) throw new NotFoundException(`Recipe ${id} not found`);
    await this.recipeRepository.delete({ id });
  }
}

function toAdminResponse(entity: Recipe): AdminRecipeResponse {
  return {
    id: entity.id,
    name: entity.name,
    servings: entity.servings,
    dietTags: entity.dietTags,
    allergens: entity.allergens,
    requiredAppliances: entity.requiredAppliances,
    prepTimeMinutes: entity.prepTimeMinutes,
    cookTimeMinutes: entity.cookTimeMinutes,
    nutrition: {
      calories: entity.calories,
      protein: entity.protein,
      carbs: entity.carbs,
      fat: entity.fat,
    },
    ingredients: [...entity.ingredients]
      .sort((a, b) => a.position - b.position)
      .map((ing) => ({
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        category: ing.category,
      })),
    steps: entity.steps,
    status: entity.status,
  };
}
