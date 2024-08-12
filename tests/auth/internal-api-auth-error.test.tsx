import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext } from '@/tests/utils/setup';
import { afterAll, expect, test } from 'vitest';

test('INTERNAL API AUTH ERROR', async (ctx: OasisTestContext) => {
  const h = new IntegrationHarness(ctx);
  const { http } = await h.init();

  const {
    status,
    data: { success, error },
  } = await http.post<string>({
    path: '/tokens',
    body: {
      name: 'Good luck :)',
    },
  });

  expect(status).toBe(403);
  expect(success).toBe(false);
  expect(error).toBe('Unauthorized');
});

afterAll(async () => {
  await prisma.apiToken.deleteMany({});
});
