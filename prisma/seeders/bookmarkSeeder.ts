import { Folder, Tag, User } from '@prisma/client';
import { prisma } from '../../lib/db';

export async function bookmarkSeeder(
  user: User,
  folders: Record<string, Folder>,
  tags: Record<string, Tag>,
): Promise<void> {
  const vercelBookmark = await prisma.bookmark.create({
    data: {
      userId: user.id,
      folderId: folders.devOps.id,
      url: 'https://vercel.com/',
      title: 'Vercel',
      description:
        "Vercel's Frontend Cloud gives developers the frameworks, workflows, and infrastructure to build a faster, more personalized web.",
      imageUrl:
        'https://assets.vercel.com/image/upload/front/favicon/vercel/57x57.png',
    },
  });

  await prisma.bookmarkTag.create({
    data: {
      bookmarkId: vercelBookmark.id,
      tagId: tags.youtube.id,
    },
  });

  const youtubeBookmark = await prisma.bookmark.create({
    data: {
      userId: user.id,
      folderId: folders.learning.id,
      url: 'https://www.youtube.com/',
      title: 'Youtube',
      description:
        'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.',
      imageUrl: 'https://www.youtube.com/s/desktop/87338098/img/favicon.ico',
    },
  });

  await prisma.bookmarkTag.create({
    data: {
      bookmarkId: youtubeBookmark.id,
      tagId: tags.youtube.id,
    },
  });

  const rustBookmark = await prisma.bookmark.create({
    data: {
      userId: user.id,
      folderId: folders.rust.id,
      url: 'https://www.rust-lang.org/',
      title: 'Rust',
      description:
        'A language empowering everyone to build reliable and efficient software.',
      imageUrl: 'https://www.rust-lang.org/favicon.ico',
    },
  });

  await prisma.bookmarkTag.create({
    data: {
      bookmarkId: rustBookmark.id,
      tagId: tags.programming.id,
    },
  });

  const githubBookmark = await prisma.bookmark.create({
    data: {
      userId: user.id,
      folderId: folders.devOps.id,
      url: 'https://github.com/',
      title: 'GitHub',
      description:
        'Where the world builds software. Millions of developers and companies build, ship, and scale software on GitHub—the largest and most advanced development platform in the world.',
      imageUrl: 'https://github.com/favicon.ico',
    },
  });

  await prisma.bookmarkTag.create({
    data: {
      bookmarkId: githubBookmark.id,
      tagId: tags.programming.id,
    },
  });
}
