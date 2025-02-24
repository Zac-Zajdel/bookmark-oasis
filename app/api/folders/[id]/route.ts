import { withAuthManager } from '@/lib/authManager';
import { prisma } from '@/lib/db';
import {
  deleteFolderSchema,
  showFolderSchema,
  updateFolderSchema,
} from '@/lib/zod/folders';
import { OasisResponse } from '@/types/apiHelpers';
import { Folder } from '@prisma/client';
import { NextResponse } from 'next/server';

export const GET = withAuthManager(
  async ({ user, params }): Promise<NextResponse<OasisResponse<Folder>>> => {
    const schema = showFolderSchema(user);
    const { id } = await schema.parseAsync({
      id: params.id,
    });

    const folder = await prisma.folder.findFirstOrThrow({
      where: {
        id: id,
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Folder retrieved.',
        data: folder,
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
  }): Promise<NextResponse<OasisResponse<Folder>>> => {
    const schema = updateFolderSchema(user);
    const { id, title, description, isFavorite, iconName, parentFolderId } =
      await schema.parseAsync({
        id: params.id,
        ...(await req.json()),
      });

    const folder = await prisma.folder.update({
      where: {
        id: id,
        userId: user.id,
      },
      data: {
        title,
        isFavorite,
        description,
        iconName,
        parentFolderId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Folder updated successfully.',
        data: folder,
      },
      { status: 200 },
    );
  },
);

export const DELETE = withAuthManager(
  async ({ user, params }): Promise<NextResponse<OasisResponse>> => {
    const schema = deleteFolderSchema(user);
    const { id } = await schema.parseAsync({ id: params.id });

    await prisma.folder.delete({
      where: {
        id,
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Folder was removed successfully.',
      },
      { status: 200 },
    );
  },
);
