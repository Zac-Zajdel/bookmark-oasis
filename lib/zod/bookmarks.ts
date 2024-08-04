import { prisma } from '@/lib/db';
import { AuthUser } from '@/types/auth';
import { z } from 'zod';

export const createBookmarkSchema = (user: AuthUser) => {
  return z
    .object({
      url: z.string().url(),
    })
    .superRefine(async (data, ctx) => {
      const urlExists = await prisma.bookmark.findFirst({
        where: {
          userId: user.id,
          url: data.url,
        },
      });

      if (urlExists) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This URL has already been bookmarked.',
        });
      }
    });
};
