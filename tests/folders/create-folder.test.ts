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
      // todo - parent ID test separately....
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

afterAll(async () => {
  await prisma.folder.deleteMany({});
});
