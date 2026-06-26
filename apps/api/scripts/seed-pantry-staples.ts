import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { GlobalPantryStaple } from '../src/admin/global-pantry-staple.entity';
import { FoodCategory } from '../src/nutrition/food-category.entity';
import { FoodNutrition } from '../src/nutrition/food-nutrition.entity';
import { PANTRY_STAPLES_CIQUAL_MAPPING } from './pantry-staples-ciqual-mapping.data';

config({ path: join(__dirname, '..', '.env') });

async function main(): Promise<void> {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [FoodCategory, FoodNutrition, GlobalPantryStaple],
    synchronize: process.env.NODE_ENV !== 'production',
  });
  await dataSource.initialize();

  const foodNutritionRows = await dataSource
    .getRepository(FoodNutrition)
    .find({ select: ['id', 'alimCode'] });
  const idByAlimCode = new Map(
    foodNutritionRows.map((row) => [row.alimCode, row.id]),
  );

  const repo = dataSource.getRepository(GlobalPantryStaple);

  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  const unresolved: string[] = [];

  for (const entry of PANTRY_STAPLES_CIQUAL_MAPPING) {
    const trimmed = entry.name.trim();

    let foodNutritionId: string | null = null;
    if (entry.alimCode !== null) {
      const resolved = idByAlimCode.get(entry.alimCode);
      if (!resolved) {
        unresolved.push(`${trimmed} (alim_code ${entry.alimCode})`);
        continue;
      }
      foodNutritionId = resolved;
    }

    const existing = await repo.findOneBy({ name: trimmed });
    if (existing) {
      if (existing.foodNutritionId === foodNutritionId) {
        skipped++;
        continue;
      }
      await repo.update(existing.id, { foodNutritionId });
      updated++;
    } else {
      await repo.save(repo.create({ name: trimmed, foodNutritionId }));
      inserted++;
    }
  }

  await dataSource.destroy();

  if (unresolved.length > 0) {
    console.warn(
      `\nNon résolus (alim_code absent de food_nutrition) :\n  ${unresolved.join('\n  ')}\n→ Relancez seed:nutrition en premier.`,
    );
  }

  console.log(
    `Seed terminé : ${inserted} insérés, ${updated} mis à jour (FK CIQUAL), ${skipped} ignorés (déjà à jour).`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
