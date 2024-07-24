import { signOut } from '@/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="flex justify-end p-6">
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button type="submit">Sign Out</button>
        </form>
      </div>
      {children}
    </div>
  );
}
