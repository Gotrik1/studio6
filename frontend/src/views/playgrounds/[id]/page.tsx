
import { getPlaygroundById } from '@/entities/playground/api/playgrounds';
import { getPlaygroundCondition } from '@/entities/playground/api/condition';
import PlaygroundDetailsPage from '@/views/playground-details';
import { notFound } from 'next/navigation';
import type { Playground } from '@/entities/playground/model/types';
import type { PlaygroundConditionReport } from '@/entities/playground/api/condition';

export default async function PlaygroundDetailsRoute({ params }: { params: { id: string }}) {
    const [playground, conditionReport] = await Promise.all([
        getPlaygroundById(params.id),
        getPlaygroundCondition(params.id),
    ]);

    if (!playground) {
        notFound();
    }
    return <PlaygroundDetailsPage playground={playground as Playground} initialConditionReport={conditionReport} />;
}
