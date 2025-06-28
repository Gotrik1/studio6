'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Loader2, Sparkles, Wand2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { createTeam } from '@/ai/flows/create-team-flow';
import { generateTeamAvatar } from '@/ai/flows/generate-team-avatar-flow';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function NewTeamPage() {
    const { toast } = useToast();
    
    // State for text generation
    const [teamDescription, setTeamDescription] = useState('');
    const [teamName, setTeamName] = useState('');
    const [teamMotto, setTeamMotto] = useState('');
    const [isGeneratingText, setIsGeneratingText] = useState(false);
    
    // State for avatar generation
    const [logoDescription, setLogoDescription] = useState('');
    const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);
    const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
    
    const [error, setError] = useState<string | null>(null);

    const handleGenerateText = async () => {
        if (!teamDescription) {
            setError('Пожалуйста, опишите идею вашей команды.');
            return;
        }
        setIsGeneratingText(true);
        setError(null);
        try {
            const result = await createTeam({ description: teamDescription });
            setTeamName(result.name);
            setTeamMotto(result.motto);
            // Suggest a logo prompt based on the name and description
            setLogoDescription(`логотип для команды '${result.name}', ${teamDescription}`);
        } catch (e) {
            console.error(e);
            setError('Не удалось сгенерировать название и девиз. Попробуйте еще раз.');
        } finally {
            setIsGeneratingText(false);
        }
    };
    
    const handleGenerateAvatar = async () => {
        if (!logoDescription) {
            setError('Пожалуйста, опишите логотип.');
            return;
        }
        setIsGeneratingAvatar(true);
        setError(null);
        try {
            const result = await generateTeamAvatar({ prompt: logoDescription });
            setGeneratedAvatar(result.avatarDataUri);
        } catch (e) {
            console.error(e);
            setError('Не удалось сгенерировать логотип. Попробуйте другой запрос.');
        } finally {
            setIsGeneratingAvatar(false);
        }
    };

    const handleCreateTeam = () => {
        if (!teamName || !generatedAvatar) {
            toast({
                variant: 'destructive',
                title: 'Не все готово',
                description: 'Пожалуйста, укажите название команды и сгенерируйте логотип.',
            });
            return;
        }
        // In a real app, this would send data to the backend to create the team.
        toast({
            title: 'Команда создана!',
            description: `Команда "${teamName}" успешно создана и готова к покорению вершин!`,
        });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <Wand2 className="mx-auto h-12 w-12 text-primary" />
                <h1 className="font-headline text-3xl font-bold tracking-tight">AI-Мастер Создания Команд</h1>
                <p className="text-muted-foreground">
                    Опишите свою идею, и наш ИИ поможет создать уникальное имя, девиз и логотип для вашей команды.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Шаг 1: Идея и Название</CardTitle>
                    <CardDescription>Расскажите нам о своей команде, и ИИ предложит креативные варианты.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="team-description">Опишите вашу команду</Label>
                        <Textarea
                            id="team-description"
                            placeholder="Например: 'Агрессивная команда из Сибири, играем как медведи-шатуны. Основные цвета - синий и белый.'"
                            value={teamDescription}
                            onChange={(e) => setTeamDescription(e.target.value)}
                            disabled={isGeneratingText}
                        />
                    </div>
                    <Button onClick={handleGenerateText} disabled={isGeneratingText} className="w-full sm:w-auto">
                        {isGeneratingText ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Предложить имя и девиз
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="team-name">Название команды</Label>
                            <Input
                                id="team-name"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                placeholder="Будет сгенерировано здесь..."
                            />
                        </div>
                         <div>
                            <Label htmlFor="team-motto">Девиз</Label>
                            <Input
                                id="team-motto"
                                value={teamMotto}
                                onChange={(e) => setTeamMotto(e.target.value)}
                                placeholder="И девиз тоже..."
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Шаг 2: Логотип</CardTitle>
                    <CardDescription>Опишите желаемый логотип или используйте предложенный вариант.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="logo-description">Описание логотипа</Label>
                            <Textarea
                                id="logo-description"
                                placeholder="Например: 'Минималистичный логотип сибирского медведя, в стиле esports, сине-белые тона'"
                                value={logoDescription}
                                onChange={(e) => setLogoDescription(e.target.value)}
                                disabled={isGeneratingAvatar}
                                className="min-h-[100px]"
                            />
                        </div>
                        <Button onClick={handleGenerateAvatar} disabled={isGeneratingAvatar} className="w-full sm:w-auto">
                            {isGeneratingAvatar ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                            Сгенерировать логотип
                        </Button>
                    </div>
                     <div className="flex flex-col items-center justify-center h-full w-full rounded-md border border-dashed bg-muted/50 p-4 min-h-[200px]">
                        {isGeneratingAvatar && <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />}
                        {generatedAvatar && <Image src={generatedAvatar} alt="Сгенерированный логотип" width={200} height={200} className="rounded-md object-contain" />}
                        {!isGeneratingAvatar && !generatedAvatar && <p className="text-sm text-muted-foreground text-center">Здесь появится ваш будущий логотип</p>}
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
                    <CardTitle>Шаг 3: Завершение</CardTitle>
                     <CardDescription>Проверьте все данные и создайте свою легендарную команду!</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button size="lg" className="w-full" onClick={handleCreateTeam}>
                        Создать команду "{teamName || '...'}"
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
