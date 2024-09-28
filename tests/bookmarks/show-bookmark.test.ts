import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { Bookmark } from '@prisma/client';
import { afterAll, beforeAll, expect, test } from 'vitest';

beforeAll(async () => {
  await prisma.bookmark.deleteMany({});
});

test('GET /bookmarks/{ID}', async (ctx: OasisTestContext) => {
  const { user } = await getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const bookmark = await prisma.bookmark.create({
    data: {
      userId: user.id,
      url: 'https://www.youtube.com/',
      title: 'Youtube',
    },
  });

  const {
    status,
    data: { success, message, data: retrievedBookmark },
  } = await http.get<Bookmark>({
    path: `/bookmarks/${bookmark.id}`,
  });

  expect(status).toBe(200);
  expect(success).toBe(true);
  expect(message).toBe('Bookmark retrieved.');
  expect(bookmark.id).toEqual(retrievedBookmark.id);
});

afterAll(async () => {
  await prisma.bookmark.deleteMany({});
});
