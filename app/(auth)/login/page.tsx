import { signIn } from '@/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Login() {
  return (
    <>
      <section className="pt-6">
        <div className="container flex items-center text-center">
          <Link href="/">
            <h1 className="text-xl font-bold">Bookmark Oasis</h1>
          </Link>
        </div>
      </section>
      <section className="container mt-56">
        <div className="flex flex-col justify-center mx-auto">
          <h1 className="text-center text-5xl lg:text-6xl tracking-tight">
            Login To Your Oasis
          </h1>

          <div className="flex flex-col text-center mt-10">
            <form
              action={async () => {
                'use server';
                await signIn('google');
              }}
            >
              <Button
                className="w-80"
                type="submit"
              >
                Continue with Google
              </Button>
            </form>
          </div>

          <div className="flex justify-center items-center pt-10">
            <span className="w-80 border-t" />
          </div>

          <div className="flex justify-center text-center mt-8 text-base">
            <p className="text-muted-foreground">
              Don&apos;t have an account?&nbsp;
            </p>
            <Link
              href="/signup"
              className="font-semibold"
            >
              Sign up
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
