import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { afterAll, expect, test } from 'vitest';

test('DELETE /users/:id', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const tag = await prisma.tag.create({
    data: {
      name: 'Test Tag',
      color: 'Blue',
      userId: user.id,
    },
  });

  const folder = await prisma.folder.create({
    data: {
      title: 'Test Folder',
      userId: user.id,
    },
  });

  const folderTag = await prisma.folderTag.create({
    data: {
      folderId: folder.id,
      tagId: tag.id,
    },
  });

  const bookmark = await prisma.bookmark.create({
    data: {
      title: 'Bookmark Oasis',
      url: 'https://bookmarkoasis.com',
      userId: user.id,
    },
  });

  const bookmarkTag = await prisma.bookmarkTag.create({
    data: {
      bookmarkId: bookmark.id,
      tagId: tag.id,
    },
  });

  const {
    status,
    data: { success, message },
  } = await http.delete({
    path: `/users/${user.id}`,
  });

  expect(status).toBe(200);
  expect(success).toBe(true);
  expect(message).toBe(
    'User and all associated data was deleted successfully.',
  );

  expect(
    await prisma.tag.findUnique({
      where: {
        id: tag.id,
      },
    }),
  ).toBeNull();

  expect(
    await prisma.folder.findUnique({
      where: {
        id: folder.id,
      },
    }),
  ).toBeNull();

  expect(
    await prisma.folderTag.findUnique({
      where: {
        id: folderTag.id,
      },
    }),
  ).toBeNull();

  expect(
    await prisma.bookmark.findUnique({
      where: {
        id: bookmark.id,
      },
    }),
  ).toBeNull();

  expect(
    await prisma.bookmarkTag.findUnique({
      where: {
        id: bookmarkTag.id,
      },
    }),
  ).toBeNull();

  expect(
    await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    }),
  ).toBeNull();
});

afterAll(async () => {
  await prisma.tag.deleteMany({});

  // @ts-expect-error - This is a test calm down
  global.user = null;
  // @ts-expect-error - This is a test calm down
  global.apiToken = null;
});
