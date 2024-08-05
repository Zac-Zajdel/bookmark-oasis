import { prisma } from '@/lib/db';
import { hashApiToken } from '@/lib/utils';
import { Bookmark } from '@prisma/client';
import { randomBytes } from 'crypto';
import { afterAll, beforeEach, expect, test, TestContext } from 'vitest';
import { IntegrationHarness } from '../utils/integration';

export interface CustomTestContext extends TestContext {
  apiToken: string;
}

beforeEach(async (ctx: CustomTestContext) => {
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
  ctx.apiToken = token;
});

test('POST /bookmarks', async (ctx: CustomTestContext) => {
  const h = new IntegrationHarness(ctx);
  const { http } = await h.init();

  const { status, data: bookmark } = await http.post<Bookmark>({
    path: '/bookmarks',
    body: {
      url: 'https://www.youtube.com/',
    },
  });

  expect(status).toEqual(201);
  expect(bookmark.url).toEqual('https://www.youtube.com/');
});

afterAll(async () => {
  await prisma.bookmark.deleteMany({});
  await prisma.apiToken.deleteMany({});
});
