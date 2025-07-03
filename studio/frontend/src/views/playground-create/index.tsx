
import { PlaygroundCreateForm } from '@/widgets/playground-create-form';

export function PlaygroundCreatePage() {
    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2 text-center">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Новое место для тренировок</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Добавьте свою любимую площадку, зал или поле на карту ProDvor.
                </p>
            </div>
            <PlaygroundCreateForm />
        </div>
    );
}
