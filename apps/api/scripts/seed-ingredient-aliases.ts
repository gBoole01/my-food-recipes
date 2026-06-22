import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { FoodNutrition } from '../src/nutrition/food-nutrition.entity';
import { IngredientAlias } from '../src/nutrition/ingredient-alias.entity';
import { INGREDIENT_ALIAS_MAPPING } from './ingredient-alias-mapping.data';

config({ path: join(__dirname, '..', '.env') });

async function main(): Promise<void> {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [FoodNutrition, IngredientAlias],
    synchronize: process.env.NODE_ENV !== 'production',
  });
  await dataSource.initialize();

  const foodNutritionRepository = dataSource.getRepository(FoodNutrition);
  const foodNutritionRows = await foodNutritionRepository.find({
    select: ['id', 'nutrientDataBankNumber'],
  });
  const idByNdbNumber = new Map(
    foodNutritionRows.map((row) => [row.nutrientDataBankNumber, row.id]),
  );

  const rows: Partial<IngredientAlias>[] = [];
  const unresolved: string[] = [];

  for (const entry of INGREDIENT_ALIAS_MAPPING) {
    if (entry.ndbNumber === null) {
      rows.push({
        alias: entry.alias,
        foodNutritionId: null,
        notes: entry.notes ?? null,
      });
      continue;
    }

    const foodNutritionId = idByNdbNumber.get(entry.ndbNumber);
    if (!foodNutritionId) {
      unresolved.push(`${entry.alias} (NDB ${entry.ndbNumber})`);
      continue;
    }

    rows.push({
      alias: entry.alias,
      foodNutritionId,
      notes: entry.notes ?? null,
    });
  }

  if (unresolved.length > 0) {
    console.error(
      `Could not resolve NDB number to a food_nutrition row for: ${unresolved.join(', ')}. Run seed:nutrition first.`,
    );
    await dataSource.destroy();
    process.exit(1);
  }

  const ingredientAliasRepository = dataSource.getRepository(IngredientAlias);
  await ingredientAliasRepository.upsert(rows, ['alias']);

  await dataSource.destroy();

  const mapped = rows.filter((row) => row.foodNutritionId !== null).length;
  const unmapped = rows.length - mapped;
  console.log(
    `Seeded ${rows.length} ingredient_aliases rows (${mapped} mapped, ${unmapped} unmapped).`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
