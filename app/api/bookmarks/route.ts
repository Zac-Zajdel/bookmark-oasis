import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { default as ogs } from 'open-graph-scraper';
import { z } from 'zod';

const createBookmarkSchema = z.object({
  url: z.string().url(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 403 },
    );

  try {
    const { url } = createBookmarkSchema.parse(await req.json());

    const { result } = await ogs({ url });

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
