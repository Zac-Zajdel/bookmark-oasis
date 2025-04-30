import { User } from '@prisma/client';
import { prisma } from '../../lib/db';

export async function userSeeder(): Promise<User> {
  return await prisma.user.findFirstOrThrow({
    where: {
      email: 'zaczajdel213@gmail.com',
    },
  });
}
