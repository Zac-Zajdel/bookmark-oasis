import { hashApiToken } from '@/lib/api/apiTokens/utils';
import { withAuthManager } from '@/lib/authManager';
import { prisma } from '@/lib/db';
import { createApiTokenSchema, getApiTokenSchema } from '@/lib/zod/apiTokens';
import { OasisResponse } from '@/types/apiHelpers';
import { ApiToken } from '@prisma/client';
import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';

export const GET = withAuthManager(
  async ({
    user,
    searchParams,
  }): Promise<
    NextResponse<OasisResponse<{ apiTokens: ApiToken[]; total: number }>>
  > => {
    const schema = getApiTokenSchema();
    const { page, limit, column, order, search } = await schema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      column: searchParams.get('columns'),
      order: searchParams.get('order'),
      search: searchParams.get('search'),
    });

    const apiTokens = await prisma.apiToken.findMany({
      where: {
        userId: user.id,
        ...(search && { name: { contains: search, mode: 'insensitive' } }),
      },
      orderBy: {
        [column || 'name']: order || 'asc',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const total = await prisma.apiToken.count({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'API Tokens gathered successfully.',
        data: {
          apiTokens,
          total,
        },
      },
      { status: 200 },
    );
  },
);

export const POST = withAuthManager(
  async ({ req, user }): Promise<NextResponse<OasisResponse<string>>> => {
    const schema = createApiTokenSchema(user);
    const { name } = await schema.parseAsync(await req.json());

    // Generate a 32-byte token for user to include in API requests.
    const apiToken = randomBytes(32).toString('hex');

    // Generate SHA-256 token for database storage.
    const hashedApiToken = hashApiToken(apiToken);

    await prisma.apiToken.create({
      data: {
        userId: user.id,
        name: name,
        token: hashedApiToken,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Store this API Token in a secure place. You won't be able to retrieve it again later.",
        data: apiToken,
      },
      { status: 201 },
    );
  },
);
