import { prisma } from '@/lib/db';
import { AuthUser } from '@/types/auth';
import { colorPickerValues } from '@/types/colorPicker';
import { z } from 'zod/v4';

export const getTagSchema = (user: AuthUser) => {
  return z
    .object({
      page: z
        .string()
        .transform((val) => parseInt(val))
        .refine((val) => val >= 1, { error: 'page cannot be less than 1' }),
      limit: z
        .enum(['10', '20', '30', '40', '50'])
        .transform((val) => parseInt(val))
        .refine((val) => val >= 10, {
          message: 'limit cannot be less than 10',
        }),
      column: z
        .enum(['id', 'name', 'color', 'createdAt'])
        .nullable()
        .optional(),
      order: z.enum(['asc', 'desc']).nullable().optional(),
      search: z.string().nullable(),
      bookmarkId: z.cuid().nullable().optional(),
      folderId: z.cuid().nullable().optional(),
    })
    .check(async (ctx) => {
      if (ctx.value.bookmarkId) {
        const bookmark = await prisma.bookmark.findFirst({
          where: {
            id: ctx.value.bookmarkId,
            userId: user.id,
          },
        });

        if (!bookmark) {
          ctx.issues.push({
            code: 'custom',
            input: ctx.value.bookmarkId,
            message: 'This Bookmark does not exist.',
          });
        }
      }

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
            message: 'This Folder does not exist.',
          });
        }
      }
    });
};

export const createTagSchema = (user: AuthUser) => {
  return z
    .object({
      name: z.string().min(1, { error: 'Name is required' }),
      color: z.enum(colorPickerValues),
    })
    .check(async (ctx) => {
      const tag = await prisma.tag.findFirst({
        where: {
          name: ctx.value.name,
          userId: user.id,
        },
      });

      if (tag) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value.name,
          message: 'Tag names must be unique.',
        });
      }
    });
};

export const updateTagSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.cuid(),
      name: z.string().min(1, { error: 'Name is required' }),
      color: z.enum(colorPickerValues),
    })
    .check(async (ctx) => {
      const tag = await prisma.tag.findFirst({
        where: {
          id: ctx.value.id,
          userId: user.id,
        },
      });

      if (!tag) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value.id,
          message: 'This Tag does not exist.',
        });
      }
    });
};

export const deleteTagSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.cuid(),
    })
    .check(async (ctx) => {
      const tag = await prisma.tag.findFirst({
        where: {
          id: ctx.value.id,
          userId: user.id,
        },
      });

      if (!tag) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value.id,
          message: 'This Tag does not exist.',
        });
      }
    });
};
