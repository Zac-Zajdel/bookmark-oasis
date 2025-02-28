import { auth } from '@/auth';
import { hashApiToken } from '@/lib/api/apiTokens/utils';
import { prisma } from '@/lib/db';
import { logger } from '@/logger';
import { AuthUser, WithAuthManagerInterface } from '@/types/auth';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

export const withAuthManager =
  (handler: WithAuthManagerInterface) =>
  async (
    req: NextRequest,
    { params = {} }: { params: Record<string, string> | undefined },
  ) => {
    try {
      let user: AuthUser | null = null;
      const authorizationHeader = req.headers.get('Authorization');

      // User is using external API token.
      if (authorizationHeader) {
        const userPassedToken = authorizationHeader.replace('Bearer ', '');
        const externalDatabaseToken = await hashApiToken(userPassedToken);

        const authUser = await prisma.user.findFirst({
          where: {
            apiToken: {
              some: {
                token: externalDatabaseToken,
              },
            },
          },
        });

        if (!authUser) {
          return NextResponse.json(
            { success: false, error: 'Unauthorized: Invalid API Token' },
            { status: 403 },
          );
        }

        await prisma.apiToken.update({
          where: {
            token: externalDatabaseToken,
            userId: authUser.id,
          },
          data: {
            lastUsed: new Date(),
          },
        });

        user = {
          id: authUser.id,
          name: authUser.name,
          email: authUser.email,
        };
      } else {
        const session = await auth();
        if (!session?.user?.id) {
          return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 403 },
          );
        }

        user = {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
        };
      }

      const searchParams = req.nextUrl.searchParams;
      return await handler({ req, user, searchParams, params });
    } catch (error) {
      if ((error as any)?.result?.error === '403 Forbidden') {
        return NextResponse.json(
          {
            success: false,
            message:
              'This website has restricted access to its metadata. Please create your bookmark manually.',
          },
          { status: 403 },
        );
      }

      if (error instanceof z.ZodError) {
        const message = error.errors?.[0]?.message || 'Invalid data provided';

        logger.error('Zod Error', { message, error });

        return NextResponse.json(
          {
            success: false,
            message: error.errors?.[0]?.message || 'Invalid data provided',
            error,
          },
          { status: 400 },
        );
      } else if (error instanceof Error) {
        logger.error('API Error', {
          error: error.message,
          stack: error.stack,
        });
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
