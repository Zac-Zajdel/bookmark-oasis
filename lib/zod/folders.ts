import { prisma } from '@/lib/db';
import { AuthUser } from '@/types/auth';
import { lucideIcons } from '@/types/lucideIcons';
import { z } from 'zod';

export const getFoldersSchema = () => {
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

export const showFolderSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.string().cuid(),
    })
    .superRefine(async (data, ctx) => {
      const folder = await prisma.folder.findFirst({
        where: {
          id: data.id,
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

export const createFolderSchema = (user: AuthUser) => {
  return z
    .object({
      title: z.string().min(3),
      description: z.string().nullable().optional(),
      iconName: z.enum(lucideIcons).nullable().optional(),
      parentFolderId: z.string().cuid().nullable().optional(),
    })
    .superRefine(async (data, ctx) => {
      if (!data.parentFolderId) {
        return;
      }

      const folder = await prisma.folder.findFirst({
        where: {
          id: data.parentFolderId,
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

export const updateFolderSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.string().cuid(),
      title: z.string().trim().min(1, { message: 'Title is required' }),
      description: z.string().nullable().optional(),
      isFavorite: z.boolean(),
      iconName: z.enum(lucideIcons).nullable().optional(),
      parentFolderId: z.string().cuid().nullable().optional(),
    })
    .superRefine(async (data, ctx) => {
      if (!data.parentFolderId) {
        return;
      }

      const folder = await prisma.folder.findFirst({
        where: {
          id: data.parentFolderId,
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

export const deleteFolderSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.string().cuid(),
    })
    .superRefine(async (data, ctx) => {
      const folder = await prisma.folder.findFirst({
        where: {
          id: data.id,
          userId: user.id,
        },
        include: {
          _count: {
            select: {
              subFolders: true,
            },
          },
        },
      });

      if (!folder) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This folder does not exist.',
        });
      }

      if (folder && folder._count.subFolders > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This folder has subfolders and cannot be deleted.',
        });
      }
    });
};
