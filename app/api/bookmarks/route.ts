import { parseUrl } from '@/lib/api/bookmarks/utils';
import { withAuthManager } from '@/lib/authManager';
import { prisma } from '@/lib/db';
import { createBookmarkSchema } from '@/lib/zod/bookmarks';
import { NextResponse } from 'next/server';
import { default as ogs } from 'open-graph-scraper';

export const GET = withAuthManager(async ({ req, user }) => {
  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';

  const take = parseInt(limit as string);
  const skip = (parseInt(page as string) - 1) * take;

  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take,
    skip,
  });

  const total = await prisma.bookmark.count({
    where: {
      userId: user.id,
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: 'Bookmarks gathered successfully.',
      data: {
        bookmarks,
        total,
      },
    },
    { status: 200 },
  );
});

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
      imageUrl: parseUrl(result.ogImage?.[0]?.url),
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
