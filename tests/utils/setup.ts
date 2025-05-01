import { hashApiToken } from '@/lib/api/apiTokens/utils';
import { prisma } from '@/lib/db';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { beforeAll, TestContext } from 'vitest';

export interface OasisTestContext extends TestContext {
  apiToken: string;
}

declare global {
  // eslint-disable-next-line no-var
  var user: User;
  // eslint-disable-next-line no-var
  var apiToken: string;
}

beforeAll(async () => {
  if (global.user && global.apiToken) return;

  const apiUser = await prisma.user.upsert({
    where: {
      email: 'zaczajdel213@gmail.com',
    },
    update: {},
    create: {
      name: 'Zac Zajdel',
      email: 'zaczajdel213@gmail.com',
    },
  });

  global.user = apiUser;

  const token = randomBytes(32).toString('hex');
  await prisma.apiToken.create({
    data: {
      userId: apiUser.id,
      name: faker.lorem.word(),
      token: hashApiToken(token),
    },
  });

  global.apiToken = token;
});

export function getSetupData() {
  return {
    apiToken: global.apiToken,
    user: global.user,
  };
}
