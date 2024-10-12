import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { ApiToken } from '@prisma/client';
import { expect, test } from 'vitest';

test('GET /tokens', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const {
    status,
    data: { success, message, data: fetchedApiTokens },
  } = await http.get<ApiToken[]>({
    path: '/tokens?page=1&limit=10',
  });

  const apiTokens = (
    await prisma.apiToken.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        name: 'asc',
      },
      take: 10,
      skip: 0,
    })
  ).map((token) => ({
    ...token,
    lastUsed: token.lastUsed ? token.lastUsed.toISOString() : null,
    createdAt: token.createdAt.toISOString(),
    updatedAt: token.updatedAt.toISOString(),
  }));

  const total = await prisma.apiToken.count({
    where: {
      userId: user.id,
    },
  });

  expect(status).toBe(200);
  expect(success).toBe(true);
  expect(message).toBe('API Tokens gathered successfully.');
  expect({
    apiTokens,
    total,
  }).toEqual(fetchedApiTokens);
});
