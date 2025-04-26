import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { Tag } from '@prisma/client';
import { afterAll, expect, test } from 'vitest';

test('POST /tags', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const {
    status,
    data: { success, message, data: tag },
  } = await http.post<Tag>({
    path: '/tags',
    body: {
      name: 'Tutorials',
      color: 'Blue',
    },
  });

  expect(status).toBe(201);
  expect(success).toBe(true);
  expect(message).toBe('Tag was created successfully.');
  expect(tag).toEqual(
    expect.objectContaining({
      userId: user.id,
      name: 'Tutorials',
      color: 'Blue',
    }),
  );
});

afterAll(async () => {
  await prisma.tag.deleteMany({});
});
