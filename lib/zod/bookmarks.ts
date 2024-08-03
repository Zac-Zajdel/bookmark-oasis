import { prisma } from '@/lib/db';
import { Session } from 'next-auth';
import { z } from 'zod';

export const createBookmarkSchema = (session: Session) => {
  return z
    .object({
      url: z.string().url(),
    })
    .superRefine(async (data, ctx) => {
      const urlExists = await prisma.bookmark.findFirst({
        where: {
          userId: session.user?.id,
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
