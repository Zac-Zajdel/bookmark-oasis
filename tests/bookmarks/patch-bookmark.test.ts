import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { Bookmark } from '@prisma/client';
import { afterAll, beforeAll, expect, test } from 'vitest';

beforeAll(async () => {
  await prisma.bookmark.deleteMany({});
});

test('PATCH /bookmarks/{id}', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const initialBookmark = await prisma.bookmark.create({
    data: {
      userId: user.id,
      url: 'https://www.example.com/',
      title: 'Example Title',
      description: 'Example Description',
      isFavorite: true,
      visits: 0,
    },
  });

  const {
    status,
    data: { success, message },
  } = await http.patch<Bookmark>({
    path: `/bookmarks/${initialBookmark.id}`,
    body: {
      description: 'UPDATE AGAIN',
      visits: 50,
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
      url: 'https://www.example.com/',
      title: 'Example Title',
      description: 'UPDATE AGAIN',
      isFavorite: true,
      visits: 50,
    }),
  );
});

afterAll(async () => {
  await prisma.bookmark.deleteMany({});
});
