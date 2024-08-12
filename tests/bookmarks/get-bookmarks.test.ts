import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { Bookmark } from '@prisma/client';
import { afterAll, expect, test } from 'vitest';

test('GET /bookmarks', async (ctx: OasisTestContext) => {
  const { user, apiToken } = await getSetupData();
  ctx.apiToken = apiToken;

  const h = new IntegrationHarness(ctx);
  const { http } = await h.init();

  const createdBookmarks = (
    await prisma.bookmark.createManyAndReturn({
      data: [
        {
          userId: user.id,
          url: 'https://www.youtube.com/',
          title: 'Youtube',
        },
        {
          userId: user.id,
          url: 'https://github.com/',
          title: 'Github',
        },
      ],
    })
  ).map((bookmark) => ({
    ...bookmark,
    createdAt: bookmark.createdAt.toISOString(),
    updatedAt: bookmark.updatedAt.toISOString(),
  }));

  const {
    status,
    data: { success, message, data: fetchedBookmarks },
  } = await http.get<Bookmark[]>({
    path: '/bookmarks',
  });

  expect(status).toBe(200);
  expect(success).toBe(true);
  expect(message).toBe('Bookmarks gathered successfully.');
  expect(createdBookmarks).toEqual(fetchedBookmarks);
});

afterAll(async () => {
  await prisma.bookmark.deleteMany({});
  await prisma.apiToken.deleteMany({});
});
