import { PlaygroundDetails } from '@/widgets/playground-details';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';

export function PlaygroundDetailsPage({ playground }: { playground: Playground }) {
    return <PlaygroundDetails playground={playground} />;
}
