import { prisma } from '@/lib/db';
import { AuthUser } from '@/types/auth';
import { z } from 'zod';

export const getBookmarkSchema = () => {
  return z.object({
    page: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => val >= 1, {
        message: 'page cannot be less than 1',
      }),
    limit: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => val >= 10, {
        message: 'limit cannot be less than 10',
      }),
  });
};

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

export const deleteBookmarkSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.string().cuid(),
    })
    .superRefine(async (data, ctx) => {
      const bookmarkExists = await prisma.bookmark.findFirst({
        where: {
          userId: user.id,
          id: data.id,
        },
      });

      if (!bookmarkExists) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This bookmark no longer exists. Please refresh.',
        });
      }
    });
};
