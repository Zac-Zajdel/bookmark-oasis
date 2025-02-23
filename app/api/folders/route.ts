import { withAuthManager } from '@/lib/authManager';
import { prisma } from '@/lib/db';
import { createFolderSchema, getFoldersSchema } from '@/lib/zod/folders';
import { OasisResponse } from '@/types/apiHelpers';
import { Folder } from '@prisma/client';
import { NextResponse } from 'next/server';

export const GET = withAuthManager(
  async ({
    user,
    searchParams,
  }): Promise<
    NextResponse<OasisResponse<{ folders: Folder[]; total: number }>>
  > => {
    const schema = getFoldersSchema();
    const { page, limit, search } = schema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search') ?? '',
    });

    const folders = await prisma.folder.findMany({
      where: {
        userId: user.id,
        ...(search && {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        }),
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const total = await prisma.folder.count({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Folders gathered successfully.',
        data: {
          folders,
          total,
        },
      },
      { status: 200 },
    );
  },
);

export const POST = withAuthManager(
  async ({ user, req }): Promise<NextResponse<OasisResponse<Folder>>> => {
    const schema = createFolderSchema(user);
    const { title, description, iconName, parentFolderId } =
      await schema.parseAsync(await req.json());

    console.log('hello world');

    const createdFolder = await prisma.folder.create({
      data: {
        title: title,
        description: description,
        iconName: iconName,
        userId: user.id,
        // parentFolderId,
      },
    });

    console.log('hello after');

    return NextResponse.json(
      {
        success: true,
        message: 'Folder was created successfully.',
        data: createdFolder,
      },
      { status: 201 },
    );
  },
);
