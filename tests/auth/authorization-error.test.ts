import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext } from '@/tests/utils/setup';
import { expect, test } from 'vitest';

test('INVALID API TOKEN', async (ctx: OasisTestContext) => {
  ctx.apiToken = 'INVALID API TOKEN';

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
  expect(error).toBe('Unauthorized: Invalid API Token');
});
