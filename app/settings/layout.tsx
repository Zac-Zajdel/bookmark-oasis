import Navbar from '@/components/ui/navbar';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="min-h-screen">
      <Navbar />
      {children}
    </div>
  );
}
