import { Prisma } from '@prisma/client';

type BaseBookmarkParams = Pick<
  Partial<Prisma.BookmarkCreateInput>,
  'url' | 'title' | 'description'
>;

export type CreateBookmarkParams = BaseBookmarkParams & {
  folderId?: string;
  isManual?: boolean;
};
