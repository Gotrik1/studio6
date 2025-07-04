import PlaygroundDetailsPage from '@/views/playground-details';
import { getPlaygroundById } from '@/entities/playground/api/playgrounds';
import { notFound } from 'next/navigation';

export default async function PlaygroundDetailsRoute({ params }: { params: { id: string }}) {
    const playground = await getPlaygroundById(params.id);
    if (!playground) {
        notFound();
    }
    return <PlaygroundDetailsPage playground={playground as any} />; // Cast because of slight type mismatch (creator/coverImage)
}
