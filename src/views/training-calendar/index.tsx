import { TrainingCalendar } from '@/widgets/training-calendar';

export function TrainingCalendarPage() {
    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Календарь тренировок</h1>
                <p className="text-muted-foreground">
                    Визуализируйте свой тренировочный план, отслеживайте прогресс и планируйте будущие сессии.
                </p>
            </div>
            <TrainingCalendar />
        </div>
    );
}
