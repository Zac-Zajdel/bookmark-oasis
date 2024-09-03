import { withAuthManager } from '@/lib/authManager';
import { prisma } from '@/lib/db';
import {
  deleteBookmarkSchema,
  updateBookmarkSchema,
} from '@/lib/zod/bookmarks';
import { NextResponse } from 'next/server';

export const PUT = withAuthManager(async ({ user, req, params }) => {
  const schema = updateBookmarkSchema(user);
  const { id, title, description, isFavorite } = await schema.parseAsync({
    id: params.id,
    ...(await req.json()),
  });

  const bookmark = await prisma.bookmark.update({
    where: {
      id: id,
      userId: user.id,
    },
    data: {
      title: title,
      description: description,
      isFavorite: isFavorite,
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
});

export const DELETE = withAuthManager(async ({ user, params }) => {
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
});
