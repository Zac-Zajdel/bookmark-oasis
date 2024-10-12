import { hashApiToken } from '@/lib/api/apiTokens/utils';
import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { randomBytes } from 'crypto';
import { expect, test } from 'vitest';

test('POST /tokens', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const name = `API Test Token - ${randomBytes(10).toString('hex')}`;

  const {
    status,
    data: { success, message, data: token },
  } = await http.post<string>({
    path: '/tokens',
    body: {
      name: name,
    },
  });

  expect(status).toBe(201);
  expect(success).toBe(true);
  expect(token).not.toBeNull();
  expect(message).toBe(
    "Store this API Token in a secure place. You won't be able to retrieve it again later.",
  );

  const generatedApiToken = await prisma.apiToken.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });

  expect(generatedApiToken).toEqual(
    expect.objectContaining({
      userId: user.id,
      name: name,
      token: hashApiToken(token),
      lastUsed: null,
    }),
  );
});
