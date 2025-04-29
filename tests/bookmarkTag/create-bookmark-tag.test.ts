import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { BookmarkTag, Tag } from '@prisma/client';
import { afterAll, beforeAll, expect, test } from 'vitest';

beforeAll(async () => {
  await prisma.bookmarkTag.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.bookmark.deleteMany({});
});

test('POST & Link Existing Tag - /bookmarks/:id/tags', async (ctx: OasisTestContext) => {
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

  const {
    status,
    data: { success, message, data },
  } = await http.post<{ tag: Tag; pivot: BookmarkTag }>({
    path: `/bookmarks/${bookmark.id}/tags`,
    body: {
      tagId: tag.id,
    },
  });

  expect(status).toBe(201);
  expect(success).toBe(true);
  expect(message).toBe('Tag was associated with bookmark successfully.');
  expect(data.tag).toEqual(
    expect.objectContaining({
      id: tag.id,
      name: 'Test Tag',
      color: 'Blue',
      userId: user.id,
    }),
  );
  expect(data.pivot).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      bookmarkId: bookmark.id,
      tagId: tag.id,
    }),
  );
});

test('POST & Create New Tag - /bookmarks/:id/tags', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  // Create a bookmark
  const bookmark = await prisma.bookmark.create({
    data: {
      userId: user.id,
      url: 'https://www.example.com/2',
      title: 'Example Website 2.0',
    },
  });

  // Test getting the tags for the bookmark
  const {
    status,
    data: { success, message, data },
  } = await http.post<{ tag: Tag; pivot: BookmarkTag }>({
    path: `/bookmarks/${bookmark.id}/tags`,
    body: {
      tagName: 'Test Create While Linking',
      tagColor: 'Orange',
    },
  });

  expect(status).toBe(201);
  expect(success).toBe(true);
  expect(message).toBe('Tag was associated with bookmark successfully.');

  const tag = await prisma.tag.findUnique({
    where: {
      id: data.tag.id,
    },
  });

  expect(data.tag).toEqual(
    expect.objectContaining({
      id: tag?.id,
      name: 'Test Create While Linking',
      color: 'Orange',
      userId: user.id,
    }),
  );
  expect(data.pivot).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      bookmarkId: bookmark.id,
      tagId: tag?.id,
    }),
  );
});

afterAll(async () => {
  await prisma.bookmarkTag.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.bookmark.deleteMany({});
});
