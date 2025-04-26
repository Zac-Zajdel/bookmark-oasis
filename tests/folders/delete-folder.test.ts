import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { afterAll, expect, test } from 'vitest';

test('DELETE /folders/{id}', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const folder = await prisma.folder.create({
    data: {
      title: 'Coding Tutorials',
      description: 'A collection of coding tutorials.',
      iconName: 'Book',
      userId: user.id,
    },
  });

  const {
    status,
    data: { success, message },
  } = await http.delete({
    path: `/folders/${folder.id}`,
  });

  expect(status).toBe(200);
  expect(success).toBe(true);
  expect(message).toBe('Folder was removed successfully.');

  expect(
    await prisma.folder.findUnique({
      where: {
        id: folder.id,
      },
    }),
  ).toBeNull();
});

afterAll(async () => {
  await prisma.folder.deleteMany({});
});
