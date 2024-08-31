import { withAuthManager } from '@/lib/authManager';
import { prisma } from '@/lib/db';
import { deleteBookmarkSchema } from '@/lib/zod/bookmarks';
import { NextResponse } from 'next/server';

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
