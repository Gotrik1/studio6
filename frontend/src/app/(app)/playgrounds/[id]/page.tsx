import { getPlaygroundById } from '@/entities/playground/api/playgrounds';
import PlaygroundDetailsPage from '@/views/playground-details';
import { notFound } from 'next/navigation';

export default async function PlaygroundDetailsRoute({ params }: { params: { id: string }}) {
    const playground = await getPlaygroundById(params.id);
    if (!playground) {
        notFound();
    }
    return <PlaygroundDetailsPage playground={playground} />;
}
