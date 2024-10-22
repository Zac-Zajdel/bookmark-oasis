import { withAuthManager } from '@/lib/authManager';
import { prisma } from '@/lib/db';
import {
  deleteBookmarkSchema,
  patchBookmarkSchema,
  showBookmarkSchema,
  updateBookmarkSchema,
} from '@/lib/zod/bookmarks';
import { OasisResponse } from '@/types/apiHelpers';
import { Bookmark } from '@prisma/client';
import { NextResponse } from 'next/server';

export const GET = withAuthManager(
  async ({ user, params }): Promise<NextResponse<OasisResponse<Bookmark>>> => {
    const schema = showBookmarkSchema(user);
    const { id } = await schema.parseAsync({
      id: params.id,
    });

    const bookmark = await prisma.bookmark.findFirstOrThrow({
      where: {
        id: id,
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Bookmark retrieved.',
        data: bookmark,
      },
      { status: 200 },
    );
  },
);

export const PUT = withAuthManager(
  async ({
    user,
    req,
    params,
  }): Promise<NextResponse<OasisResponse<Bookmark>>> => {
    const schema = updateBookmarkSchema(user);
    const { id, url, title, description, isFavorite, iconName } =
      await schema.parseAsync({
        id: params.id,
        ...(await req.json()),
      });

    const bookmark = await prisma.bookmark.update({
      where: {
        id: id,
        userId: user.id,
      },
      data: {
        url,
        title,
        isFavorite,
        description,
        iconName,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Bookmark updated successfully.',
        data: bookmark,
      },
      { status: 200 },
    );
  },
);

export const PATCH = withAuthManager(
  async ({
    user,
    req,
    params,
  }): Promise<NextResponse<OasisResponse<Bookmark>>> => {
    const schema = patchBookmarkSchema(user);

    const { url, title, description, isFavorite, iconName, visits } =
      await schema.parseAsync({
        id: params.id,
        ...(await req.json()),
      });

    const existingBookmark = (await prisma.bookmark.findUnique({
      where: {
        id: params.id,
        userId: user.id,
      },
    })) as Bookmark;

    const patchedBookmark = await prisma.bookmark.update({
      where: {
        id: params.id,
        userId: user.id,
      },
      data: {
        url: url ?? existingBookmark.url,
        title: title ?? existingBookmark.title,
        isFavorite:
          typeof isFavorite === 'boolean'
            ? isFavorite
            : existingBookmark.isFavorite,
        description: description ?? existingBookmark.description,
        iconName: iconName ?? existingBookmark.iconName,
        visits: visits ?? existingBookmark.visits,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Bookmark updated successfully.',
        data: patchedBookmark,
      },
      { status: 200 },
    );
  },
);

export const DELETE = withAuthManager(
  async ({ user, params }): Promise<NextResponse<OasisResponse>> => {
    const schema = deleteBookmarkSchema(user);
    const { id } = await schema.parseAsync({ id: params.id });

    await prisma.bookmark.delete({
      where: {
        userId: user.id,
        id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Bookmark was removed successfully.',
      },
      { status: 200 },
    );
  },
);
