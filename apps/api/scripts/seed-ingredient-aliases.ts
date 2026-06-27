import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { FoodCategory } from '../src/nutrition/food-category.entity';
import { FoodNutrition } from '../src/nutrition/food-nutrition.entity';
import { IngredientAlias } from '../src/nutrition/ingredient-alias.entity';
import { INGREDIENT_ALIAS_SEED, MONTHS } from './ingredient-aliases-seed.data';

config({ path: join(__dirname, '..', '.env') });

async function main(): Promise<void> {
  const seasonalByAlias = new Map<string, { type: 'fruit' | 'legume'; months: number[] }>();
  for (const { month, legumes, fruits } of MONTHS) {
    for (const name of legumes) {
      const entry = seasonalByAlias.get(name) ?? { type: 'legume' as const, months: [] };
      entry.months.push(month);
      seasonalByAlias.set(name, entry);
    }
    for (const name of fruits) {
      const entry = seasonalByAlias.get(name) ?? { type: 'fruit' as const, months: [] };
      entry.months.push(month);
      seasonalByAlias.set(name, entry);
    }
  }

  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [FoodCategory, FoodNutrition, IngredientAlias],
    synchronize: process.env.NODE_ENV !== 'production',
  });
  await dataSource.initialize();

  const foodNutritionRows = await dataSource
    .getRepository(FoodNutrition)
    .find({ select: ['id', 'alimCode'] });
  const idByAlimCode = new Map(foodNutritionRows.map((row) => [row.alimCode, row.id]));

  const seedEntryByAlias = new Map(INGREDIENT_ALIAS_SEED.map((e) => [e.alias, e]));
  const allAliases = new Set([...seedEntryByAlias.keys(), ...seasonalByAlias.keys()]);

  const rows: Partial<IngredientAlias>[] = [];
  const unresolved: string[] = [];

  for (const alias of allAliases) {
    const entry = seedEntryByAlias.get(alias);
    const seasonal = seasonalByAlias.get(alias);

    const alimCode = entry?.alimCode ?? null;
    let foodNutritionId: string | null = null;
    if (alimCode !== null) {
      const resolved = idByAlimCode.get(alimCode);
      if (!resolved) {
        unresolved.push(`${alias} (alim_code ${alimCode})`);
        continue;
      }
      foodNutritionId = resolved;
    }

    rows.push({
      alias,
      foodNutritionId,
      isPantryStaple: entry?.isPantryStaple ?? false,
      seasonalType: seasonal?.type ?? null,
      seasonalMonths: seasonal ? [...seasonal.months].sort((a, b) => a - b) : null,
      notes: entry?.notes ?? null,
    });
  }

  if (unresolved.length > 0) {
    console.error(
      `alim_code introuvable dans food_nutrition pour :\n  ${unresolved.join('\n  ')}\n→ Relancez seed:nutrition en premier.`,
    );
    await dataSource.destroy();
    process.exit(1);
  }

  await dataSource.getRepository(IngredientAlias).upsert(rows, ['alias']);
  await dataSource.destroy();

  const withNutrition = rows.filter((r) => r.foodNutritionId !== null).length;
  const pantryCount = rows.filter((r) => r.isPantryStaple).length;
  const seasonalCount = rows.filter((r) => r.seasonalType !== null).length;
  console.log(
    `Seed terminé : ${rows.length} ingredient_aliases (${withNutrition} liés CIQUAL, ${pantryCount} fond de placard, ${seasonalCount} saisonniers).`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
