import { prisma } from '@/lib/db';
import { AuthUser } from '@/types/auth';
import { z } from 'zod';

export const getApiTokenSchema = () => {
  return z.object({
    page: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => val >= 1, { message: 'page cannot be less than 1' }),
    limit: z
      .enum(['10', '20', '30', '40', '50'])
      .transform((val) => parseInt(val))
      .refine((val) => val >= 10, { message: 'limit cannot be less than 10' }),
    column: z.enum(['name', 'lastUsed', 'createdAt']).nullable().optional(),
    order: z.enum(['desc', 'asc']).nullable().optional(),
    search: z.string().nullable(),
  });
};

export const createApiTokenSchema = () => {
  return z.object({
    name: z.string().min(1, { message: 'Name is required' }),
  });
};

export const deleteApiTokenSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.string().cuid(),
    })
    .superRefine(async (data, ctx) => {
      const tokenExists = await prisma.apiToken.findFirst({
        where: {
          userId: user.id,
          id: data.id,
        },
      });

      if (!tokenExists) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This API Token could not be found.',
        });
      }
    });
};
