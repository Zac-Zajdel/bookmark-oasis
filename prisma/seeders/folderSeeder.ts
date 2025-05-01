import { Folder, Tag, User } from '@prisma/client';
import { prisma } from '../../lib/db';

export async function folderSeeder(
  user: User,
  tags: Record<string, Tag>,
): Promise<Record<string, Folder>> {
  const folders: Record<string, Folder> = {};

  folders.devOps = await prisma.folder.create({
    data: {
      userId: user.id,
      title: 'DevOps',
      description: 'Services to host and manage projects.',
      iconName: 'Cloud',
    },
  });

  await prisma.folderTag.create({
    data: {
      folderId: folders.devOps.id,
      tagId: tags.dataStructures.id,
    },
  });

  folders.learning = await prisma.folder.create({
    data: {
      userId: user.id,
      title: 'Learning',
      description: 'Information to better my knowledge.',
      iconName: 'Brain',
    },
  });

  await prisma.folderTag.create({
    data: {
      folderId: folders.learning.id,
      tagId: tags.learning.id,
    },
  });

  folders.bookmarkOasis = await prisma.folder.create({
    data: {
      userId: user.id,
      title: 'Bookmark Oasis',
      description: 'Resources to improve this project.',
      iconName: 'Bookmark',
    },
  });

  folders.rust = await prisma.folder.create({
    data: {
      userId: user.id,
      title: 'Rust',
      description: 'Resources to learn Rust.',
      iconName: 'Code',
    },
  });

  await prisma.folderTag.create({
    data: {
      folderId: folders.rust.id,
      tagId: tags.programming.id,
    },
  });

  return folders;
}
