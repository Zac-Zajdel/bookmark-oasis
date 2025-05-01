import { prisma } from '@/lib/db';
import { AuthUser } from '@/types/auth';
import { z } from 'zod';

export const createFolderTagSchema = (user: AuthUser) => {
  return z
    .object({
      folderId: z.string().cuid(),
      tagId: z.string().cuid().optional(),
      tagName: z.string().optional(),
      tagColor: z.string().optional(),
    })
    .refine(
      (data) => {
        // Either tagId exists alone, or both tagName and tagColor exist together
        return (
          (!!data.tagId && !data.tagName && !data.tagColor) ||
          (!data.tagId && !!data.tagName && !!data.tagColor)
        );
      },
      {
        message:
          'Either provide an existing tagId OR both tagName and tagColor',
      },
    )
    .superRefine(async (data, ctx) => {
      const folder = await prisma.folder.findFirst({
        where: {
          id: data.folderId,
          userId: user.id,
        },
      });

      if (!folder) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Folder not found.',
        });
      }

      if (data.tagId) {
        const tag = await prisma.tag.findFirst({
          where: {
            id: data.tagId,
            userId: user.id,
          },
        });

        if (!tag) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Tag not found.',
          });
        }

        const existingAssociation = await prisma.folderTag.findFirst({
          where: {
            folderId: data.folderId,
            tagId: data.tagId,
          },
        });

        if (existingAssociation) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Tag already associated with folder.',
          });
        }
      }

      if (data.tagName) {
        const tag = await prisma.tag.findFirst({
          where: {
            name: data.tagName,
            userId: user.id,
          },
        });

        if (tag) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Tag name must be unique.',
          });
        }
      }
    });
};

export const deleteFolderTagSchema = (user: AuthUser) => {
  return z
    .object({
      folderId: z.string().cuid(),
      tagId: z.string().cuid(),
    })
    .superRefine(async (data, ctx) => {
      const folder = await prisma.folder.findFirst({
        where: {
          id: data.folderId,
          userId: user.id,
        },
      });

      if (!folder) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Folder not found.',
        });
      }

      if (data.tagId) {
        const tag = await prisma.tag.findFirst({
          where: {
            id: data.tagId,
            userId: user.id,
          },
        });

        if (!tag) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Tag not found.',
          });
        }
      }
    });
};
