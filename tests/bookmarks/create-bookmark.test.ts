import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { Bookmark } from '@prisma/client';
import { afterAll, expect, test } from 'vitest';

// TODO - Rename this to automatic and create one for manual
test('POST /bookmarks', async (ctx: OasisTestContext) => {
  const { user } = getSetupData();
  const { http } = await new IntegrationHarness(ctx).init();

  const {
    status,
    data: { success, message, data: bookmark },
  } = await http.post<Bookmark>({
    path: '/bookmarks',
    body: {
      url: 'https://www.youtube.com/',
    },
  });

  expect(status).toBe(201);
  expect(success).toBe(true);
  expect(message).toBe('Bookmark was created successfully.');
  expect(bookmark).toEqual(
    expect.objectContaining({
      userId: user.id,
      url: 'https://www.youtube.com/',
      title: 'YouTube',
      description:
        'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.',
      visits: 0,
    }),
  );
});

afterAll(async () => {
  await prisma.bookmark.deleteMany({});
});
