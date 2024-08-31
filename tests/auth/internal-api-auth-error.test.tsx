import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext } from '@/tests/utils/setup';
import { expect, test } from 'vitest';

test('INTERNAL API AUTH ERROR', async (ctx: OasisTestContext) => {
  const { http } = await new IntegrationHarness(ctx, true).init();

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
