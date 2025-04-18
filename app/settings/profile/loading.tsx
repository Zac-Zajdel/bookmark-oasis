import { SectionHeader } from '@/components/ui/section-header';

export default function Loading() {
  return (
    <div className="container mt-10">
      <div className="mt-10 flex flex-col">
        <SectionHeader
          title="Profile"
          description="Update your personal details here."
        />
      </div>
    </div>
  );
}
