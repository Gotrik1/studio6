

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PD_RATES, PD_LIMITS } from "@/config/gamification";
import { achievementCatalog, lootboxPrizes, leaderboardData, teamLeaderboardData } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Trophy, Gift, Coins, Shield, Crown, Rocket, Swords, Medal, Award, Star, Gem, BarChart3, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ranks } from "@/config/ranks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const achievementIcons = {
    Trophy, Star, Shield, Gem, Crown, Rocket, Swords, Medal, Award
};

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


export default function GamificationAdminPage() {
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
                                        {Object.entries(PD_RATES).map(([key, value]) => (
                                            <TableRow key={key}>
                                                <TableCell className="font-medium">{key}</TableCell>
                                                <TableCell className="text-right font-bold text-primary">{value} PD</TableCell>
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
                                {Object.entries(PD_LIMITS).map(([key, value]) => (
                                     <div key={key} className="flex items-center justify-between rounded-lg border p-4">
                                        <p className="font-medium">{key}</p>
                                        <Badge variant="secondary">{value}</Badge>
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
                </TabsContent>

                <TabsContent value="achievements" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Все достижения</CardTitle>
                            <CardDescription>Полный список ачивок, доступных на платформе.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {achievementCatalog.map((ach) => {
                                const Icon = achievementIcons[ach.icon as keyof typeof achievementIcons];
                                return (
                                    <Card key={ach.name} className="p-4">
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
        </div>
    );
}
