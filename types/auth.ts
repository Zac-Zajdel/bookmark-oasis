import { NextRequest } from 'next/server';

export type AuthUser = {
  id: string;
  name: string | null | undefined;
  email: string | null | undefined;
};

export interface WithAuthManagerInterface {
  ({
    req,
    user,
    params,
    searchParams,
  }: {
    req: NextRequest;
    user: AuthUser;
    params: any;
    searchParams: URLSearchParams;
  }): Promise<Response>;
}
