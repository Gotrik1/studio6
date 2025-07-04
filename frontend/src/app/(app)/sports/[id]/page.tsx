import { SportDetailsPage } from '@/views/sport-details';
import { sportsList } from '@/shared/lib/mock-data/sports';
import { notFound } from 'next/navigation';

export default function SportDetailsRoute({ params }: { params: { id: string } }) {
    const sport = sportsList.find(s => s.id === params.id);
    if (!sport) {
        notFound();
    }
    return <SportDetailsPage sport={sport} />;
}
