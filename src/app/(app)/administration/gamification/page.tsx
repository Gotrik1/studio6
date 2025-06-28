
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PD_RATES as initialPdRates, PD_LIMITS as initialPdLimits } from "@/config/gamification";
import { achievementCatalog } from "@/lib/mock-data/achievements";
import { lootboxPrizes } from "@/lib/mock-data/store";
import { leaderboardData, teamLeaderboardData } from "@/lib/mock-data/leaderboards";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Trophy, Gift, Coins, Shield, Crown, Rocket, Swords, Medal, Award, Star, Gem, BarChart3, AlertTriangle, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ranks } from "@/config/ranks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


type Achievement = (typeof achievementCatalog)[0];

const achievementIcons = {
    Trophy, Star, Shield, Gem, Crown, Rocket, Swords, Medal, Award
};
const iconKeys = Object.keys(achievementIcons) as (keyof typeof achievementIcons)[];

const getRarityColor = (rarity: string) => {
    switch (rarity) {
        case "Эпическая": return "border-purple-500 bg-purple-500/10 text-purple-500";
        case "Редкая": return "border-blue-500 bg-blue-500/10 text-blue-500";
        default: return "border-gray-500 bg-gray-500/10 text-gray-500";
    }
};

const getLootboxRarityColor = (rarity: string) => {
    switch (rarity) {
        case "Эпический": return "text-purple-500";
        case "Редкий": return "text-blue-500";
        default: return "text-muted-foreground";
    }
};

const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal className="h-5 w-5 text-amber-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-400" />;
    return null;
}

const rankDistributionData = [
  { rank: "Возьмите меня", players: 157 },
  { rank: "Уже бегу", players: 432 },
  { rank: "Упорный", players: 689 },
  { rank: "Уличный боец", players: 521 },
  { rank: "Кто ты, воин?", players: 312 },
  { rank: "Гроза района", players: 189 },
  { rank: "Первый среди равных", players: 98 },
  { rank: "Познавший дзен", players: 45 },
  { rank: "Неоспоримый", players: 21 },
  { rank: "Первый после бога", players: 7 },
  { rank: "Анигилятор", players: 3 },
];

