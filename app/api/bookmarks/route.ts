import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { default as ogs } from 'open-graph-scraper';
import { z } from 'zod';

const createBookmarkSchema = z.object({
  url: z.string().url(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 403 },
    );

  try {
    const { url } = createBookmarkSchema.parse(await req.json());

    const urlExists = await prisma.bookmark.findFirst({
      where: {
        userId: session.user?.id,
        url: url,
      },
    });

    if (urlExists) {
      return NextResponse.json(
        { success: false, message: 'This URL has already been bookmarked.' },
        { status: 409 },
      );
    }

    const { result } = await ogs({ url });

    const response = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        url: url,
        title: result.ogTitle || 'Title',
        description: result.ogDescription,
        imageUrl: result.requestUrl,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Bookmark was created successfully.',
      data: {
        title: result.ogTitle,
        description: result.ogDescription,
        url: result.requestUrl,
        image: result.ogImage?.[0]?.url ?? null,
      },
    });
  } catch (error) {
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
