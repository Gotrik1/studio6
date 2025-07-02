
import { playgroundsList } from '@/shared/lib/mock-data/playgrounds';
import PlaygroundDetailsPage from '@/views/playground-details';
import { notFound } from 'next/navigation';

export default function PlaygroundDetailsRoute({ params }: { params: { id: string }}) {
    const playground = playgroundsList.find(p => p.id === params.id);
    if (!playground) {
        notFound();
    }
    return <PlaygroundDetailsPage playground={playground} />;
}
