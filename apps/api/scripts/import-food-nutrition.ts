import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'csv-parse/sync';
import { DataSource } from 'typeorm';
import { FoodNutrition } from '../src/nutrition/food-nutrition.entity';

config({ path: join(__dirname, '..', '.env') });

const BATCH_SIZE = 300;

function toNumberOrNull(value: string | undefined): number | null {
  if (value === undefined) return null;
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function chunk<T>(items: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size));
  }
  return batches;
}

function mapRecord(record: Record<string, string>): Partial<FoodNutrition> {
  return {
    nutrientDataBankNumber: record['Nutrient Data Bank Number'].trim(),
    category: record['Category'],
    description: record['Description'],
    alphaCarotene: toNumberOrNull(record['Data.Alpha Carotene']),
    betaCarotene: toNumberOrNull(record['Data.Beta Carotene']),
    betaCryptoxanthin: toNumberOrNull(record['Data.Beta Cryptoxanthin']),
    carbohydrate: toNumberOrNull(record['Data.Carbohydrate']),
    cholesterol: toNumberOrNull(record['Data.Cholesterol']),
    choline: toNumberOrNull(record['Data.Choline']),
    fiber: toNumberOrNull(record['Data.Fiber']),
    luteinZeaxanthin: toNumberOrNull(record['Data.Lutein and Zeaxanthin']),
    lycopene: toNumberOrNull(record['Data.Lycopene']),
    niacin: toNumberOrNull(record['Data.Niacin']),
    protein: toNumberOrNull(record['Data.Protein']),
    retinol: toNumberOrNull(record['Data.Retinol']),
    riboflavin: toNumberOrNull(record['Data.Riboflavin']),
    selenium: toNumberOrNull(record['Data.Selenium']),
    sugarTotal: toNumberOrNull(record['Data.Sugar Total']),
    thiamin: toNumberOrNull(record['Data.Thiamin']),
    water: toNumberOrNull(record['Data.Water']),
    monounsaturatedFat: toNumberOrNull(record['Data.Fat.Monosaturated Fat']),
    polyunsaturatedFat: toNumberOrNull(record['Data.Fat.Polysaturated Fat']),
    saturatedFat: toNumberOrNull(record['Data.Fat.Saturated Fat']),
    totalLipid: toNumberOrNull(record['Data.Fat.Total Lipid']),
    calcium: toNumberOrNull(record['Data.Major Minerals.Calcium']),
    copper: toNumberOrNull(record['Data.Major Minerals.Copper']),
    iron: toNumberOrNull(record['Data.Major Minerals.Iron']),
    magnesium: toNumberOrNull(record['Data.Major Minerals.Magnesium']),
    phosphorus: toNumberOrNull(record['Data.Major Minerals.Phosphorus']),
    potassium: toNumberOrNull(record['Data.Major Minerals.Potassium']),
    sodium: toNumberOrNull(record['Data.Major Minerals.Sodium']),
    zinc: toNumberOrNull(record['Data.Major Minerals.Zinc']),
    vitaminARae: toNumberOrNull(record['Data.Vitamins.Vitamin A - RAE']),
    vitaminB12: toNumberOrNull(record['Data.Vitamins.Vitamin B12']),
    vitaminB6: toNumberOrNull(record['Data.Vitamins.Vitamin B6']),
    vitaminC: toNumberOrNull(record['Data.Vitamins.Vitamin C']),
    vitaminE: toNumberOrNull(record['Data.Vitamins.Vitamin E']),
    vitaminK: toNumberOrNull(record['Data.Vitamins.Vitamin K']),
  };
}

async function main(): Promise<void> {
  const csvPath = join(__dirname, '..', 'seeds', 'CORGIS Food Dataset.csv');
  const raw = readFileSync(csvPath, 'utf-8');
  const records: Record<string, string>[] = parse(raw, {
    columns: true,
    skip_empty_lines: true,
  });
  const rows = records.map(mapRecord);

  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [FoodNutrition],
    synchronize: process.env.NODE_ENV !== 'production',
  });
  await dataSource.initialize();

  const repository = dataSource.getRepository(FoodNutrition);
  let upserted = 0;
  for (const batch of chunk(rows, BATCH_SIZE)) {
    await repository.upsert(batch, ['nutrientDataBankNumber']);
    upserted += batch.length;
  }

  await dataSource.destroy();
  console.log(
    `Imported ${upserted} food_nutrition rows from ${csvPath} (${records.length} parsed).`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
