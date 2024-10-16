import { DynamicIcon } from '@/components/dynamic-icon';
import SettingsPage from '@/components/settings/SettingsPage';

export default function Settings() {
  return (
    <div className="container mt-10">
      <DynamicIcon name="Activity" />
      <SettingsPage />
    </div>
  );
}
