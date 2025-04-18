import SettingsHeader from '@/components/settings/settings-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Separator } from '@/components/ui/separator';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="container mt-10">
      <SectionHeader
        title="Settings"
        description="Manage your configurations and experience."
      />
      <SettingsHeader />
      <Separator className="my-10" />
      <main>{children}</main>
    </div>
  );
}
