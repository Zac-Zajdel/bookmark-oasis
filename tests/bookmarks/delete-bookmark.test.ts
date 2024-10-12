import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { afterAll, beforeAll, expect, test } from 'vitest';

beforeAll(async () => {
  await prisma.bookmark.deleteMany({});
});

test('DELETE /bookmarks', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const bookmark = await prisma.bookmark.create({
    data: {
      userId: user.id,
      url: 'https://www.youtube.com/',
      title: 'Youtube',
    },
  });

  const {
    status,
    data: { success, message },
  } = await http.delete({
    path: `/bookmarks/${bookmark.id}`,
  });

  expect(status).toBe(200);
  expect(success).toBe(true);
  expect(message).toBe('Bookmark was removed successfully.');
});

afterAll(async () => {
  await prisma.bookmark.deleteMany({});
});
