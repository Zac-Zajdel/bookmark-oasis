import { prisma } from '../lib/db';
import {
  apiTokenSeeder,
  bookmarkSeeder,
  folderSeeder,
  tagSeeder,
  userSeeder,
} from './seeders';

async function main() {
  try {
    const user = await userSeeder();
    const tags = await tagSeeder(user);
    const folders = await folderSeeder(user, tags);
    await bookmarkSeeder(user, folders, tags);
    await apiTokenSeeder(user);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
