import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { Folder } from '@prisma/client';
import { afterAll, expect, test } from 'vitest';

test('POST /folders', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const {
    status,
    data: { success, message, data: folder },
  } = await http.post<Folder>({
    path: '/folders',
    body: {
      title: 'Coding Tutorials',
      description: 'A collection of coding tutorials.',
      iconName: 'Book',
    },
  });

  expect(status).toBe(201);
  expect(success).toBe(true);
  expect(message).toBe('Folder was created successfully.');
  expect(folder).toEqual(
    expect.objectContaining({
      userId: user.id,
      title: 'Coding Tutorials',
      description: 'A collection of coding tutorials.',
      iconName: 'Book',
    }),
  );
});

test('POST /folders within folder', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const existingFolder = await prisma.folder.findFirst({
    select: { id: true },
  });

  const {
    status,
    data: { success, message, data: folder },
  } = await http.post<Folder>({
    path: '/folders',
    body: {
      title: 'A folder within a folder',
      description: 'Testing nested folder functionality.',
      iconName: 'BookUp',
      parentFolderId: existingFolder?.id,
    },
  });

  expect(status).toBe(201);
  expect(success).toBe(true);
  expect(message).toBe('Folder was created successfully.');
  expect(folder).toEqual(
    expect.objectContaining({
      userId: user.id,
      title: 'A folder within a folder',
      description: 'Testing nested folder functionality.',
      iconName: 'BookUp',
      parentFolderId: existingFolder?.id,
    }),
  );
});

afterAll(async () => {
  await prisma.folder.deleteMany({});
});
