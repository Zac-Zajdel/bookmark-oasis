import { prisma } from '@/lib/db';
import { AuthUser } from '@/types/auth';
import { z } from 'zod/v4';

export const deleteUserSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.cuid(),
    })
    .check(async (ctx) => {
      const searchUser = await prisma.user.findFirst({
        where: {
          id: ctx.value.id,
        },
      });

      if (!searchUser || ctx.value.id !== user.id) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value.id,
          message: 'Cannot delete account.',
        });
      }
    });
};
