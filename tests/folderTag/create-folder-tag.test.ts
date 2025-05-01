import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { FolderTag, Tag } from '@prisma/client';
import { afterAll, beforeAll, expect, test } from 'vitest';

beforeAll(async () => {
  await prisma.folderTag.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.folder.deleteMany({});
});

test('POST & Link Existing Tag - /folders/:id/tags', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const folder = await prisma.folder.create({
    data: {
      userId: user.id,
      title: 'Test Folder',
    },
  });

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
  } = await http.post<{ tag: Tag; pivot: FolderTag }>({
    path: `/folders/${folder.id}/tags`,
    body: {
      tagId: tag.id,
    },
  });

  expect(status).toBe(201);
  expect(success).toBe(true);
  expect(message).toBe('Tag was associated with folder successfully.');
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
      folderId: folder.id,
      tagId: tag.id,
    }),
  );
});

test('POST & Create New Tag - /folders/:id/tags', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const folder = await prisma.folder.create({
    data: {
      userId: user.id,
      title: 'Test Folder',
    },
  });

  const {
    status,
    data: { success, message, data },
  } = await http.post<{ tag: Tag; pivot: FolderTag }>({
    path: `/folders/${folder.id}/tags`,
    body: {
      tagName: 'Test Create While Linking',
      tagColor: 'Orange',
    },
  });

  expect(status).toBe(201);
  expect(success).toBe(true);
  expect(message).toBe('Tag was associated with folder successfully.');

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
      folderId: folder.id,
      tagId: tag?.id,
    }),
  );
});

afterAll(async () => {
  await prisma.folderTag.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.folder.deleteMany({});
});
