import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { Tag } from '@prisma/client';
import { afterAll, beforeAll, expect, test } from 'vitest';

beforeAll(async () => {
  await prisma.bookmarkTag.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.bookmark.deleteMany({});
});

test('GET /bookmarks/:id/tags', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  // Create a bookmark
  const bookmark = await prisma.bookmark.create({
    data: {
      userId: user.id,
      url: 'https://www.example.com/',
      title: 'Example Website',
    },
  });

  // Create a tag
  const tag = await prisma.tag.create({
    data: {
      userId: user.id,
      name: 'Test Tag',
      color: 'Blue',
    },
  });

  // Associate the bookmark with the tag
  await prisma.bookmarkTag.create({
    data: {
      bookmarkId: bookmark.id,
      tagId: tag.id,
    },
  });

  // Test getting the tags for the bookmark
  const {
    status,
    data: { success, message, data },
  } = await http.get<{ tags: Tag[] }>({
    path: `/bookmarks/${bookmark.id}/tags`,
  });

  expect(status).toBe(200);
  expect(success).toBe(true);
  expect(message).toBe('Bookmark tags gathered successfully.');
  expect(data.tags).toHaveLength(1);
  expect(data.tags[0]).toEqual(
    expect.objectContaining({
      id: tag.id,
      name: 'Test Tag',
      color: 'Blue',
      userId: user.id,
    }),
  );
});

afterAll(async () => {
  await prisma.bookmarkTag.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.bookmark.deleteMany({});
});
