import { withAuthManager } from '@/lib/authManager';
import { prisma } from '@/lib/db';
import { deleteApiTokenSchema } from '@/lib/zod/apiTokens';
import { OasisResponse } from '@/types/apiHelpers';
import { NextResponse } from 'next/server';

export const DELETE = withAuthManager(
  async ({ user, params }): Promise<NextResponse<OasisResponse>> => {
    const schema = deleteApiTokenSchema(user);
    const { id } = await schema.parseAsync({ id: params.id });

    await prisma.apiToken.delete({
      where: {
        id,
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'API Token was removed successfully.',
      },
      { status: 200 },
    );
  },
);
