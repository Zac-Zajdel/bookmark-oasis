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
    search: z.string().optional(),
  });
};

export const showBookmarkSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.string().cuid(),
    })
    .superRefine(async (data, ctx) => {
      const bookmarkExists = await prisma.bookmark.findFirst({
        where: {
          id: data.id,
          userId: user.id,
        },
      });

      if (!bookmarkExists) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This bookmark does not exist.',
        });
      }
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

export const updateBookmarkSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.string().cuid(),
      url: z.string().url(),
      title: z.string().min(1, { message: 'Title is required' }),
      description: z.string().nullable().optional(),
      isFavorite: z.boolean(),
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
          message: 'This bookmark could not be found.',
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
          message: 'This bookmark could not be found.',
        });
      }
    });
};
