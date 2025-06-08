import { prisma } from '@/lib/db';
import { AuthUser } from '@/types/auth';
import { User } from 'next-auth';
import { z } from 'zod/v4';

export const getApiTokenSchema = () => {
  return z.object({
    page: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => val >= 1, { error: 'page cannot be less than 1' }),
    limit: z
      .enum(['10', '20', '30', '40', '50'])
      .transform((val) => parseInt(val))
      .refine((val) => val >= 10, { error: 'limit cannot be less than 10' }),
    column: z.enum(['name', 'lastUsed', 'createdAt']).nullable().optional(),
    order: z.enum(['desc', 'asc']).nullable().optional(),
    search: z.string().nullable(),
  });
};

export const createApiTokenSchema = (user: User) => {
  return z
    .object({
      name: z.string().min(1, { error: 'Name is required' }),
    })
    .check(async (ctx) => {
      const hasSameTokenName = await prisma.apiToken.findFirst({
        where: {
          userId: user.id,
          name: ctx.value.name,
        },
      });

      if (hasSameTokenName) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value.name,
          message: 'API Token names must be unique.',
        });
      }
    });
};

export const deleteApiTokenSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.cuid(),
    })
    .check(async (ctx) => {
      const tokenExists = await prisma.apiToken.findFirst({
        where: {
          userId: user.id,
          id: ctx.value.id,
        },
      });

      if (!tokenExists) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value.id,
          message: 'This API Token could not be found.',
        });
      }
    });
};
