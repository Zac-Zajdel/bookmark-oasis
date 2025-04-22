import { Prisma } from '@prisma/client';

export type CreateFolderParams = Pick<
  Partial<Prisma.FolderCreateInput>,
  'title' | 'description'
>;
