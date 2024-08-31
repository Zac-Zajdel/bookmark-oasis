import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { Bookmark } from '@prisma/client';
import { afterAll, beforeAll, expect, test } from 'vitest';

beforeAll(async () => {
  await prisma.bookmark.deleteMany({});
});

test('GET /bookmarks', async (ctx: OasisTestContext) => {
  const { user } = await getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

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
    path: '/bookmarks?page=1&limit=10',
  });

  expect(status).toBe(200);
  expect(success).toBe(true);
  expect(message).toBe('Bookmarks gathered successfully.');
  expect({
    bookmarks: createdBookmarks,
    total: 2,
  }).toEqual(fetchedBookmarks);
});

afterAll(async () => {
  await prisma.bookmark.deleteMany({});
});
