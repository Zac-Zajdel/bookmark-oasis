import SettingsHeader from '@/components/settings/settings-header';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="container mt-10">
      <SettingsHeader />
      <div className="mt-3.5 border" />
      <main className="mt-8">{children}</main>
    </div>
  );
}
