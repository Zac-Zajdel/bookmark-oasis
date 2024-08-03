import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { createBookmarkSchema } from '@/lib/zod/bookmarks';
import { NextResponse } from 'next/server';
import { default as ogs } from 'open-graph-scraper';
import { z } from 'zod';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 403 },
    );

  try {
    const schema = createBookmarkSchema(session);
    const { url } = await schema.parseAsync(await req.json());

    const { result } = await ogs({ url });

    const createdBookmark = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        url: url,
        title: result.ogTitle || 'Title',
        description: result.ogDescription,
        imageUrl: result.requestUrl,
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors[0]?.message || 'Invalid data provided';
      return NextResponse.json(
        { success: false, message: errorMessage, error },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'A problem occurred trying to create this bookmark.',
        error,
      },
      { status: 500 },
    );
  }
}
