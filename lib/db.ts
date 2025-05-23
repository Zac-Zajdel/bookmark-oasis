import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

let connection: PrismaClient;
if (process.env.NODE_ENV === 'production') {
  connection = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  connection = global.cachedPrisma;
}

export const prisma = connection;
