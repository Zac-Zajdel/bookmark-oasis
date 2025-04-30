import { Tag, User } from '@prisma/client';
import { prisma } from '../../lib/db';

export async function tagSeeder(user: User): Promise<Record<string, Tag>> {
  const tags: Record<string, Tag> = {};

  tags.youtube = await prisma.tag.create({
    data: {
      name: 'YouTube',
      color: 'Red',
      userId: user.id,
    },
  });

  tags.dataStructures = await prisma.tag.create({
    data: {
      name: 'Data Structures',
      color: 'Blue',
      userId: user.id,
    },
  });

  tags.learning = await prisma.tag.create({
    data: {
      name: 'Learning',
      color: 'Green',
      userId: user.id,
    },
  });

  tags.programming = await prisma.tag.create({
    data: {
      name: 'Programming',
      color: 'White',
      userId: user.id,
    },
  });

  return tags;
}
