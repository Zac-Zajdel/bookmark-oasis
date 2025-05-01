import { withAuthManager } from '@/lib/authManager';
import { prisma } from '@/lib/db';
import { createTagSchema, getTagSchema } from '@/lib/zod/tags';
import { OasisResponse } from '@/types/apiHelpers';
import { Prisma, Tag } from '@prisma/client';
import { NextResponse } from 'next/server';

export const GET = withAuthManager(
  async ({
    user,
    searchParams,
  }): Promise<NextResponse<OasisResponse<{ tags: Tag[]; total: number }>>> => {
    const schema = getTagSchema(user);
    const { page, limit, column, order, search, bookmarkId, folderId } =
      await schema.parseAsync({
        page: searchParams.get('page'),
        limit: searchParams.get('limit'),
        column: searchParams.get('column'),
        order: searchParams.get('order'),
        search: searchParams.get('search'),
        bookmarkId: searchParams.get('bookmarkId'),
        folderId: searchParams.get('folderId'),
      });

    const tagWhereInput: Prisma.TagWhereInput = {
      userId: user.id,
      ...(bookmarkId && {
        BookmarkTag: {
          some: {
            bookmarkId: bookmarkId,
          },
        },
      }),
      ...(folderId && {
        FolderTag: {
          some: {
            folderId: folderId,
          },
        },
      }),
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
    };

    const tags = await prisma.tag.findMany({
      where: tagWhereInput,
      orderBy: {
        [column || 'name']: order || 'asc',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const total = await prisma.tag.count({
      where: tagWhereInput,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Tags gathered successfully.',
        data: {
          tags,
          total,
        },
      },
      { status: 200 },
    );
  },
);

export const POST = withAuthManager(
  async ({ user, req }): Promise<NextResponse<OasisResponse<Tag>>> => {
    const schema = createTagSchema(user);
    const { name, color } = await schema.parseAsync(await req.json());

    const createdTag = await prisma.tag.create({
      data: {
        name,
        color,
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Tag was created successfully.',
        data: createdTag,
      },
      { status: 201 },
    );
  },
);
