import { User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { hashApiToken } from '../../lib/api/apiTokens/utils';
import { prisma } from '../../lib/db';

export async function apiTokenSeeder(user: User): Promise<void> {
  const apiToken = randomBytes(32).toString('hex');
  const hashedApiToken = hashApiToken(apiToken);

  await prisma.apiToken.create({
    data: {
      userId: user.id,
      name: `API Token - ${randomBytes(5).toString('hex')}`,
      token: hashedApiToken,
    },
  });
}
