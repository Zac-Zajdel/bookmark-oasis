import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { Folder } from '@prisma/client';
import { afterAll, expect, test } from 'vitest';

test('GET /folders/:id', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const folder = await prisma.folder.create({
    data: {
      userId: user.id,
      title: 'Hello World',
    },
  });

  const {
    status,
    data: { success, message, data: retrievedFolder },
  } = await http.get<Folder>({
    path: `/folders/${folder.id}`,
  });

  expect(status).toBe(200);
  expect(success).toBe(true);
  expect(message).toBe('Folder retrieved.');
  expect(folder.id).toEqual(retrievedFolder.id);
});

afterAll(async () => {
  await prisma.folder.deleteMany({});
});
