import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { Bookmark } from '@prisma/client';
import { afterAll, beforeAll, expect, test } from 'vitest';

beforeAll(async () => {
  await prisma.bookmark.deleteMany({});
});

test('UPDATE /bookmarks', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const initialBookmark = await prisma.bookmark.create({
    data: {
      userId: user.id,
      url: 'https://www.example.com/',
      title: 'Example Title',
      description: 'Example Description',
    },
  });

  const {
    status,
    data: { success, message },
  } = await http.put<Bookmark>({
    path: `/bookmarks/${initialBookmark.id}`,
    body: {
      title: 'Updated Title',
      url: 'https://www.youtube.com/',
      description: 'Updated Description',
      isFavorite: true,
      iconName: 'Search',
    },
  });

  expect(status).toBe(200);
  expect(success).toBe(true);
  expect(message).toBe('Bookmark updated successfully.');

  const updatedBookmark = await prisma.bookmark.findUnique({
    where: {
      id: initialBookmark.id,
    },
  });

  expect(updatedBookmark).toEqual(
    expect.objectContaining({
      userId: user.id,
      url: 'https://www.youtube.com/',
      title: 'Updated Title',
      description: 'Updated Description',
      isFavorite: true,
      iconName: 'Search',
      visits: 0,
    }),
  );
});

afterAll(async () => {
  await prisma.bookmark.deleteMany({});
});
