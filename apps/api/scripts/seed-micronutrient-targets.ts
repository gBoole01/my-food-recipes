import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { MicronutrientTarget } from '../src/nutrition/micronutrient-target.entity';

config({ path: join(__dirname, '..', '.env') });

interface SeedRow {
  gender: 'M' | 'F' | 'any';
  ageMin: number;
  ageMax: number;
  specialCondition: string | null;
  fiberG: number;
  ironMg: number;
  calciumMg: number;
  magnesiumMg: number;
  vitaminCMg: number;
}

const ROWS: SeedRow[] = [
  // Baseline adult male (24+)
  {
    gender: 'M',
    ageMin: 24,
    ageMax: 999,
    specialCondition: null,
    fiberG: 30,
    ironMg: 11,
    calciumMg: 950,
    magnesiumMg: 380,
    vitaminCMg: 110,
  },
  // Baseline adult female (24+)
  {
    gender: 'F',
    ageMin: 24,
    ageMax: 999,
    specialCondition: null,
    fiberG: 30,
    ironMg: 16,
    calciumMg: 950,
    magnesiumMg: 300,
    vitaminCMg: 110,
  },
  // Young adult male (19–23): higher calcium
  {
    gender: 'M',
    ageMin: 19,
    ageMax: 23,
    specialCondition: null,
    fiberG: 30,
    ironMg: 11,
    calciumMg: 1000,
    magnesiumMg: 380,
    vitaminCMg: 110,
  },
  // Young adult female (19–23): higher calcium
  {
    gender: 'F',
    ageMin: 19,
    ageMax: 23,
    specialCondition: null,
    fiberG: 30,
    ironMg: 16,
    calciumMg: 1000,
    magnesiumMg: 300,
    vitaminCMg: 110,
  },
  // Pregnant female: higher iron (midpoint of 16–22 mg)
  {
    gender: 'F',
    ageMin: 0,
    ageMax: 999,
    specialCondition: 'pregnant',
    fiberG: 30,
    ironMg: 19,
    calciumMg: 950,
    magnesiumMg: 300,
    vitaminCMg: 110,
  },
  // Breastfeeding female: same as adult female baseline
  {
    gender: 'F',
    ageMin: 0,
    ageMax: 999,
    specialCondition: 'breastfeeding',
    fiberG: 30,
    ironMg: 16,
    calciumMg: 950,
    magnesiumMg: 300,
    vitaminCMg: 110,
  },
];

async function main(): Promise<void> {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [MicronutrientTarget],
    synchronize: process.env.NODE_ENV !== 'production',
  });

  await dataSource.initialize();

  const repo = dataSource.getRepository(MicronutrientTarget);

  let inserted = 0;
  let skipped = 0;

  for (const row of ROWS) {
    const result = await repo.upsert(row, {
      conflictPaths: ['gender', 'ageMin', 'ageMax', 'specialCondition'],
      skipUpdateIfNoValuesChanged: true,
    });
    if (result.identifiers.length > 0) {
      inserted++;
    } else {
      skipped++;
    }
  }

  console.log(`Micronutrient targets: ${inserted} upserted, ${skipped} unchanged.`);
  await dataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
