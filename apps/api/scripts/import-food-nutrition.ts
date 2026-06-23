import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as iconv from 'iconv-lite';
import { parse } from 'csv-parse/sync';
import { DataSource } from 'typeorm';
import { FoodNutrition } from '../src/nutrition/food-nutrition.entity';

config({ path: join(__dirname, '..', '.env') });

const BATCH_SIZE = 300;

// CIQUAL marks values as "-" (not measured), "traces" (present, below quantification),
// or "< X" (below quantification limit, bounded above by X). We keep the bound as the
// stored value for "< X" so downstream macro math (e.g. salt) has a usable number.
function toNumberOrNull(value: string | undefined): number | null {
  if (value === undefined) return null;
  let trimmed = value.trim().replace(/\s+/g, ' ');
  if (trimmed === '' || trimmed === '-' || trimmed.toLowerCase() === 'traces') {
    return null;
  }
  if (trimmed.startsWith('<')) {
    trimmed = trimmed.slice(1).trim();
  }
  const normalized = trimmed.replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function toStringOrNull(value: string | undefined): string | null {
  if (value === undefined) return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

function chunk<T>(items: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size));
  }
  return batches;
}

// CIQUAL CSV headers span multiple physical lines inside quoted cells and contain
// mojibake-prone accented characters; column position is the only reliable key.
function mapRow(row: string[]): Partial<FoodNutrition> {
  return {
    groupCode: row[0].trim(),
    subgroupCode: row[1].trim(),
    subSubgroupCode: row[2].trim(),
    groupName: row[3].trim(),
    subgroupName: row[4].trim(),
    subSubgroupName: row[5].trim(),
    alimCode: row[6].trim(),
    nameFr: row[7].trim(),
    nameScientific: toStringOrNull(row[8]),
    energyKj: toNumberOrNull(row[9]),
    energyKcal: toNumberOrNull(row[10]),
    energyJonesKj: toNumberOrNull(row[11]),
    energyJonesKcal: toNumberOrNull(row[12]),
    water: toNumberOrNull(row[13]),
    proteinJones: toNumberOrNull(row[14]),
    protein: toNumberOrNull(row[15]),
    carbohydrate: toNumberOrNull(row[16]),
    fat: toNumberOrNull(row[17]),
    sugarTotal: toNumberOrNull(row[18]),
    fructose: toNumberOrNull(row[19]),
    galactose: toNumberOrNull(row[20]),
    glucose: toNumberOrNull(row[21]),
    lactose: toNumberOrNull(row[22]),
    maltose: toNumberOrNull(row[23]),
    sucrose: toNumberOrNull(row[24]),
    starch: toNumberOrNull(row[25]),
    fiber: toNumberOrNull(row[26]),
    polyols: toNumberOrNull(row[27]),
    ash: toNumberOrNull(row[28]),
    alcohol: toNumberOrNull(row[29]),
    organicAcids: toNumberOrNull(row[30]),
    saturatedFat: toNumberOrNull(row[31]),
    monounsaturatedFat: toNumberOrNull(row[32]),
    polyunsaturatedFat: toNumberOrNull(row[33]),
    fattyAcid4_0: toNumberOrNull(row[34]),
    fattyAcid6_0: toNumberOrNull(row[35]),
    fattyAcid8_0: toNumberOrNull(row[36]),
    fattyAcid10_0: toNumberOrNull(row[37]),
    fattyAcid12_0: toNumberOrNull(row[38]),
    fattyAcid14_0: toNumberOrNull(row[39]),
    fattyAcid16_0: toNumberOrNull(row[40]),
    fattyAcid18_0: toNumberOrNull(row[41]),
    fattyAcid18_1Oleic: toNumberOrNull(row[42]),
    fattyAcid18_2Linoleic: toNumberOrNull(row[43]),
    fattyAcid18_3AlphaLinolenic: toNumberOrNull(row[44]),
    fattyAcid20_4Arachidonic: toNumberOrNull(row[45]),
    fattyAcid20_5Epa: toNumberOrNull(row[46]),
    fattyAcid22_6Dha: toNumberOrNull(row[47]),
    cholesterol: toNumberOrNull(row[48]),
    salt: toNumberOrNull(row[49]),
    calcium: toNumberOrNull(row[50]),
    chloride: toNumberOrNull(row[51]),
    copper: toNumberOrNull(row[52]),
    iron: toNumberOrNull(row[53]),
    iodine: toNumberOrNull(row[54]),
    magnesium: toNumberOrNull(row[55]),
    manganese: toNumberOrNull(row[56]),
    phosphorus: toNumberOrNull(row[57]),
    potassium: toNumberOrNull(row[58]),
    selenium: toNumberOrNull(row[59]),
    sodium: toNumberOrNull(row[60]),
    zinc: toNumberOrNull(row[61]),
    vitaminARae: toNumberOrNull(row[62]),
    retinol: toNumberOrNull(row[63]),
    betaCarotene: toNumberOrNull(row[64]),
    vitaminD: toNumberOrNull(row[65]),
    vitaminD2: toNumberOrNull(row[66]),
    vitaminD3: toNumberOrNull(row[67]),
    alphaTocopherol: toNumberOrNull(row[68]),
    vitaminE: toNumberOrNull(row[69]),
    vitaminK1: toNumberOrNull(row[70]),
    vitaminK2: toNumberOrNull(row[71]),
    vitaminC: toNumberOrNull(row[72]),
    vitaminB1: toNumberOrNull(row[73]),
    vitaminB2: toNumberOrNull(row[74]),
    vitaminB3: toNumberOrNull(row[75]),
    vitaminB5: toNumberOrNull(row[76]),
    vitaminB6: toNumberOrNull(row[77]),
    vitaminB9Dfe: toNumberOrNull(row[78]),
    vitaminB9: toNumberOrNull(row[79]),
    folatesIntrinsic: toNumberOrNull(row[80]),
    folicAcidFortification: toNumberOrNull(row[81]),
    vitaminB12: toNumberOrNull(row[82]),
    jonesFactor: toStringOrNull(row[83]),
  };
}

async function main(): Promise<void> {
  const csvPath = join(
    __dirname,
    '..',
    'seeds',
    'Table Ciqual 2025_FR_2025_11_03.csv',
  );
  const raw = iconv.decode(readFileSync(csvPath), 'macroman');
  const records: string[][] = parse(raw, {
    delimiter: ';',
    skip_empty_lines: true,
    fromLine: 2,
  });
  const rows = records.map(mapRow);

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
    await repository.upsert(batch, ['alimCode']);
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
