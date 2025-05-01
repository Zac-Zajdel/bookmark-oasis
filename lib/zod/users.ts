import { prisma } from '@/lib/db';
import { AuthUser } from '@/types/auth';
import { z } from 'zod';

export const deleteUserSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.string().cuid(),
    })
    .superRefine(async (data, ctx) => {
      const searchUser = await prisma.user.findFirst({
        where: {
          id: data.id,
        },
      });

      if (!searchUser || data.id !== user.id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Cannot delete account.',
        });
      }
    });
};
