import { withAuthManager } from '@/lib/authManager';
import { prisma } from '@/lib/db';
import { deleteUserSchema } from '@/lib/zod/users';
import { OasisResponse } from '@/types/apiHelpers';
import { NextResponse } from 'next/server';

export const DELETE = withAuthManager(
  async ({ user, params }): Promise<NextResponse<OasisResponse>> => {
    const schema = deleteUserSchema(user);
    const { id } = await schema.parseAsync({ id: params.id });

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'User and all associated data was deleted successfully.',
      },
      { status: 200 },
    );
  },
);
