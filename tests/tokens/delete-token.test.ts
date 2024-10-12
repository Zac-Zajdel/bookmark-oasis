import { hashApiToken } from '@/lib/api/apiTokens/utils';
import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { randomBytes } from 'crypto';
import { expect, test } from 'vitest';

test('DELETE /tokens', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const hex = randomBytes(32).toString('hex');

  const apiToken = await prisma.apiToken.create({
    data: {
      name: `Hello World - ${hex}`,
      userId: user.id,
      token: hashApiToken(hex),
    },
  });

  const {
    status,
    data: { success, message },
  } = await http.delete({
    path: `/tokens/${apiToken.id}`,
  });

  expect(status).toBe(200);
  expect(success).toBe(true);
  expect(message).toBe('API Token was removed successfully.');

  expect(
    await prisma.apiToken.findFirst({
      where: {
        id: apiToken.id,
        userId: user.id,
      },
    }),
  ).toBeNull();
});
