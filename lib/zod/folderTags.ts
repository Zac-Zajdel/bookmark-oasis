import { prisma } from '@/lib/db';
import { AuthUser } from '@/types/auth';
import { z } from 'zod/v4';

export const createFolderTagSchema = (user: AuthUser) => {
  return z
    .object({
      folderId: z.cuid(),
      tagId: z.cuid().optional(),
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
    .check(async (ctx) => {
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
          message: 'Folder not found.',
        });
      }

      if (ctx.value.tagId) {
        const tag = await prisma.tag.findFirst({
          where: {
            id: ctx.value.tagId,
            userId: user.id,
          },
        });

        if (!tag) {
          ctx.issues.push({
            code: 'custom',
            input: ctx.value.tagId,
            message: 'Tag not found.',
          });
        }

        const existingAssociation = await prisma.folderTag.findFirst({
          where: {
            folderId: ctx.value.folderId,
            tagId: ctx.value.tagId,
          },
        });

        if (existingAssociation) {
          ctx.issues.push({
            code: 'custom',
            input: ctx.value.tagId,
            message: 'Tag already associated with folder.',
          });
        }
      }

      if (ctx.value.tagName) {
        const tag = await prisma.tag.findFirst({
          where: {
            name: ctx.value.tagName,
            userId: user.id,
          },
        });

        if (tag) {
          ctx.issues.push({
            code: 'custom',
            input: ctx.value.tagName,
            message: 'Tag name must be unique.',
          });
        }
      }
    });
};

export const deleteFolderTagSchema = (user: AuthUser) => {
  return z
    .object({
      folderId: z.cuid(),
      tagId: z.cuid(),
    })
    .check(async (ctx) => {
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
          message: 'Folder not found.',
        });
      }

      if (ctx.value.tagId) {
        const tag = await prisma.tag.findFirst({
          where: {
            id: ctx.value.tagId,
            userId: user.id,
          },
        });

        if (!tag) {
          ctx.issues.push({
            code: 'custom',
            input: ctx.value.tagId,
            message: 'Tag not found.',
          });
        }
      }
    });
};
