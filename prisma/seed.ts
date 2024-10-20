import { User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { hashApiToken } from '../lib/api/apiTokens/utils';
import { prisma } from '../lib/db';

async function main() {
  const user = await seedUser();
  await seedBookmarks(user);
  await seedExternalApiToken(user);
}

async function seedUser(): Promise<User> {
  return await prisma.user.findFirstOrThrow({
    where: {
      email: 'zaczajdel213@gmail.com',
    },
  });
}

async function seedBookmarks(user: User): Promise<void> {
  await prisma.bookmark.createMany({
    data: [
      {
        userId: user.id,
        url: 'https://www.youtube.com/',
        title: 'Youtube',
        description:
          'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.',
        imageUrl: 'https://www.youtube.com/s/desktop/87338098/img/favicon.ico',
      },
      {
        userId: user.id,
        url: 'https://github.com/',
        title: 'Github',
        description:
          'GitHub is where over 100 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code like a pro, track bugs and fea...',
        imageUrl: 'https://github.githubassets.com/favicons/favicon.svg',
      },
      {
        userId: user.id,
        url: 'https://vercel.com/',
        title: 'Vercel',
        description:
          "Vercel's Frontend Cloud gives developers the frameworks, workflows, and infrastructure to build a faster, more personalized web.",
        imageUrl:
          'https://assets.vercel.com/image/upload/front/favicon/vercel/57x57.png',
      },
      {
        userId: user.id,
        url: 'https://www.curated.design/',
        title: 'Curated Design',
        description:
          'Unleash your creativity with out-of-this-world web design inspiration from across the web.',
        imageUrl:
          'https://cdn.prod.website-files.com/63bd42e1e586a852754fab62/663a8a90b2b88429f565c65c_curated-logo-favicon.png',
      },
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
