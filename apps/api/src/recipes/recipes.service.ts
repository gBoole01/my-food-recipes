import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { RecipeInput } from '@my-food-recipes/contracts';
import { Recipe } from './recipe.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  async findAll(): Promise<RecipeInput[]> {
    const entities = await this.recipeRepository.find({
      relations: ['ingredients'],
      order: { name: 'ASC' },
    });
    return entities.map(toRecipeResponse);
  }
}

function toRecipeResponse(entity: Recipe): RecipeInput {
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
      .map((ingredient) => ({
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        category: ingredient.category,
      })),
    steps: entity.steps,
  };
}
