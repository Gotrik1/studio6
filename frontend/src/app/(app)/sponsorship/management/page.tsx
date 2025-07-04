import { SponsorshipDashboard } from '@/widgets/sponsorship-dashboard';
import { getSponsorshipDashboardData } from '@/entities/sponsorship/api/sponsorship';

export default async function SponsorshipManagementPage() {
    const sponsorshipData = await getSponsorshipDashboardData();
    return <SponsorshipDashboard data={sponsorshipData} />;
}
