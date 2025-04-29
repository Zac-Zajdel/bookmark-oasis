import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { Tag } from '@prisma/client';
import { afterAll, beforeAll, expect, test } from 'vitest';

beforeAll(async () => {
  await prisma.tag.deleteMany({});
});

test('GET /tags', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const createdTags = (
    await prisma.tag.createManyAndReturn({
      data: [
        {
          userId: user.id,
          name: 'Learning 101',
          color: 'Blue',
        },
        {
          userId: user.id,
          name: 'Learning 201',
          color: 'Red',
        },
      ],
    })
  ).map((tag) => ({
    ...tag,
    createdAt: tag.createdAt.toISOString(),
    updatedAt: tag.updatedAt.toISOString(),
  }));

  const {
    status,
    data: { success, message, data: fetchedTags },
  } = await http.get<Tag[]>({
    path: '/tags?page=1&limit=10',
  });

  expect(status).toBe(200);
  expect(success).toBe(true);
  expect(message).toBe('Tags gathered successfully.');
  expect({
    tags: createdTags,
    total: 2,
  }).toEqual(fetchedTags);
});

afterAll(async () => {
  await prisma.tag.deleteMany({});
});
