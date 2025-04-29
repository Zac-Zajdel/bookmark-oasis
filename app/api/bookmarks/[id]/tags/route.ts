import { withAuthManager } from '@/lib/authManager';
import { prisma } from '@/lib/db';
import {
  createBookmarkTagSchema,
  deleteBookmarkTagSchema,
  getBookmarkTagSchema,
} from '@/lib/zod/bookmarkTags';
import { OasisResponse } from '@/types/apiHelpers';
import { BookmarkTag, Tag } from '@prisma/client';
import { NextResponse } from 'next/server';

export const GET = withAuthManager(
  async ({
    user,
    searchParams,
  }): Promise<NextResponse<OasisResponse<{ tags: Tag[] }>>> => {
    const schema = getBookmarkTagSchema(user);
    const { search, bookmarkId } = schema.parse({
      bookmarkId: searchParams.get('bookmarkId'),
    });

    const bookmarkTags = await prisma.bookmarkTag.findMany({
      where: {
        bookmarkId,
        ...(search && {
          tag: {
            name: { contains: search, mode: 'insensitive' },
          },
        }),
      },
      include: {
        tag: true,
      },
    });

    const tags = bookmarkTags.map((bt) => bt.tag);

    return NextResponse.json(
      {
        success: true,
        message: 'Bookmark tags gathered successfully.',
        data: {
          tags,
        },
      },
      { status: 200 },
    );
  },
);

export const POST = withAuthManager(
  async ({
    user,
    req,
    params,
  }): Promise<
    NextResponse<OasisResponse<{ tag: Tag; pivot: BookmarkTag }>>
  > => {
    const schema = createBookmarkTagSchema(user);

    const { bookmarkId, tagId, tagName, tagColor } = await schema.parseAsync({
      bookmarkId: params.id,
      ...(await req.json()),
    });

    const finalTagId =
      tagId ||
      (
        await prisma.tag.create({
          select: {
            id: true,
          },
          data: {
            name: tagName as string,
            color: tagColor,
            userId: user.id,
          },
        })
      ).id;

    const bookmarkTag = await prisma.bookmarkTag.create({
      data: {
        tagId: finalTagId,
        bookmarkId,
      },
      include: {
        tag: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Tag was associated with bookmark successfully.',
        data: {
          tag: bookmarkTag.tag,
          pivot: bookmarkTag,
        },
      },
      { status: 201 },
    );
  },
);

export const DELETE = withAuthManager(
  async ({ user, req, params }): Promise<NextResponse<OasisResponse>> => {
    const schema = deleteBookmarkTagSchema(user);
    const { bookmarkId, tagId } = await schema.parseAsync({
      bookmarkId: params.id,
      ...(await req.json()),
    });

    await prisma.bookmarkTag.delete({
      where: {
        tagId_bookmarkId: {
          tagId,
          bookmarkId,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Bookmark Tag was removed successfully.',
      },
      { status: 200 },
    );
  },
);
