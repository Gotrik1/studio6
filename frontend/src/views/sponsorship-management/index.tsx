"use client";

import { useEffect, useState } from "react";
import { SponsorshipDashboard } from "@/widgets/sponsorship-dashboard";
import { getSponsorshipDashboardData } from "@/entities/sponsorship/api/sponsorship";
import { Skeleton } from "@/shared/ui/skeleton";
import type { SponsorshipDashboardData } from "@/entities/sponsorship/model/types";

export default function SponsorshipManagementPage() {
  const [data, setData] = useState<SponsorshipDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSponsorshipDashboardData().then((fetchedData) => {
      setData(fetchedData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return <SponsorshipDashboard data={data} />;
}
