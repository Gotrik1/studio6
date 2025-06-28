'use client';

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Shield, MapPin, CalendarDays, Users, Swords, Trophy, Newspaper, BarChart3, Star, Share2, Settings, Gem, PlusCircle, Banknote, BrainCircuit, Loader2, Pencil, Trash2, UserPlus, Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { teamPdHistory } from "@/lib/mock-data/gamification";
import { teamStoreItems } from "@/lib/mock-data/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { aiTeamAssistant, type AiTeamAssistantOutput } from '@/ai/flows/ai-team-assistant';
import { generateTeamAvatar } from "@/ai/flows/generate-team-avatar-flow";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { JoinRequestAnalysisDialog } from "@/components/join-request-analysis-dialog";

const team = {
  name: "Кибер Орлы",
  motto: "Выше всех, быстрее всех, сильнее всех!",
  logo: "https://placehold.co/128x128.png",
  logoHint: "eagle logo",
  coverImage: "https://placehold.co/1200x400.png",
  coverImageHint: "esports stadium lights",
  city: "Москва",
  founded: "2021",
  sport: "Valorant",
  status: "Активна",
  captain: { name: "Alex 'CyberSlasher' Doe", href: "/profile" },
};

const initialRoster = [
  { name: "Alex 'CyberSlasher' Doe", role: "Капитан / Дуэлянт", avatar: "https://placehold.co/100x100.png", avatarHint: "esports player" },
  { name: "Maria 'Shadow' Petrova", role: "Смоукер", avatar: "https://placehold.co/100x100.png", avatarHint: "female gamer" },
  { name: "Ivan 'Beast' Orlov", role: "Страж", avatar: "https://placehold.co/100x100.png", avatarHint: "focused gamer" },
  { name: "Olga 'Phoenix' Smirnova", role: "Зачинщик", avatar: "https://placehold.co/100x100.png", avatarHint: "gamer with headphones" },
  { name: "Dmitry 'Gadget' Kuznetsov", role: "Зачинщик", avatar: "https://placehold.co/100x100.png", avatarHint: "tech savvy gamer" },
];

const initialJoinRequests = [
    { name: "Перспективный_Игрок", role: "Универсал", avatar: "https://placehold.co/100x100.png", avatarHint: "gamer profile" },
    { name: "Свободный_Агент", role: "Зачинщик", avatar: "https://placehold.co/100x100.png", avatarHint: "anonymous person" },
];

const achievements = [
    { name: "Чемпионы Summer Kickoff 2024", icon: Trophy, description: "1-е место в летнем сезоне" },
    { name: "Прорыв года", icon: Star, description: "Награда от сообщества ProDvor" },
    { name: "Непобедимые", icon: Shield, description: "10 побед подряд в рейтинговых матчах" },
    { name: "Самая медийная команда", icon: Newspaper, description: "Наибольшее количество упоминаний в новостях" },
];

const recentMatches = [
  { id: 1, opponent: "Вихревые Гадюки", score: "13-9", result: "Победа", map: "Ascent" },
  { id: 2, opponent: "Квантовые Квазары", score: "7-13", result: "Поражение", map: "Bind" },
  { id: 3, opponent: "Багровые Крестоносцы", score: "13-5", result: "Победа", map: "Haven" },
];

const sponsors = [
    { name: "TechSponsor", logo: "https://placehold.co/150x50.png", logoHint: "corporate logo" },
    { name: "GamerGear", logo: "https://placehold.co/150x50.png", logoHint: "gaming brand logo" },
    { name: "Energy Drink Co.", logo: "https://placehold.co/150x50.png", logoHint: "beverage logo" },
]

