// temp-reset.ts
import { AppDataSource } from './src/data-source';

async function resetDatabase() {
  await AppDataSource.initialize();

  // Drops the database schema and recreates it according to your entities
  await AppDataSource.dropDatabase();
  await AppDataSource.synchronize(); // creates tables again
  console.log('Database reset complete');

  await AppDataSource.destroy();
}

resetDatabase().catch((err) => {
  console.error(err);
  process.exit(1);
});
