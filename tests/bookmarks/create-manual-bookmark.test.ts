import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { Bookmark } from '@prisma/client';
import { afterAll, expect, test } from 'vitest';

test('POST MANUAL /bookmarks', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const {
    status,
    data: { success, message, data: bookmark },
  } = await http.post<Bookmark>({
    path: '/bookmarks',
    body: {
      url: 'https://www.youtube.com/',
      title: 'Youtube',
      description: 'Watch Videos',
      iconName: 'Video',
      isManual: true,
    },
  });

  expect(status).toBe(201);
  expect(success).toBe(true);
  expect(message).toBe('Bookmark was created successfully.');
  expect(bookmark).toEqual(
    expect.objectContaining({
      userId: user.id,
      url: 'https://www.youtube.com/',
      title: 'Youtube',
      description: 'Watch Videos',
      iconName: 'Video',
      visits: 0,
    }),
  );
});

// TODO - Create and associate with folder...

afterAll(async () => {
  await prisma.bookmark.deleteMany({});
});
