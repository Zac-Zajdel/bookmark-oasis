import { prisma } from '@/lib/db';
import { AuthUser } from '@/types/auth';
import { lucideIcons } from '@/types/lucideIcons';
import { z } from 'zod';

export const getBookmarkSchema = (user: AuthUser) => {
  return z
    .object({
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
      folderId: z.string().cuid().optional().nullable(),
    })
    .superRefine(async (data, ctx) => {
      if (!data.folderId) return;

      const folder = await prisma.folder.findFirst({
        where: {
          id: data.folderId,
          userId: user.id,
        },
      });

      if (!folder) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This folder does not exist.',
        });
      }
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
      title: z.string().optional(),
      description: z.string().nullable().optional(),
      iconName: z.enum(lucideIcons).nullable().optional(),
      isManual: z.boolean().optional(),
    })
    .refine((data) => !data.isManual || (data.isManual && data.title), {
      message: 'Title is required',
      path: ['title'],
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
      iconName: z.enum(lucideIcons).nullable().optional(),
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

export const patchBookmarkSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.string().cuid(),
      url: z.string().url().optional(),
      title: z.string().min(1, { message: 'Title is required' }).optional(),
      description: z.string().nullable().optional(),
      isFavorite: z.boolean().optional(),
      visits: z.number().optional(),
      iconName: z.enum(lucideIcons).nullable().optional(),
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
