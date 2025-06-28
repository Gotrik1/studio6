
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { achievementCatalog, leaderboardData } from "@/lib/mock-data";
import { ArrowRight, BarChart3, Medal, Rocket, Shield, Star, Swords, Trophy, Users, Gem, Crown, Award } from "lucide-react";
import Link from "next/link";


const achievementIcons = {
    Trophy, Star, Shield, Gem, Crown, Rocket, Swords, Medal, Award
};

const getRarityColor = (rarity: string) => {
    switch (rarity) {
        case "Эпическая": return "border-purple-500 bg-purple-500/10 text-purple-500";
        case "Редкая": return "border-blue-500 bg-blue-500/10 text-blue-500";
        default: return "border-gray-500 bg-gray-500/10 text-gray-500";
    }
}

export default function LeaderboardsPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Рейтинги и Достижения</h1>
                <p className="text-muted-foreground">
                    Отслеживайте свой прогресс, соревнуйтесь с другими и открывайте новые награды.
                </p>
            </div>

            <Tabs defaultValue="leaderboard">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <TabsList>
                        <TabsTrigger value="leaderboard"><BarChart3 className="mr-2 h-4 w-4" />Таблица лидеров</TabsTrigger>
                        <TabsTrigger value="achievements"><Trophy className="mr-2 h-4 w-4" />Каталог достижений</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                         <Button variant="outline">Сравнить со мной</Button>
                         <Button>Мой прогресс</Button>
                    </div>
                </div>

                <TabsContent value="leaderboard" className="mt-4">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle>Топ-100 игроков</CardTitle>
                                    <CardDescription>Лучшие игроки платформы за текущий сезон.</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Select defaultValue="all">
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Все роли" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Все роли</SelectItem>
                                            <SelectItem value="player">Игроки</SelectItem>
                                            <SelectItem value="team">Команды</SelectItem>
                                            <SelectItem value="judge">Судьи</SelectItem>
                                        </SelectContent>
                                    </Select>
                                     <Select defaultValue="season">
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Период" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="season">Текущий сезон</SelectItem>
                                            <SelectItem value="month">Месяц</SelectItem>
                                            <SelectItem value="week">Неделя</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">Ранг</TableHead>
                                        <TableHead>Игрок</TableHead>
                                        <TableHead className="text-center">ELO</TableHead>
                                        <TableHead className="hidden text-center sm:table-cell">Побед/Поражений</TableHead>
                                        <TableHead className="text-right">Профиль</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {leaderboardData.map((player, index) => (
                                        <TableRow key={player.id}>
                                            <TableCell className="font-headline text-lg font-bold">#{player.rank}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={player.avatar} alt={player.name} data-ai-hint={player.avatarHint} />
                                                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold">{player.name}</p>
                                                        <p className="text-sm text-muted-foreground">{player.team}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-semibold text-primary">{player.elo}</TableCell>
                                            <TableCell className="hidden text-center sm:table-cell">
                                                <span className="text-green-600">{player.wins}</span> / <span className="text-red-600">{player.losses}</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={player.profileUrl}>
                                                        Перейти <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="achievements" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Все достижения</CardTitle>
                            <CardDescription>Открывайте новые награды и докажите свое мастерство.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {achievementCatalog.map((ach) => {
                                const Icon = achievementIcons[ach.icon as keyof typeof achievementIcons];
                                return (
                                    <Card key={ach.name} className="p-4 transition-shadow hover:shadow-md">
                                        <div className="flex items-start gap-4">
                                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border ${getRarityColor(ach.rarity)}`}>
                                                {Icon && <Icon className="h-6 w-6" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold">{ach.name}</p>
                                                <p className="text-xs text-muted-foreground">{ach.description}</p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <Badge variant="outline" className={`${getRarityColor(ach.rarity)}`}>{ach.rarity}</Badge>
                                                    <Badge variant="secondary">+{ach.points} XP</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
