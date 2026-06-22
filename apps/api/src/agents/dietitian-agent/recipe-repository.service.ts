import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe as RecipeEntity } from '../../recipes/recipe.entity';
import { Recipe } from './dietitian-agent.types';

@Injectable()
export class RecipeRepositoryService implements OnModuleInit {
  private recipes: Recipe[] = [];

  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    const entities = await this.recipeRepository.find({
      relations: ['ingredients'],
    });

    this.recipes = entities.map((entity) => ({
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
    }));
  }

  findAll(): Recipe[] {
    return this.recipes;
  }

  findByIds(ids: string[]): Recipe[] {
    const idSet = new Set(ids);
    return this.recipes.filter((recipe) => idSet.has(recipe.id));
  }
}
