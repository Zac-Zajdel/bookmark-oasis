import { withAuthManager } from '@/lib/authManager';
import { prisma } from '@/lib/db';
import { deleteTagSchema, updateTagSchema } from '@/lib/zod/tags';
import { OasisResponse } from '@/types/apiHelpers';
import { Tag } from '@prisma/client';
import { NextResponse } from 'next/server';

export const PUT = withAuthManager(
  async ({ user, req, params }): Promise<NextResponse<OasisResponse<Tag>>> => {
    const schema = updateTagSchema(user);
    const { id, name, color } = await schema.parseAsync({
      id: params.id,
      ...(await req.json()),
    });

    const tag = await prisma.tag.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        name,
        color,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Tag updated successfully.',
        data: tag,
      },
      { status: 200 },
    );
  },
);

export const DELETE = withAuthManager(
  async ({ user, params }): Promise<NextResponse<OasisResponse>> => {
    const schema = deleteTagSchema(user);
    const { id } = await schema.parseAsync({ id: params.id });

    await prisma.tag.delete({
      where: {
        id,
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Tag was removed successfully.',
      },
      { status: 200 },
    );
  },
);
