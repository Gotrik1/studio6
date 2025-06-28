import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PD_RATES, PD_LIMITS } from "@/config/gamification";
import { achievementCatalog, lootboxPrizes } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Trophy, Gift, Coins, Shield, Crown, Rocket, Swords, Medal, Award, Star, Gem } from "lucide-react";
import { cn } from "@/lib/utils";

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


export default function GamificationAdminPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Управление геймификацией</h1>
                <p className="text-muted-foreground">
                    Обзор и настройка всех игровых механик, правил начисления очков и достижений.
                </p>
            </div>

            <Tabs defaultValue="rules">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="rules"><Gamepad2 className="mr-2 h-4 w-4" />Правила начисления PD</TabsTrigger>
                    <TabsTrigger value="achievements"><Trophy className="mr-2 h-4 w-4" />Каталог достижений</TabsTrigger>
                    <TabsTrigger value="lootboxes"><Gift className="mr-2 h-4 w-4" />Кейсы (Lootbox)</TabsTrigger>
                </TabsList>

                <TabsContent value="rules" className="mt-4">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                    </div>
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
                                                    <Badge variant="secondary" className="flex items-center gap-1"><Coins className="h-3 w-3"/> +{ach.points} XP</Badge>
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
            </Tabs>
        </div>
    );
}
