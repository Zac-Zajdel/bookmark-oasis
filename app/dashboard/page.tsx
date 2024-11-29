'use client';

import { DashboardFavorites } from '@/components/dashboard/dashboard-favorites';
import { DashboardRecents } from '@/components/dashboard/dashboard-recents';

export default function Dashboard() {
  return (
    <div className="container mt-10 flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex-col">
          <h1 className="pb-1 text-2xl font-medium">Good Evening Zac,</h1>
        </div>
      </div>

      {/* Make into vertical cards which are tables? */}

      <div className="mb-10">
        <DashboardFavorites />
      </div>
      <div>
        <DashboardRecents />
      </div>
    </div>
  );
}
