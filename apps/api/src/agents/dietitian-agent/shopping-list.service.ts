import { Injectable } from '@nestjs/common';
import { ShoppingListCategory } from './dietitian-agent.types';
import { RecipeRepositoryService } from './recipe-repository.service';

interface AggregatedItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

@Injectable()
export class ShoppingListService {
  constructor(private readonly recipeRepository: RecipeRepositoryService) {}

  build(recipeIds: string[], numberOfPeople: number): ShoppingListCategory[] {
    const recipes = this.recipeRepository.findByIds(recipeIds);
    const aggregated = new Map<string, AggregatedItem>();

    for (const recipe of recipes) {
      const ratio = numberOfPeople / recipe.servings;
      for (const ingredient of recipe.ingredients) {
        const key = `${ingredient.name.toLowerCase()}|${ingredient.unit.toLowerCase()}`;
        const scaledQuantity = ingredient.quantity * ratio;
        const existing = aggregated.get(key);
        if (existing) {
          existing.quantity += scaledQuantity;
        } else {
          aggregated.set(key, {
            name: ingredient.name,
            quantity: scaledQuantity,
            unit: ingredient.unit,
            category: ingredient.category,
          });
        }
      }
    }

    const categories = new Map<string, ShoppingListCategory>();
    for (const item of aggregated.values()) {
      const category = categories.get(item.category) ?? {
        category: item.category,
        items: [],
      };
      category.items.push({
        name: item.name,
        quantity: Math.round(item.quantity * 100) / 100,
        unit: item.unit,
      });
      categories.set(item.category, category);
    }

    return Array.from(categories.values());
  }
}
