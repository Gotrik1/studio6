
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Loader2, Sparkles, Trophy, Gamepad2, Calendar as CalendarIcon, Wand2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { generateTournamentDetails } from '@/ai/flows/generate-tournament-details-flow';
import { generateTournamentImage } from '@/ai/flows/generate-tournament-image-flow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { teamSports, individualSports } from '@/lib/mock-data/sports';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ru } from 'date-fns/locale';

const allGames = [...teamSports, ...individualSports].sort((a, b) => a.name.localeCompare(b.name));

export default function NewTournamentPage() {
    const { toast } = useToast();

    // Form state
    const [name, setName] = useState('');
    const [game, setGame] = useState('');
    const [prize, setPrize] = useState('');
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [description, setDescription] = useState('');
    
    // AI states
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateDescription = async () => {
        if (!name || !game) {
            setError('Пожалуйста, введите название турнира и выберите игру.');
            return;
        }
        setIsGeneratingDesc(true);
        setError(null);
        try {
            const result = await generateTournamentDetails({ name, game });
            setDescription(result.description);
            toast({ title: 'Описание сгенерировано!', description: 'Вы можете отредактировать его по своему вкусу.' });
        } catch (e) {
            console.error(e);
            setError('Не удалось сгенерировать описание. Попробуйте еще раз.');
        } finally {
            setIsGeneratingDesc(false);
        }
    };
    
    const handleGenerateImage = async () => {
        const imagePrompt = `Epic esports tournament banner for a "${game}" tournament called "${name}". Prize pool: ${prize}. ${description}`;
        
        setIsGeneratingImage(true);
        setError(null);
        try {
            const result = await generateTournamentImage(imagePrompt);
            setGeneratedImage(result.imageDataUri);
        } catch (e) {
            console.error(e);
            setError('Не удалось сгенерировать изображение. Попробуйте другой запрос.');
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleCreateTournament = () => {
        if (!name || !game || !generatedImage) {
            toast({
                variant: 'destructive',
                title: 'Не все готово',
                description: 'Пожалуйста, заполните название, выберите игру и сгенерируйте обложку.',
            });
            return;
        }
        toast({
            title: 'Турнир создан!',
            description: `Турнир "${name}" успешно создан и опубликован.`,
        });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <Trophy className="mx-auto h-12 w-12 text-primary" />
                <h1 className="font-headline text-3xl font-bold tracking-tight">Создание нового турнира</h1>
                <p className="text-muted-foreground">
                    Запустите свое соревнование. Используйте AI для помощи в создании анонса.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Шаг 1: Основная информация</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="tour-name">Название турнира</Label>
                        <Input id="tour-name" placeholder="Например, ProDvor Summer Cup" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tour-game">Игра/Дисциплина</Label>
                        <Select onValueChange={setGame} value={game}>
                           <SelectTrigger id="tour-game">
                               <SelectValue placeholder="Выберите игру" />
                           </SelectTrigger>
                           <SelectContent>
                               {allGames.map(g => <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>)}
                           </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="tour-prize">Призовой фонд</Label>
                        <Input id="tour-prize" placeholder="Например, $5,000 или 'Ценные призы'" value={prize} onChange={e => setPrize(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Дата начала</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !startDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {startDate ? format(startDate, "PPP", { locale: ru }) : <span>Выберите дату</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Шаг 2: Анонс и оформление</CardTitle>
                    <CardDescription>Используйте AI, чтобы сделать ваш турнир привлекательнее.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label htmlFor="tour-desc">Описание турнира</Label>
                        <div className="relative">
                            <Textarea
                                id="tour-desc"
                                placeholder="Расскажите о правилах, формате и других важных деталях..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[120px] pr-12"
                            />
                             <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={handleGenerateDescription} disabled={isGeneratingDesc} title="Сгенерировать с помощью ИИ">
                                {isGeneratingDesc ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="space-y-2">
                             <Label>Обложка турнира</Label>
                             <p className="text-xs text-muted-foreground">Нажмите, чтобы сгенерировать уникальную обложку для вашего события.</p>
                             <Button onClick={handleGenerateImage} disabled={isGeneratingImage} className="w-full">
                                {isGeneratingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                                {isGeneratingImage ? 'Создание...' : 'Сгенерировать обложку'}
                            </Button>
                        </div>
                         <div className="flex flex-col items-center justify-center h-full w-full rounded-md border border-dashed bg-muted/50 p-4 min-h-[150px]">
                            {isGeneratingImage && <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />}
                            {generatedImage && <Image src={generatedImage} alt="Сгенерированная обложка" width={400} height={200} className="rounded-md object-cover aspect-video" />}
                            {!isGeneratingImage && !generatedImage && <p className="text-sm text-muted-foreground text-center">Здесь появится ваша обложка</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Ошибка</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Шаг 3: Публикация</CardTitle>
                    <CardDescription>Проверьте все данные и создайте турнир. Он станет виден всем пользователям.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button size="lg" className="w-full" onClick={handleCreateTournament}>
                        Опубликовать турнир "{name || '...'}"
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
