import { config } from 'dotenv';
import { join } from 'path';
import { DataSource, In } from 'typeorm';
import { RecipeCorpusSchema } from '@my-food-recipes/contracts';
import { FoodCategory } from '../src/nutrition/food-category.entity';
import { FoodNutrition } from '../src/nutrition/food-nutrition.entity';
import { IngredientAlias } from '../src/nutrition/ingredient-alias.entity';
import { Recipe } from '../src/recipes/recipe.entity';
import { RecipeIngredient } from '../src/recipes/recipe-ingredient.entity';
import { RECIPES_SEED } from './recipes-seed.data';

config({ path: join(__dirname, '..', '.env') });

async function main(): Promise<void> {
  const result = RecipeCorpusSchema.safeParse(RECIPES_SEED);

  if (!result.success) {
    console.error('Invalid recipe corpus:');
    for (const issue of result.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(1);
  }

  const ids = new Set<string>();
  const duplicates: string[] = [];
  for (const recipe of result.data) {
    if (ids.has(recipe.id)) duplicates.push(recipe.id);
    ids.add(recipe.id);
  }

  if (duplicates.length > 0) {
    console.error(`Duplicate recipe ids found: ${duplicates.join(', ')}`);
    process.exit(1);
  }

  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [Recipe, RecipeIngredient, IngredientAlias, FoodNutrition, FoodCategory],
    synchronize: process.env.NODE_ENV !== 'production',
  });
  await dataSource.initialize();

  const recipeRepository = dataSource.getRepository(Recipe);
  const recipeIngredientRepository = dataSource.getRepository(RecipeIngredient);

  const recipeRows: Partial<Recipe>[] = result.data.map((recipe) => ({
    id: recipe.id,
    name: recipe.name,
    servings: recipe.servings,
    dietTags: recipe.dietTags,
    allergens: recipe.allergens,
    requiredAppliances: recipe.requiredAppliances,
    prepTimeMinutes: recipe.prepTimeMinutes,
    cookTimeMinutes: recipe.cookTimeMinutes,
    calories: recipe.nutrition.calories,
    protein: recipe.nutrition.protein,
    carbs: recipe.nutrition.carbs,
    fat: recipe.nutrition.fat,
    steps: recipe.steps,
  }));

  await recipeRepository.upsert(recipeRows, ['id']);

  const recipeIds = result.data.map((recipe) => recipe.id);
  await recipeIngredientRepository.delete({ recipeId: In(recipeIds) });

  const ingredientRows: Partial<RecipeIngredient>[] = result.data.flatMap(
    (recipe) =>
      recipe.ingredients.map((ingredient, index) => ({
        recipeId: recipe.id,
        position: index,
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        category: ingredient.category,
      })),
  );

  await recipeIngredientRepository.insert(ingredientRows);

  await dataSource.destroy();

  console.log(
    `Seeded ${recipeRows.length} recipes and ${ingredientRows.length} recipe_ingredients rows.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
