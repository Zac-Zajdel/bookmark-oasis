import { prisma } from '@/lib/db';
import { AuthUser } from '@/types/auth';
import { colorPickerValues } from '@/types/colorPicker';
import { z } from 'zod';

export const getTagSchema = (user: AuthUser) => {
  return z
    .object({
      page: z
        .string()
        .transform((val) => parseInt(val))
        .refine((val) => val >= 1, { message: 'page cannot be less than 1' }),
      limit: z
        .enum(['10', '20', '30', '40', '50'])
        .transform((val) => parseInt(val))
        .refine((val) => val >= 10, {
          message: 'limit cannot be less than 10',
        }),
      column: z.enum(['name', 'color', 'createdAt']).nullable().optional(),
      order: z.enum(['asc', 'desc']).nullable().optional(),
      search: z.string().nullable(),
      bookmarkId: z.string().cuid().nullable().optional(),
    })
    .superRefine(async (data, ctx) => {
      if (data.bookmarkId) {
        const bookmark = await prisma.bookmark.findFirst({
          where: {
            id: data.bookmarkId,
            userId: user.id,
          },
        });

        if (!bookmark) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'This Bookmark does not exist.',
          });
        }
      }
    });
};

export const createTagSchema = (user: AuthUser) => {
  return z
    .object({
      name: z.string().min(1, { message: 'Name is required' }),
      color: z.enum(colorPickerValues),
    })
    .superRefine(async (data, ctx) => {
      const tag = await prisma.tag.findFirst({
        where: {
          name: data.name,
          userId: user.id,
        },
      });

      if (tag) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tag names must be unique.',
        });
      }
    });
};

export const updateTagSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.string().cuid(),
      name: z.string().min(1, { message: 'Name is required' }),
      color: z.enum(colorPickerValues),
    })
    .superRefine(async (data, ctx) => {
      const tag = await prisma.tag.findFirst({
        where: {
          id: data.id,
          userId: user.id,
        },
      });

      if (!tag) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This Tag does not exist.',
        });
      }
    });
};

export const deleteTagSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.string().cuid(),
    })
    .superRefine(async (data, ctx) => {
      const tag = await prisma.tag.findFirst({
        where: {
          id: data.id,
          userId: user.id,
        },
      });

      if (!tag) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This Tag does not exist.',
        });
      }
    });
};
