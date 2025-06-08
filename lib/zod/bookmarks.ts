import { prisma } from '@/lib/db';
import { AuthUser } from '@/types/auth';
import { lucideIcons } from '@/types/lucideIcons';
import { z } from 'zod/v4';

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
        .refine((val) => val >= 1, {
          message: 'limit cannot be less than 1',
        }),
      search: z.string().optional(),
      folderId: z.cuid().optional().nullable(),
    })
    .check(async (ctx) => {
      if (!ctx.value.folderId) return;

      const folder = await prisma.folder.findFirst({
        where: {
          id: ctx.value.folderId,
          userId: user.id,
        },
      });

      if (!folder) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value.folderId,
          message: 'This folder does not exist.',
        });
      }
    });
};

export const showBookmarkSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.cuid(),
    })
    .check(async (ctx) => {
      const bookmarkExists = await prisma.bookmark.findFirst({
        where: {
          id: ctx.value.id,
          userId: user.id,
        },
      });

      if (!bookmarkExists) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value.id,
          message: 'This bookmark does not exist.',
        });
      }
    });
};

export const createBookmarkSchema = (user: AuthUser) => {
  return z
    .object({
      url: z.url(),
      title: z.string().optional(),
      description: z.string().nullable().optional(),
      iconName: z.enum(lucideIcons).nullable().optional(),
      isManual: z.boolean().optional(),
      folderId: z.cuid().optional().nullable(),
    })
    .refine((data) => !data.isManual || (data.isManual && data.title), {
      message: 'Title is required',
    })
    .check(async (ctx) => {
      const urlExists = await prisma.bookmark.findFirst({
        where: {
          userId: user.id,
          url: ctx.value.url,
        },
      });

      if (urlExists) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value.url,
          message: 'This URL has already been bookmarked.',
        });
      }

      if (!ctx.value.folderId) return;

      if (ctx.value.folderId) {
        const folder = await prisma.folder.findFirst({
          where: {
            id: ctx.value.folderId,
            userId: user.id,
          },
        });

        if (!folder) {
          ctx.issues.push({
            code: 'custom',
            input: ctx.value.folderId,
            message: 'This folder does not exist.',
          });
        }
      }
    });
};

export const updateBookmarkSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.cuid(),
      url: z.url(),
      title: z.string().min(1, { error: 'Title is required' }),
      description: z.string().nullable().optional(),
      isFavorite: z.boolean(),
      iconName: z.enum(lucideIcons).nullable().optional(),
    })
    .check(async (ctx) => {
      const bookmarkExists = await prisma.bookmark.findFirst({
        where: {
          userId: user.id,
          id: ctx.value.id,
        },
      });

      if (!bookmarkExists) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value.id,
          message: 'This bookmark could not be found.',
        });
      }
    });
};

export const patchBookmarkSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.cuid(),
      url: z.url().optional(),
      title: z.string().min(1, { error: 'Title is required' }).optional(),
      description: z.string().nullable().optional(),
      isFavorite: z.boolean().optional(),
      visits: z.number().optional(),
      iconName: z.enum(lucideIcons).nullable().optional(),
    })
    .check(async (ctx) => {
      const bookmarkExists = await prisma.bookmark.findFirst({
        where: {
          userId: user.id,
          id: ctx.value.id,
        },
      });

      if (!bookmarkExists) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value.id,
          message: 'This bookmark could not be found.',
        });
      }
    });
};

export const deleteBookmarkSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.cuid(),
    })
    .check(async (ctx) => {
      const bookmarkExists = await prisma.bookmark.findFirst({
        where: {
          userId: user.id,
          id: ctx.value.id,
        },
      });

      if (!bookmarkExists) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value.id,
          message: 'This bookmark could not be found.',
        });
      }
    });
};
