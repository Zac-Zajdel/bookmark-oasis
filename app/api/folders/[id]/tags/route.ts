import { withAuthManager } from '@/lib/authManager';
import { prisma } from '@/lib/db';
import {
  createFolderTagSchema,
  deleteFolderTagSchema,
} from '@/lib/zod/folderTags';
import { OasisResponse } from '@/types/apiHelpers';
import { FolderTag, Tag } from '@prisma/client';
import { NextResponse } from 'next/server';

export const POST = withAuthManager(
  async ({
    user,
    req,
    params,
  }): Promise<NextResponse<OasisResponse<{ tag: Tag; pivot: FolderTag }>>> => {
    const schema = createFolderTagSchema(user);

    const { folderId, tagId, tagName, tagColor } = await schema.parseAsync({
      folderId: params.id,
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

    const folderTag = await prisma.folderTag.create({
      data: {
        tagId: finalTagId,
        folderId,
      },
      include: {
        tag: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Tag was associated with folder successfully.',
        data: {
          tag: folderTag.tag,
          pivot: folderTag,
        },
      },
      { status: 201 },
    );
  },
);

export const DELETE = withAuthManager(
  async ({ user, req, params }): Promise<NextResponse<OasisResponse>> => {
    const schema = deleteFolderTagSchema(user);
    const { folderId, tagId } = await schema.parseAsync({
      folderId: params.id,
      ...(await req.json()),
    });

    await prisma.folderTag.delete({
      where: {
        tagId_folderId: {
          tagId,
          folderId,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Folder Tag was removed successfully.',
      },
      { status: 200 },
    );
  },
);
