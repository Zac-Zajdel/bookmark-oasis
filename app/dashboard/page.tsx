'use client';

import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center space-y-10 mt-24">
      <div>ID: {session?.user?.id}</div>
      <div>Name: {session?.user?.name}</div>
    </div>
  );
}
