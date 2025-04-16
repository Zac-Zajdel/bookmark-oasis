import SettingsHeader from '@/components/settings/settings-header';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="container mt-10">
      <SettingsHeader />
      <main className="mt-10">{children}</main>
    </div>
  );
}
