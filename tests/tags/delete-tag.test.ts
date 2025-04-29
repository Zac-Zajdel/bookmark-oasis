import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { afterAll, expect, test } from 'vitest';

test('DELETE /tags/:id', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const tag = await prisma.tag.create({
    data: {
      name: 'Coding Tutorials',
      color: 'Blue',
      userId: user.id,
    },
  });

  const {
    status,
    data: { success, message },
  } = await http.delete({
    path: `/tags/${tag.id}`,
  });

  expect(status).toBe(200);
  expect(success).toBe(true);
  expect(message).toBe('Tag was removed successfully.');

  expect(
    await prisma.tag.findUnique({
      where: {
        id: tag.id,
      },
    }),
  ).toBeNull();
});

afterAll(async () => {
  await prisma.tag.deleteMany({});
});
