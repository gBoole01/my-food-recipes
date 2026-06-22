import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { Seasonality } from '../src/seasonality/seasonality.entity';
import { SEASONALITY_MAPPING } from './seasonality-mapping.data';

config({ path: join(__dirname, '..', '.env') });

async function main(): Promise<void> {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [Seasonality],
    synchronize: process.env.NODE_ENV !== 'production',
  });
  await dataSource.initialize();

  const seasonalityRepository = dataSource.getRepository(Seasonality);
  await seasonalityRepository.upsert(SEASONALITY_MAPPING, ['name', 'month']);

  await dataSource.destroy();

  console.log(`Seeded ${SEASONALITY_MAPPING.length} seasonality rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