const chartConfig = {
  players: {
    label: "Игроки",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export default function GamificationAdminPage() {
    const { toast } = useToast();
    const [rates, setRates] = useState(initialPdRates);
    const [limits, setLimits] = useState(initialPdLimits);
    const [achievements, setAchievements] = useState(achievementCatalog);
    
    // State for rates/limits editing
    const [isRateLimitDialogOpen, setIsRateLimitDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<{ key: string; label: string; value: number | string; type: 'rate' | 'limit' } | null>(null);
    const [currentValue, setCurrentValue] = useState('');

    // State for achievement editing
    const [isAchievementDialogOpen, setIsAchievementDialogOpen] = useState(false);
    const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
    const [currentAchievementData, setCurrentAchievementData] = useState<Partial<Achievement>>({});

    const handleEditRateLimitClick = (key: string, label: string, value: number | string, type: 'rate' | 'limit') => {
        setEditingItem({ key, label, value, type });
        setCurrentValue(String(value));
        setIsRateLimitDialogOpen(true);
    };

    const handleRateLimitSave = () => {
        if (!editingItem) return;

        const updatedValue = editingItem.type === 'rate' ? parseInt(currentValue, 10) : currentValue;
        
        if (isNaN(updatedValue as number) && editingItem.type === 'rate') {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Значение должно быть числом.' });
            return;
        }

        if (editingItem.type === 'rate') {
            setRates(prev => ({ ...prev, [editingItem.key as keyof typeof prev]: updatedValue as number }));
        } else {
            setLimits(prev => ({ ...prev, [editingItem.key as keyof typeof prev]: updatedValue as string }));
        }

        toast({ title: 'Успех!', description: `Значение для "${editingItem.label}" было обновлено.` });
        setIsRateLimitDialogOpen(false);
        setEditingItem(null);
    };

    const handleAchievementEditClick = (achievement: Achievement | null) => {
        setEditingAchievement(achievement);
        setCurrentAchievementData(achievement ? { ...achievement } : { name: '', description: '', rarity: 'Обычная', icon: 'Star', points: 0 });
        setIsAchievementDialogOpen(true);
    };

    const handleAchievementSave = () => {
        const { name, description, rarity, icon, points } = currentAchievementData;
        if (!name || !description || !rarity || !icon || points === undefined) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Все поля должны быть заполнены.' });
            return;
        }

        if (editingAchievement) {
            setAchievements(achievements.map(ach => ach.name === editingAchievement.name ? { ...currentAchievementData } as Achievement : ach));
            toast({ title: 'Успех!', description: `Достижение "${name}" обновлено.` });
        } else {
            if (achievements.some(ach => ach.name === name)) {
                 toast({ variant: 'destructive', title: 'Ошибка', description: 'Достижение с таким названием уже существует.' });
                 return;
            }
            setAchievements(prev => [...prev, { ...currentAchievementData } as Achievement]);
            toast({ title: 'Успех!', description: `Достижение "${name}" добавлено.` });
        }

        setIsAchievementDialogOpen(false);
        setEditingAchievement(null);
    };

    const handleAchievementDelete = (achievementName: string) => {
        setAchievements(prev => prev.filter(ach => ach.name !== achievementName));
        toast({ title: 'Достижение удалено', description: `"${achievementName}" было успешно удалено.`, variant: 'destructive' });
    };


    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Управление геймификацией</h1>
                <p className="text-muted-foreground">
                    Обзор и настройка всех игровых механик, правил начисления очков, достижений и рейтингов.
                </p>
            </div>

            <Tabs defaultValue="rules">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="rules"><Gamepad2 className="mr-2 h-4 w-4" />Правила PD</TabsTrigger>
                    <TabsTrigger value="ranks"><Award className="mr-2 h-4 w-4"/>Ранги</TabsTrigger>
                    <TabsTrigger value="achievements"><Trophy className="mr-2 h-4 w-4" />Достижения</TabsTrigger>
                    <TabsTrigger value="lootboxes"><Gift className="mr-2 h-4 w-4" />Кейсы</TabsTrigger>
                    <TabsTrigger value="leaderboards"><BarChart3 className="mr-2 h-4 w-4"/>Рейтинги</TabsTrigger>
                </TabsList>

                <TabsContent value="rules" className="mt-4">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ставки начисления PD</CardTitle>
                                <CardDescription>Количество PD, начисляемое за определенные действия.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Действие</TableHead>
                                            <TableHead className="text-right">Количество PD</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.entries(rates).map(([key, value]) => (
                                            <TableRow key={key}>
                                                <TableCell className="font-medium">{key}</TableCell>
                                                <TableCell className="text-right font-bold text-primary">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {value} PD
                                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditRateLimitClick(key, key, value, 'rate')}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Лимиты и ограничения</CardTitle>
                                <CardDescription>Правила для предотвращения злоупотреблений.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {Object.entries(limits).map(([key, value]) => (
                                     <div key={key} className="flex items-center justify-between rounded-lg border p-3">
                                        <p className="font-medium">{key}</p>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">{value}</Badge>
                                             <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditRateLimitClick(key, key, value, 'limit')}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                   <p className="font-medium">Анти-фарм система</p>
                                   <Badge variant="destructive">Активна</Badge>
                                </div>
                                 <div className="flex items-center justify-between rounded-lg border p-4">
                                   <p className="font-medium">Сезонные сбросы</p>
                                   <Badge variant="outline">Раз в квартал</Badge>
                                </div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle>Вызовы и Анти-чит</CardTitle>
                                <CardDescription>Правила для соревновательных матчей.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                 <div className="flex items-center justify-between rounded-lg border p-4">
                                    <p className="font-medium">Ставки на матч</p>
                                    <Badge variant="secondary">10-50 PD</Badge>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <p className="font-medium">Подтверждение вызова</p>
                                    <Badge variant="outline">Видео + Голосование</Badge>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-destructive" />
                                        <p className="font-medium text-destructive">Штраф за фейк-вызов</p>
                                    </div>
                                    <Badge variant="destructive">-100 PD</Badge>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                                     <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-destructive" />
                                        <p className="font-medium text-destructive">Штраф за дисквалификацию</p>
                                    </div>
                                    <Badge variant="destructive">Обнуление PD за месяц</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                
                <TabsContent value="ranks" className="mt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Система рангов</CardTitle>
                                    <CardDescription>Всего 11 уровней мастерства, отражающих прогресс игрока.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <TooltipProvider>
                                        {ranks.map((rank) => (
                                            <Card key={rank.name} className="p-4 transition-shadow hover:shadow-md">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <Award className={cn("h-8 w-8 shrink-0", rank.color)} />
                                                        <div>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <p className={cn("font-headline text-lg font-bold cursor-help", rank.color)}>{rank.name}</p>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{rank.description}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                            <p className="text-sm text-muted-foreground">{rank.description}</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="secondary" className="font-mono whitespace-nowrap">
                                                        {rank.minPoints.toLocaleString()} - {rank.maxPoints === Infinity ? '∞' : rank.maxPoints.toLocaleString()} PD
                                                    </Badge>
                                                </div>
                                            </Card>
                                        ))}
                                    </TooltipProvider>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-2">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Распределение по рангам</CardTitle>
                                    <CardDescription>Количество игроков на каждом уровне.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={chartConfig} className="min-h-[450px] w-full">
                                        <BarChart
                                            accessibilityLayer
                                            data={rankDistributionData}
                                            layout="vertical"
                                            margin={{ left: 10, top: 10, right: 10 }}
                                        >
                                            <CartesianGrid horizontal={false} />
                                            <YAxis
                                                dataKey="rank"
                                                type="category"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                className="text-xs"
                                                width={120}
                                            />
                                            <XAxis dataKey="players" type="number" hide />
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent indicator="dot" />}
                                            />
                                            <Bar
                                                dataKey="players"
                                                layout="vertical"
                                                fill="var(--color-players)"
                                                radius={4}
                                            />
                                        </BarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="achievements" className="mt-4">
                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <div>
                                <CardTitle>Все достижения</CardTitle>
                                <CardDescription>Полный список ачивок, доступных на платформе.</CardDescription>
                            </div>
                            <Button onClick={() => handleAchievementEditClick(null)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Добавить
                            </Button>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {achievements.map((ach) => {
                                const Icon = achievementIcons[ach.icon as keyof typeof achievementIcons];
                                return (
                                    <Card key={ach.name} className="p-4 group relative">
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleAchievementEditClick(ach)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="icon" className="h-7 w-7">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Это действие необратимо. Вы действительно хотите удалить достижение "{ach.name}"?
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleAchievementDelete(ach.name)} className="bg-destructive hover:bg-destructive/90">
                                                            Удалить
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border ${getRarityColor(ach.rarity)}`}>
                                                {Icon && <Icon className="h-6 w-6" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold">{ach.name}</p>
                                                <p className="text-xs text-muted-foreground">{ach.description}</p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <Badge variant="outline" className={`${getRarityColor(ach.rarity)}`}>{ach.rarity}</Badge>
                                                    <Badge variant={ach.points > 0 ? 'secondary' : 'destructive'} className="flex items-center gap-1"><Coins className="h-3 w-3"/> {ach.points > 0 ? '+' : ''}{ach.points} XP</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="lootboxes" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Содержимое кейсов</CardTitle>
                            <CardDescription>Возможные призы из кейсов и их редкость.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Предмет</TableHead>
                                        <TableHead className="text-right">Редкость</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lootboxPrizes.map((prize) => (
                                        <TableRow key={prize.name}>
                                            <TableCell className="font-medium">{prize.name}</TableCell>
                                            <TableCell className={cn("text-right font-bold", getLootboxRarityColor(prize.rarity))}>
                                                {prize.rarity}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                 <TabsContent value="leaderboards" className="mt-4">
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Топ игроков</CardTitle>
                                <CardDescription>Рейтинг лучших игроков по ELO.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Ранг</TableHead>
                                            <TableHead>Игрок</TableHead>
                                            <TableHead className="text-right">ELO</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {leaderboardData.slice(0, 10).map((player) => (
                                            <TableRow key={player.id}>
                                                <TableCell className="font-bold flex items-center gap-2">
                                                    {getRankIcon(player.rank)}
                                                    <span>#{player.rank}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={player.avatar} alt={player.name} data-ai-hint={player.avatarHint} />
                                                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">{player.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-primary">{player.elo}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Топ команд</CardTitle>
                                <CardDescription>Рейтинг самых богатых команд по PD.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Ранг</TableHead>
                                            <TableHead>Команда</TableHead>
                                            <TableHead className="text-right">Банк PD</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {teamLeaderboardData.slice(0, 10).map((team) => (
                                            <TableRow key={team.id}>
                                                <TableCell className="font-bold flex items-center gap-2">
                                                    {getRankIcon(team.rank)}
                                                    <span>#{team.rank}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={team.avatar} alt={team.name} data-ai-hint={team.avatarHint} />
                                                            <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">{team.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-primary">{team.totalPd.toLocaleString()} PD</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            <Dialog open={isRateLimitDialogOpen} onOpenChange={setIsRateLimitDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Редактирование "{editingItem?.label}"</DialogTitle>
                        <DialogDescription>
                            Введите новое значение и нажмите "Сохранить".
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="value-input">Значение</Label>
                        <Input
                            id="value-input"
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            type={editingItem?.type === 'rate' ? 'number' : 'text'}
                            className="mt-2"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRateLimitDialogOpen(false)}>Отмена</Button>
                        <Button onClick={handleRateLimitSave}>Сохранить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isAchievementDialogOpen} onOpenChange={setIsAchievementDialogOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>{editingAchievement ? "Редактировать достижение" : "Новое достижение"}</DialogTitle>
                        <DialogDescription>
                            Заполните информацию о достижении.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="ach-name">Название</Label>
                            <Input id="ach-name" value={currentAchievementData.name || ''} onChange={(e) => setCurrentAchievementData(prev => ({...prev, name: e.target.value}))} disabled={!!editingAchievement} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ach-desc">Описание</Label>
                            <Textarea id="ach-desc" value={currentAchievementData.description || ''} onChange={(e) => setCurrentAchievementData(prev => ({...prev, description: e.target.value}))} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="ach-points">Очки (XP)</Label>
                                <Input id="ach-points" type="number" value={currentAchievementData.points || 0} onChange={(e) => setCurrentAchievementData(prev => ({...prev, points: parseInt(e.target.value, 10) || 0}))} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ach-rarity">Редкость</Label>
                                <Select value={currentAchievementData.rarity} onValueChange={(value: Achievement['rarity']) => setCurrentAchievementData(prev => ({...prev, rarity: value}))}>
                                    <SelectTrigger id="ach-rarity"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Обычная">Обычная</SelectItem>
                                        <SelectItem value="Редкая">Редкая</SelectItem>
                                        <SelectItem value="Эпическая">Эпическая</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="ach-icon">Иконка</Label>
                            <Select value={currentAchievementData.icon} onValueChange={(value: Achievement['icon']) => setCurrentAchievementData(prev => ({...prev, icon: value}))}>
                                <SelectTrigger id="ach-icon">
                                    <SelectValue>
                                        {currentAchievementData.icon && (
                                            <div className="flex items-center gap-2">
                                                {React.createElement(achievementIcons[currentAchievementData.icon], { className: "h-4 w-4" })}
                                                <span>{currentAchievementData.icon}</span>
                                            </div>
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {iconKeys.map(iconKey => (
                                        <SelectItem key={iconKey} value={iconKey}>
                                            <div className="flex items-center gap-2">
                                                {React.createElement(achievementIcons[iconKey], { className: "h-4 w-4" })}
                                                <span>{iconKey}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAchievementDialogOpen(false)}>Отмена</Button>
                        <Button onClick={handleAchievementSave}>Сохранить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
