import { Folder, User } from '@prisma/client';
import { prisma } from '../../lib/db';

export async function folderSeeder(
  user: User,
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

  folders.learning = await prisma.folder.create({
    data: {
      userId: user.id,
      title: 'Learning',
      description: 'Information to better my knowledge.',
      iconName: 'Brain',
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

  return folders;
}
