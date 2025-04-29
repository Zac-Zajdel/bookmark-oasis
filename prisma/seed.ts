import { User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { hashApiToken } from '../lib/api/apiTokens/utils';
import { prisma } from '../lib/db';

// TODO - Start to break this out into designated seeder files.
async function main() {
  try {
    const user = await seedUser();
    await seedBookmarksAndFolders(user);
    await seedTags(user);
    await seedExternalApiToken(user);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}

async function seedUser(): Promise<User> {
  return await prisma.user.findFirstOrThrow({
    where: {
      email: 'zaczajdel213@gmail.com',
    },
  });
}

async function seedBookmarksAndFolders(user: User): Promise<void> {
  const devOpsFolder = await prisma.folder.create({
    data: {
      userId: user.id,
      title: 'DevOps',
      description: 'Services to host and manage projects.',
      iconName: 'Cloud',
    },
  });

  await prisma.bookmark.create({
    data: {
      userId: user.id,
      folderId: devOpsFolder.id,
      url: 'https://vercel.com/',
      title: 'Vercel',
      description:
        "Vercel's Frontend Cloud gives developers the frameworks, workflows, and infrastructure to build a faster, more personalized web.",
      imageUrl:
        'https://assets.vercel.com/image/upload/front/favicon/vercel/57x57.png',
    },
  });

  const learningFolder = await prisma.folder.create({
    data: {
      userId: user.id,
      title: 'Learning',
      description: 'Information to better my knowledge.',
      iconName: 'Brain',
    },
  });

  const tagLearning = await prisma.tag.create({
    data: {
      name: 'YouTube',
      color: 'Red',
      userId: user.id,
    },
  });

  const youtubeBookmark = await prisma.bookmark.create({
    data: {
      userId: user.id,
      folderId: learningFolder.id,
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
      tagId: tagLearning.id,
    },
  });

  const bookmarkOasisFolder = await prisma.folder.create({
    data: {
      userId: user.id,
      title: 'Bookmark Oasis',
      description: 'Resources to improve this project.',
      iconName: 'Bookmark',
    },
  });

  await prisma.bookmark.create({
    data: {
      userId: user.id,
      folderId: bookmarkOasisFolder.id,
      url: 'https://lucide.dev/icons/',
      title: 'Lucide Icons',
      description: 'Beautiful & consistent icon toolkit made by the community.',
      iconName: 'PaintBucket',
    },
  });

  const rustFolder = await prisma.folder.create({
    data: {
      userId: user.id,
      title: 'Rust',
      description: 'Slowly learning the complexities of Rust.',
      iconName: 'Code',
    },
  });

  const bookmarkRustBook = await prisma.bookmark.create({
    data: {
      userId: user.id,
      folderId: rustFolder.id,
      url: 'https://doc.rust-lang.org/stable/book/title-page.html',
      title: 'The Rust Book',
      description: 'Official resource to learn Rust.',
      iconName: 'Book',
    },
  });

  const tagRust = await prisma.tag.create({
    data: {
      name: 'Rust',
      color: 'Orange',
      userId: user.id,
    },
  });

  await prisma.bookmarkTag.create({
    data: {
      bookmarkId: bookmarkRustBook.id,
      tagId: tagRust.id,
    },
  });
}

async function seedTags(user: User): Promise<void> {
  await prisma.tag.createMany({
    data: [
      { name: 'Data Structures', color: 'Blue', userId: user.id },
      { name: 'Learning', color: 'Green', userId: user.id },
      { name: 'Programming', color: 'White', userId: user.id },
    ],
  });
}

async function seedExternalApiToken(user: User): Promise<void> {
  const apiToken = randomBytes(32).toString('hex');

  // Generate SHA-256 token for database storage.
  const hashedApiToken = hashApiToken(apiToken);

  await prisma.apiToken.create({
    data: {
      userId: user.id,
      name: `API Token - ${randomBytes(5).toString('hex').toString()}`,
      token: hashedApiToken,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
