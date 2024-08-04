import { auth } from '@/auth';
import { AuthUser, WithAuthManagerInterface } from '@/types/auth';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

export const withAuthManager =
  (handler: WithAuthManagerInterface) => async (req: NextRequest) => {
    try {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 403 },
        );
      }

      const user: AuthUser = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      };
      const searchParams = req.nextUrl.searchParams;

      return await handler({ req, user, searchParams });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            success: false,
            message: error.errors?.[0]?.message || 'Invalid data provided',
            error,
          },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: 'A problem has occurred',
          error,
        },
        { status: 500 },
      );
    }
  };
