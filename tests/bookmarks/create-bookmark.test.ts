import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { CustomTestContext, getApiToken } from '@/tests/utils/setup';
import { Bookmark } from '@prisma/client';
import { afterAll, expect, test } from 'vitest';

test('POST /bookmarks', async (ctx: CustomTestContext) => {
  ctx.apiToken = await getApiToken();
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
