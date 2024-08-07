import { prisma } from '@/lib/db';
import { IntegrationHarness } from '@/tests/utils/integration';
import { OasisTestContext, getSetupData } from '@/tests/utils/setup';
import { Bookmark } from '@prisma/client';
import { afterAll, expect, test } from 'vitest';

test('POST /bookmarks', async (ctx: OasisTestContext) => {
  const setup = await getSetupData();
  ctx.apiToken = setup.apiToken;

  const h = new IntegrationHarness(ctx);
  const { http } = await h.init();

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
      userId: setup.user.id,
      url: 'https://www.youtube.com/',
      title: 'YouTube',
      description:
        'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.',
      imageUrl: 'https://www.youtube.com/img/desktop/yt_1200.png',
      visits: 0,
    }),
  );
});

afterAll(async () => {
  await prisma.bookmark.deleteMany({});
  await prisma.apiToken.deleteMany({});
});