export default function TeamProfilePage() {
    const { toast } = useToast();
    const [aiResult, setAiResult] = useState<AiTeamAssistantOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [isAssistantDialogOpen, setIsAssistantDialogOpen] = useState(false);
    const [teamActivity, setTeamActivity] = useState("");
    const [teamGoals, setTeamGoals] = useState("");
    const [relevantContent, setRelevantContent] = useState("");

    const [teamLogo, setTeamLogo] = useState(team.logo);
    const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
    const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
    const [avatarPrompt, setAvatarPrompt] = useState("An eagle logo, esports style, blue and white");
    const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);
    const [avatarError, setAvatarError] = useState<string | null>(null);

    const [isRequestSent, setIsRequestSent] = useState(false);
    const [currentRoster, setCurrentRoster] = useState(initialRoster);
    const [joinRequests, setJoinRequests] = useState(initialJoinRequests);

    const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<(typeof initialJoinRequests)[0] | null>(null);

    const handleOpenAnalysis = (request: typeof initialJoinRequests[0]) => {
        setSelectedRequest(request);
        setIsAnalysisDialogOpen(true);
    };

    const handleAssistantOpenChange = (open: boolean) => {
        if (open) {
            const activitySummary = recentMatches
                .map(m => `Против '${m.opponent}': ${m.result} со счетом ${m.score} на карте ${m.map}.`)
                .join(' ');
            setTeamActivity(activitySummary || "Нет данных о недавних матчах.");

            const goalsSummary = `Девиз команды: "${team.motto}". Главная цель - победа в текущих и будущих турнирах, улучшение командной игры и повышение в рейтинге.`;
            setTeamGoals(goalsSummary);

            setRelevantContent("Анализ последних игр от тренера: https://example.com/analysis");
        }
        setIsAssistantDialogOpen(open);
    };

    const handleGenerateSummary = async () => {
        if (!teamActivity || !teamGoals) {
            setError("Поля 'Активность команды' и 'Цели команды' обязательны для заполнения.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setAiResult(null);

        try {
            const input = { teamActivity, teamGoals, relevantContent };
            const result = await aiTeamAssistant(input);
            setAiResult(result);
            setIsAssistantDialogOpen(false);
        } catch (e) {
            console.error(e);
            setError("Не удалось получить сводку от ИИ. Пожалуйста, попробуйте снова.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGenerateAvatar = async () => {
        if (!avatarPrompt) return;
        setIsGeneratingAvatar(true);
        setAvatarError(null);
        setGeneratedAvatar(null);
        try {
            const result = await generateTeamAvatar({ prompt: avatarPrompt });
            setGeneratedAvatar(result.avatarDataUri);
        } catch (e) {
            console.error(e);
            setAvatarError("Не удалось сгенерировать изображение. Попробуйте другой запрос.");
        } finally {
            setIsGeneratingAvatar(false);
        }
    };

    const handleApplyAvatar = () => {
        if (generatedAvatar) {
            setTeamLogo(generatedAvatar);
            setIsAvatarDialogOpen(false);
            setGeneratedAvatar(null);
        }
    };

    const handleJoinRequest = () => {
        setIsRequestSent(true);
        toast({
            title: "Заявка отправлена!",
            description: "Капитан команды рассмотрит вашу заявку в ближайшее время.",
        });
    };

    const handleAcceptRequest = (request: typeof initialJoinRequests[0]) => {
        setCurrentRoster(prev => [...prev, { ...request, name: request.name.trim() }]);
        setJoinRequests(prev => prev.filter(r => r.name !== request.name));
        toast({
            title: "Игрок принят!",
            description: `${request.name.trim()} теперь в команде.`,
        });
    };

    const handleDeclineRequest = (request: typeof initialJoinRequests[0]) => {
        setJoinRequests(prev => prev.filter(r => r.name !== request.name));
        toast({
            title: "Заявка отклонена",
            description: `Заявка от ${request.name.trim()} была отклонена.`,
            variant: "destructive",
        });
    };
    
    const handleRemoveFromRoster = (playerName: string) => {
        setCurrentRoster(prev => prev.filter(p => p.name !== playerName));
        toast({
            title: "Игрок удален",
            description: `${playerName} был удален из состава.`,
            variant: "destructive",
        });
    };

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden">
                <CardHeader className="relative h-48 w-full p-0">
                    <Image
                        src={team.coverImage}
                        alt={`${team.name} cover image`}
                        fill
                        className="object-cover brightness-75"
                        data-ai-hint={team.coverImageHint}
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="icon"><Share2 className="h-5 w-5"/></Button>
                        <Button variant="outline" size="icon"><Gem className="h-5 w-5"/></Button>
                        <Button onClick={handleJoinRequest} disabled={isRequestSent}>
                            <Users className="mr-2 h-5 w-5"/>
                            {isRequestSent ? "Заявка отправлена" : "Вступить в команду"}
                        </Button>
                        <Button variant="secondary"><Settings className="mr-2 h-5 w-5"/>Управлять</Button>
                    </div>
                </CardHeader>
                <CardContent className="relative flex flex-col items-center gap-4 p-6 pt-0 text-center sm:flex-row sm:text-left">
                    <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                        <div className="relative -mt-12 shrink-0">
                            <Avatar className="h-24 w-24 border-4 border-background sm:h-32 sm:w-32">
                                <AvatarImage src={teamLogo} alt={team.name} data-ai-hint={team.logoHint} />
                                <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                             <DialogTrigger asChild>
                                <Button size="icon" className="group absolute bottom-1 right-1 h-8 w-8 rounded-full">
                                    <Pencil className="h-4 w-4 transition-transform group-hover:scale-110" />
                                    <span className="sr-only">Сгенерировать логотип</span>
                                </Button>
                            </DialogTrigger>
                        </div>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Сгенерировать логотип с помощью ИИ</DialogTitle>
                                <DialogDescription>
                                    Опишите, какой логотип вы хотите видеть. Например, "злой медведь в хоккейной маске, стиль киберпанк".
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="avatar-prompt">Ваш запрос:</Label>
                                    <Input 
                                        id="avatar-prompt"
                                        value={avatarPrompt}
                                        onChange={(e) => setAvatarPrompt(e.target.value)}
                                        placeholder="Например, огненный феникс, векторный стиль"
                                        disabled={isGeneratingAvatar}
                                    />
                                </div>
                                <Button onClick={handleGenerateAvatar} disabled={isGeneratingAvatar} className="w-full">
                                    {isGeneratingAvatar ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <BrainCircuit className="mr-2 h-4 w-4"/>}
                                    {isGeneratingAvatar ? 'Генерация...' : 'Сгенерировать'}
                                </Button>
                                {avatarError && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{avatarError}</AlertDescription></Alert>}
                                <div className="flex justify-center items-center h-48 w-full rounded-md border border-dashed bg-muted/50">
                                    {isGeneratingAvatar && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>}
                                    {generatedAvatar && <Image src={generatedAvatar} alt="Generated Avatar" width={192} height={192} className="rounded-md object-contain" />}
                                    {!isGeneratingAvatar && !generatedAvatar && <p className="text-sm text-muted-foreground">Здесь появится результат</p>}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="secondary" onClick={() => setIsAvatarDialogOpen(false)}>Отмена</Button>
                                <Button onClick={handleApplyAvatar} disabled={!generatedAvatar}>Применить</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <div className="flex-1 space-y-2">
                        <CardTitle className="font-headline text-3xl sm:text-4xl">{team.name}</CardTitle>
                        <CardDescription className="italic">"{team.motto}"</CardDescription>
                         <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-2 text-sm text-muted-foreground sm:justify-start">
                            <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{team.city}</div>
                            <div className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />Основана в {team.founded}</div>
                            <div className="flex items-center gap-1.5"><Shield className="h-4 w-4" />{team.sport}</div>
                            <Link href={team.captain.href} className="flex items-center gap-1.5 hover:text-primary"><Crown className="h-4 w-4 text-amber-500" />Капитан: {team.captain.name}</Link>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="roster">
                <TabsList className="grid w-full grid-cols-4 sm:grid-cols-8">
                    <TabsTrigger value="roster"><Users className="mr-2 h-4 w-4"/>Состав</TabsTrigger>
                    <TabsTrigger value="matches"><Swords className="mr-2 h-4 w-4"/>Матчи</TabsTrigger>
                    <TabsTrigger value="stats"><BarChart3 className="mr-2 h-4 w-4"/>Статистика</TabsTrigger>
                    <TabsTrigger value="achievements"><Trophy className="mr-2 h-4 w-4"/>Достижения</TabsTrigger>
                    <TabsTrigger value="about"><Newspaper className="mr-2 h-4 w-4"/>О команде</TabsTrigger>
                    <TabsTrigger value="bank"><Banknote className="mr-2 h-4 w-4"/>Банк команды</TabsTrigger>
                    <TabsTrigger value="ai-assistant"><BrainCircuit className="mr-2 h-4 w-4"/>AI Помощник</TabsTrigger>
                    <TabsTrigger value="requests">
                        <UserPlus className="mr-2 h-4 w-4"/>Заявки
                        {joinRequests.length > 0 && <Badge className="ml-2">{joinRequests.length}</Badge>}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="roster">
                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <div>
                                <CardTitle>Текущий состав</CardTitle>
                                <CardDescription>Игроки, которые защищают цвета команды {team.name}.</CardDescription>
                            </div>
                            <Button><PlusCircle className="mr-2 h-4 w-4"/>Пригласить игрока</Button>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                            {currentRoster.map(player => (
                                <Card key={player.name} className="group relative flex flex-col items-center p-4 text-center transition-shadow hover:shadow-md">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={player.avatar} alt={player.name} data-ai-hint={player.avatarHint} />
                                        <AvatarFallback>{player.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div className="mt-2">
                                        <p className="font-semibold">{player.name}</p>
                                        <p className="text-sm text-muted-foreground">{player.role}</p>
                                    </div>
                                    <Button 
                                        variant="destructive" 
                                        size="icon" 
                                        className="absolute top-2 right-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                                        onClick={() => handleRemoveFromRoster(player.name)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Удалить из состава</span>
                                    </Button>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="matches">
                    <Card>
                        <CardHeader>
                            <CardTitle>История матчей</CardTitle>
                            <CardDescription>Результаты последних игр команды.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {recentMatches.map((match) => (
                                <div key={match.id} className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Противник</p>
                                        <p className="font-semibold">{match.opponent}</p>
                                    </div>
                                     <div className="text-center">
                                        <p className="text-sm text-muted-foreground">Счет</p>
                                        <p className="font-bold text-2xl">{match.score}</p>
                                    </div>
                                     <div>
                                        <p className="text-sm text-muted-foreground">Карта</p>
                                        <p className="font-semibold">{match.map}</p>
                                    </div>
                                    <Badge variant={match.result === 'Победа' ? 'default' : 'destructive'} className="w-24 justify-center">{match.result}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="stats">
                    <Card>
                        <CardHeader>
                            <CardTitle>Статистика команды</CardTitle>
                            <CardDescription>Ключевые показатели эффективности за текущий сезон.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <Card>
                                <CardHeader>
                                    <CardDescription>Процент побед</CardDescription>
                                    <CardTitle className="font-headline text-4xl">72%</CardTitle>
                                </CardHeader>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardDescription>Текущий ранг</CardDescription>
                                    <CardTitle className="font-headline text-4xl">#1</CardTitle>
                                </CardHeader>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardDescription>Средний KDA</CardDescription>
                                    <CardTitle className="font-headline text-4xl">1.35</CardTitle>
                                </CardHeader>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardDescription>Любимая карта</CardDescription>
                                    <CardTitle className="font-headline text-4xl">Ascent</CardTitle>
                                </CardHeader>
                            </Card>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="achievements">
                    <Card>
                        <CardHeader>
                            <CardTitle>Зал славы</CardTitle>
                            <CardDescription>Главные трофеи и награды команды.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                           {achievements.map((ach) => (
                                <div key={ach.name} className="flex items-center gap-4 rounded-lg border p-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 text-accent shrink-0">
                                        <ach.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{ach.name}</p>
                                        <p className="text-sm text-muted-foreground">{ach.description}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="about">
                    <Card>
                        <CardHeader>
                            <CardTitle>О команде</CardTitle>
                        </CardHeader>
                        <CardContent className="prose prose-sm sm:prose-base dark:prose-invert max-w-none space-y-6">
                            <p><strong>{team.name}</strong> — это не просто команда, это семья, объединённая общей страстью к Valorant и стремлением к победе. Основанная в {team.founded} году в городе {team.city}, наша команда быстро прошла путь от амбициозных новичков до одних из самых узнаваемых участников на платформе ProDvor.</p>
                            <p>Мы верим в упорные тренировки, нестандартные тактики и, самое главное, в силу командного духа. Наша цель — не только выигрывать турниры, но и вдохновлять других игроков, развивать сообщество и показывать, что настоящий успех приходит только через совместные усилия.</p>
                            <h3>Наши ценности:</h3>
                            <ul>
                                <li><strong>Уважение:</strong> Мы уважаем своих соперников, товарищей по команде и болельщиков.</li>
                                <li><strong>Развитие:</strong> Мы никогда не останавливаемся на достигнутом и постоянно совершенствуем свои навыки.</li>
                                <li><strong>Ответственность:</strong> Каждый из нас несет ответственность за результат и атмосферу в команде.</li>
                            </ul>
                            <h3 className="pt-4 border-t">Наши спонсоры</h3>
                            <div className="not-prose flex flex-wrap items-center gap-8">
                                {sponsors.map(sponsor => (
                                    <Image key={sponsor.name} src={sponsor.logo} alt={sponsor.name} width={150} height={50} className="brightness-0 dark:brightness-100" data-ai-hint={sponsor.logoHint} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="bank">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>История транзакций</CardTitle>
                                    <CardDescription>Все операции с командным банком PD.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Дата</TableHead>
                                                <TableHead>Описание</TableHead>
                                                <TableHead>Инициатор</TableHead>
                                                <TableHead className="text-right">Сумма</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {teamPdHistory.map((tx) => (
                                                <TableRow key={tx.id}>
                                                    <TableCell>{format(new Date(tx.timestamp), "d MMM yyyy", { locale: ru })}</TableCell>
                                                    <TableCell>{tx.source}</TableCell>
                                                    <TableCell>{tx.user}</TableCell>
                                                    <TableCell className={`text-right font-medium ${tx.value > 0 ? 'text-green-500' : 'text-destructive'}`}>
                                                        {tx.value > 0 ? '+' : ''}{tx.value.toLocaleString()} PD
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Баланс</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-bold font-headline">
                                        {teamPdHistory.reduce((acc, tx) => acc + tx.value, 0).toLocaleString()} PD
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Магазин для команды</CardTitle>
                                    <CardDescription>Только капитан может тратить PD из банка.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {teamStoreItems.map(item => (
                                        <div key={item.id} className="flex items-center gap-4 rounded-md border p-2">
                                             <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md" data-ai-hint={item.imageHint} />
                                             <div className="flex-1">
                                                 <p className="text-sm font-semibold">{item.name}</p>
                                                 <p className="text-xs text-muted-foreground">{item.price.toLocaleString()} PD</p>
                                             </div>
                                             <Button size="sm"><ShoppingBag className="h-4 w-4"/></Button>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="ai-assistant">
                    <Card>
                        <CardHeader>
                            <CardTitle>Командный AI-помощник</CardTitle>
                            <CardDescription>Получите краткую сводку по последней активности команды и рекомендации от нашего ИИ.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <Dialog open={isAssistantDialogOpen} onOpenChange={handleAssistantOpenChange}>
                                <DialogTrigger asChild>
                                    <Button>Сгенерировать сводку</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[625px]">
                                    <DialogHeader>
                                        <DialogTitle>Данные для AI-помощника</DialogTitle>
                                        <DialogDescription>
                                            Предоставьте контекст, чтобы ИИ мог сгенерировать точную сводку и полезные рекомендации.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="team-activity">Активность команды</Label>
                                            <Textarea id="team-activity" value={teamActivity} onChange={(e) => setTeamActivity(e.target.value)} placeholder="Опишите недавние матчи, результаты, ключевые моменты..." className="min-h-[100px]" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="team-goals">Цели команды</Label>
                                            <Textarea id="team-goals" value={teamGoals} onChange={(e) => setTeamGoals(e.target.value)} placeholder="На чем команда сосредоточена в данный момент?" />
                                        </div>
                                         <div className="grid gap-2">
                                            <Label htmlFor="relevant-content">Дополнительный контент (необязательно)</Label>
                                            <Textarea id="relevant-content" value={relevantContent} onChange={(e) => setRelevantContent(e.target.value)} placeholder="Ссылки на реплеи, статьи, заметки тренера..."/>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleGenerateSummary} disabled={isLoading}>
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {isLoading ? 'Анализ...' : 'Сгенерировать'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            
                            {isLoading && (
                                <div className="flex justify-center items-center h-40 border border-dashed rounded-md">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            )}
                            
                            {error && (
                                <Alert variant="destructive">
                                    <AlertTitle>Ошибка</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            
                            {aiResult && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Сводка</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">{aiResult.summary}</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Рекомендации</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">{aiResult.suggestions}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="requests">
                    <Card>
                        <CardHeader>
                            <CardTitle>Заявки на вступление</CardTitle>
                            <CardDescription>Игроки, желающие присоединиться к вашей команде. Эта вкладка видна только капитану.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {joinRequests.length > 0 ? (
                                joinRequests.map((request) => (
                                    <Card key={request.name} className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={request.avatar} alt={request.name} data-ai-hint={request.avatarHint} />
                                                <AvatarFallback>{request.name.trim().charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{request.name}</p>
                                                <p className="text-sm text-muted-foreground">{request.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleOpenAnalysis(request)}>
                                                <BrainCircuit className="mr-2 h-4 w-4" />AI-анализ
                                            </Button>
                                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleAcceptRequest(request)}>
                                                <Check className="mr-2 h-4 w-4" />Принять
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleDeclineRequest(request)}>
                                                <X className="mr-2 h-4 w-4" />Отклонить
                                            </Button>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center text-muted-foreground py-10">
                                    <UserPlus className="mx-auto h-12 w-12 mb-4" />
                                    <h3 className="text-lg font-semibold">Нет новых заявок</h3>
                                    <p>Как только кто-то захочет вступить в команду, вы увидите его здесь.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
             <JoinRequestAnalysisDialog
                isOpen={isAnalysisDialogOpen}
                onOpenChange={setIsAnalysisDialogOpen}
                request={selectedRequest}
                teamNeeds="Команде нужен уверенный смоукер (controller), способный на клатчи. Стиль игры - агрессивный, с быстрыми выходами на точки."
            />
        </div>
    );
}
