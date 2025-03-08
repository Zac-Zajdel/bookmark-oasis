import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { Folder } from '@prisma/client';
import { afterAll, beforeAll, expect, test } from 'vitest';

beforeAll(async () => {
  await prisma.folder.deleteMany({});
});

test('GET /folders', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const createdFolders = (
    await prisma.folder.createManyAndReturn({
      data: [
        {
          userId: user.id,
          title: 'Learning 101',
        },
        {
          userId: user.id,
          title: 'Learning 201',
        },
      ],
    })
  ).map((folder) => ({
    ...folder,
    _count: {
      bookmarks: 0,
    },
    createdAt: folder.createdAt.toISOString(),
    updatedAt: folder.updatedAt.toISOString(),
  }));

  const {
    status,
    data: { success, message, data: fetchedFolders },
  } = await http.get<Folder[]>({
    path: '/folders?page=1&limit=10',
  });

  expect(status).toBe(200);
  expect(success).toBe(true);
  expect(message).toBe('Folders gathered successfully.');
  expect({
    folders: createdFolders,
    total: 2,
  }).toEqual(fetchedFolders);
});

afterAll(async () => {
  await prisma.folder.deleteMany({});
});
