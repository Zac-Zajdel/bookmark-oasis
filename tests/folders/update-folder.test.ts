import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { Folder } from '@prisma/client';
import { afterAll, expect, test } from 'vitest';

test('UPDATE /folders/{id}', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const initialParentFolder = await prisma.folder.create({
    data: {
      userId: user.id,
      title: 'Parent Folder',
    },
  });

  const initialFolder = await prisma.folder.create({
    data: {
      userId: user.id,
      title: 'Example Folder',
      description: 'Example Description',
      isFavorite: false,
      iconName: 'Folder',
      parentFolderId: initialParentFolder.id,
    },
  });

  const newParentFolder = await prisma.folder.create({
    data: {
      userId: user.id,
      title: 'New Parent Folder',
    },
  });

  const {
    status,
    data: { success, message },
  } = await http.put<Folder>({
    path: `/folders/${initialFolder.id}`,
    body: {
      title: 'Updated Folder',
      description: 'Updated Description',
      isFavorite: true,
      iconName: 'Search',
      parentFolderId: newParentFolder.id,
    },
  });

  expect(status).toBe(200);
  expect(success).toBe(true);
  expect(message).toBe('Folder updated successfully.');

  const updatedFolder = await prisma.folder.findUnique({
    where: {
      id: initialFolder.id,
    },
  });

  expect(updatedFolder).toEqual(
    expect.objectContaining({
      userId: user.id,
      title: 'Updated Folder',
      description: 'Updated Description',
      isFavorite: true,
      iconName: 'Search',
      parentFolderId: newParentFolder.id,
      visits: 0,
    }),
  );
});

afterAll(async () => {
  await prisma.folder.deleteMany({});
});
