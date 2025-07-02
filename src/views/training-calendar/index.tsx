
import { TrainingCalendar } from '@/widgets/training-calendar';
import { TrainingProposalsWidget } from '@/widgets/training-proposals';

export function TrainingCalendarPage() {
    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Календарь</h1>
                <p className="text-muted-foreground">
                    Визуализируйте свой план тренировок и матчей, отслеживайте прогресс и планируйте будущие сессии.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <TrainingCalendar />
                </div>
                <div className="lg:col-span-1">
                     <TrainingProposalsWidget />
                </div>
            </div>
        </div>
    );
}
