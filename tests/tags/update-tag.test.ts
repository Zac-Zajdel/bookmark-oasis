import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { Tag } from '@prisma/client';
import { afterAll, expect, test } from 'vitest';

test('UPDATE /tags/:id', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const tag = await prisma.tag.create({
    data: {
      userId: user.id,
      name: 'Homework',
      color: 'Blue',
    },
  });

  const {
    status,
    data: { success, message },
  } = await http.put<Tag>({
    path: `/tags/${tag.id}`,
    body: {
      name: 'Homework Completed',
      color: 'Green',
    },
  });

  expect(status).toBe(200);
  expect(success).toBe(true);
  expect(message).toBe('Tag updated successfully.');

  const updatedTag = await prisma.tag.findUnique({
    where: {
      id: tag.id,
    },
  });

  expect(updatedTag).toEqual(
    expect.objectContaining({
      userId: user.id,
      name: 'Homework Completed',
      color: 'Green',
    }),
  );
});

afterAll(async () => {
  await prisma.tag.deleteMany({});
});
