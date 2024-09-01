import { parseUrl } from '@/lib/api/bookmarks/utils';
import { withAuthManager } from '@/lib/authManager';
import { prisma } from '@/lib/db';
import { createBookmarkSchema, getBookmarkSchema } from '@/lib/zod/bookmarks';
import { NextResponse } from 'next/server';
import { default as ogs } from 'open-graph-scraper';

export const GET = withAuthManager(async ({ user, searchParams }) => {
  const schema = getBookmarkSchema();
  const { page, limit, search } = await schema.parse({
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    search: searchParams.get('search') ?? '',
  });

  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId: user.id,
      ...(search && {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: (page - 1) * limit,
  });

  const total = await prisma.bookmark.count({
    where: {
      userId: user.id,
      ...(search && {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      }),
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
      title: result.ogTitle || result.ogSiteName || 'Title',
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
