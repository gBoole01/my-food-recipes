import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { GlobalPantryStaple } from '../src/admin/global-pantry-staple.entity';
import { PANTRY_STAPLES_SEED } from './pantry-staples-seed.data';

config({ path: join(__dirname, '..', '.env') });

async function main(): Promise<void> {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [GlobalPantryStaple],
    synchronize: process.env.NODE_ENV !== 'production',
  });
  await dataSource.initialize();

  const repo = dataSource.getRepository(GlobalPantryStaple);

  let inserted = 0;
  let skipped = 0;

  for (const name of PANTRY_STAPLES_SEED) {
    const trimmed = name.trim();
    const exists = await repo.existsBy({ name: trimmed });
    if (exists) {
      skipped++;
      continue;
    }
    await repo.save(repo.create({ name: trimmed }));
    inserted++;
  }

  console.log(`Seed terminé : ${inserted} insérés, ${skipped} ignorés (déjà présents).`);
  await dataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
