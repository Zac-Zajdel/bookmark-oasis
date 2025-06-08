import { prisma } from '@/lib/db';
import { AuthUser } from '@/types/auth';
import { z } from 'zod/v4';

export const createBookmarkTagSchema = (user: AuthUser) => {
  return z
    .object({
      bookmarkId: z.cuid(),
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
          message: 'Bookmark not found.',
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

        const existingAssociation = await prisma.bookmarkTag.findFirst({
          where: {
            bookmarkId: ctx.value.bookmarkId,
            tagId: ctx.value.tagId,
          },
        });

        if (existingAssociation) {
          ctx.issues.push({
            code: 'custom',
            input: ctx.value.tagId,
            message: 'Tag already associated with bookmark.',
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

export const deleteBookmarkTagSchema = (user: AuthUser) => {
  return z
    .object({
      bookmarkId: z.cuid(),
      tagId: z.cuid(),
    })
    .check(async (ctx) => {
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
          message: 'Bookmark not found.',
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
