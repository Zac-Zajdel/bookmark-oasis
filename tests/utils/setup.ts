import { prisma } from '@/lib/db';
import { hashApiToken } from '@/lib/utils';
import { randomBytes } from 'crypto';
import { beforeAll, TestContext } from 'vitest';

export interface CustomTestContext extends TestContext {
  apiToken: string;
}

let apiToken: string;

beforeAll(async () => {
  const user = await prisma.user.upsert({
    where: {
      email: 'zaczajdel213@gmail.com',
    },
    update: {},
    create: {
      name: 'Zac Zajdel',
      email: 'zaczajdel213@gmail.com',
    },
  });

  const token = randomBytes(32).toString('hex');
  await prisma.apiToken.create({
    data: {
      userId: user.id,
      name: 'Bookmark Testing',
      token: await hashApiToken(token),
    },
  });

  apiToken = token;
});

export function getApiToken(): string {
  return apiToken;
}
