import { prisma } from '@/lib/db';
import { AuthUser } from '@/types/auth';
import { lucideIcons } from '@/types/lucideIcons';
import { z } from 'zod/v4';

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
      .refine((val) => val >= 1, {
        message: 'limit cannot be less than 1',
      }),
    search: z.string().optional(),
  });
};

export const showFolderSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.cuid(),
    })
    .check(async (ctx) => {
      const folder = await prisma.folder.findFirst({
        where: {
          id: ctx.value.id,
          userId: user.id,
        },
      });

      if (!folder) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value.id,
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
      parentFolderId: z.cuid().nullable().optional(),
    })
    .check(async (ctx) => {
      if (!ctx.value.parentFolderId) {
        return;
      }

      const folder = await prisma.folder.findFirst({
        where: {
          id: ctx.value.parentFolderId,
          userId: user.id,
        },
      });

      if (!folder) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value.parentFolderId,
          message: 'This folder does not exist.',
        });
      }
    });
};

export const updateFolderSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.cuid(),
      title: z.string().trim().min(1, { error: 'Title is required' }),
      description: z.string().nullable().optional(),
      isFavorite: z.boolean(),
      iconName: z.enum(lucideIcons).nullable().optional(),
      parentFolderId: z.cuid().nullable().optional(),
    })
    .check(async (ctx) => {
      if (!ctx.value.parentFolderId) {
        return;
      }

      const folder = await prisma.folder.findFirst({
        where: {
          id: ctx.value.parentFolderId,
          userId: user.id,
        },
      });

      if (!folder) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value.parentFolderId,
          message: 'This folder does not exist.',
        });
      }
    });
};

export const deleteFolderSchema = (user: AuthUser) => {
  return z
    .object({
      id: z.cuid(),
      keepBookmarks: z.boolean().optional(),
    })
    .check(async (ctx) => {
      const folder = await prisma.folder.findFirst({
        where: {
          id: ctx.value.id,
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
        ctx.issues.push({
          code: 'custom',
          input: ctx.value.id,
          message: 'This folder does not exist.',
        });
      }

      if (folder && folder._count.subFolders > 0) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value.id,
          message: 'This folder has subfolders and cannot be deleted.',
        });
      }
    });
};
