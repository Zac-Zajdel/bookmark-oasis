import { auth } from '@/auth';
import { env } from '@/env';
import { NextResponse } from 'next/server';

export default auth((req) => {
  if (req.auth && req.url.includes('/login')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (
    !req.auth &&
    req.url !== env.NEXT_PUBLIC_APP_URL &&
    !req.url.includes('/login')
  ) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
});

export const config = {
  matcher: ['/dashboard', '/login'],
};
