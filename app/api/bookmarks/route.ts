import { withAuthManager } from '@/lib/authManager';
import { prisma } from '@/lib/db';
import { createBookmarkSchema } from '@/lib/zod/bookmarks';
import { NextResponse } from 'next/server';
import { default as ogs } from 'open-graph-scraper';

export const POST = withAuthManager(async ({ req, user }) => {
  const schema = createBookmarkSchema(user);
  const { url } = await schema.parseAsync(await req.json());

  const { result } = await ogs({ url });

  const createdBookmark = await prisma.bookmark.create({
    data: {
      userId: user.id,
      url: result.ogUrl || url,
      title: result.ogTitle || 'Title',
      description: result.ogDescription,
      imageUrl: result.ogImage?.[0]?.url || null, // TODO - Need to validate this is an actual URL
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: 'Bookmark was created successfully.',
      data: createdBookmark,
    },
    { status: 201 },
  );
});
