import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { afterAll, beforeAll, expect, test } from 'vitest';

beforeAll(async () => {
  await prisma.folderTag.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.folder.deleteMany({});
});

test('GET /folders/:id/tags', async (ctx: OasisTestContext) => {
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

  await prisma.folderTag.create({
    data: {
      folderId: folder.id,
      tagId: tag.id,
    },
  });

  const {
    status,
    data: { success, message },
  } = await http.delete({
    path: `/folders/${folder.id}/tags`,
    body: {
      tagId: tag.id,
    },
  });

  expect(status).toBe(200);
  expect(success).toBe(true);
  expect(message).toBe('Folder Tag was removed successfully.');
});

afterAll(async () => {
  await prisma.folderTag.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.folder.deleteMany({});
});
