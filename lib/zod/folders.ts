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

      const folderExists = await prisma.folder.findFirst({
        where: {
          id: data.parentFolderId,
          userId: user.id,
        },
      });

      if (!folderExists) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This folder does not exist.',
        });
      }
    });
};
