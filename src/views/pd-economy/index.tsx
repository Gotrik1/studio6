
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/shared/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Coins, TrendingUp, TrendingDown, ShieldCheck, ShoppingCart } from 'lucide-react';
import { pdRules, quests as questsData } from '@/shared/config/gamification';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/shared/lib/utils';
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { usePDEconomy } from '@/app/providers/pd-provider';

const StatCard = ({ title, value, icon: Icon, className }: { title: string, value: string, icon: React.ElementType, className?: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={cn("h-4 w-4 text-muted-foreground", className)} />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value} PD</div>
        </CardContent>
    </Card>
);

export function PDEconomyPage() {
    const { history, balance } = usePDEconomy();

    const totalEarned = history.filter(item => item.value > 0).reduce((sum, item) => sum + item.value, 0);
    const totalSpent = history.filter(item => item.value < 0).reduce((sum, item) => sum + item.value, 0);
    
    const earningRules = pdRules.filter(rule => rule.type === 'credit');
    const spendingRules = pdRules.filter(rule => rule.type === 'debit');
    
    const allQuests = [...questsData.daily, ...questsData.weekly, ...questsData.special];

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Экономика ProDvor</h1>
                <p className="text-muted-foreground max-w-2xl">
                    Узнайте всё о PD — нашей внутренней валюте, которую можно заработать за активность и потратить на крутые вещи.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard title="Текущий баланс" value={balance.toLocaleString('ru-RU')} icon={Coins} className="text-amber-500" />
                <StatCard title="Всего заработано" value={totalEarned.toLocaleString('ru-RU')} icon={TrendingUp} className="text-green-500" />
                <StatCard title="Всего потрачено" value={Math.abs(totalSpent).toLocaleString('ru-RU')} icon={TrendingDown} className="text-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><TrendingUp className="text-green-500"/> Как заработать PD?</CardTitle>
                        <p className="text-sm text-muted-foreground">Выполняйте действия на платформе, чтобы пополнять свой баланс.</p>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {earningRules.map(rule => (
                                <li key={rule.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                                    <span>{rule.description}</span>
                                    <span className="font-bold text-green-500">+{rule.value} PD</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><TrendingDown className="text-red-500"/> На что потратить PD?</CardTitle>
                        <p className="text-sm text-muted-foreground">Используйте заработанные PD для покупки товаров и услуг.</p>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                             {spendingRules.map(rule => (
                                <li key={rule.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                                    <span>{rule.description}</span>
                                    <span className="font-bold text-red-500">{rule.value} PD</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                         <Button asChild className="w-full">
                            <Link href="/store">Перейти в магазин <ShoppingCart className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShieldCheck /> Квесты</CardTitle>
                        <p className="text-sm text-muted-foreground">Выполняйте задания, чтобы заработать PD.</p>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {allQuests.slice(0, 5).map(quest => {
                                const isCompleted = quest.progress >= quest.goal;
                                return (
                                    <li key={quest.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                                        <span className={cn(isCompleted && 'line-through text-muted-foreground')}>{quest.title}</span>
                                        <span className="font-bold text-green-500">+{quest.reward} PD</span>
                                    </li>
                                )
                            })}
                        </ul>
                    </CardContent>
                    <CardFooter>
                         <Button asChild variant="outline" className="w-full">
                            <Link href="/quests">Все квесты</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            
            <Card>
                 <CardHeader>
                    <CardTitle>История транзакций</CardTitle>
                    <p className="text-sm text-muted-foreground">Полная история ваших начислений и списаний PD.</p>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Дата</TableHead>
                                <TableHead>Источник</TableHead>
                                <TableHead className="text-right">Сумма</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.map((tx) => {
                                const rule = pdRules.find(r => r.id === tx.source);
                                return (
                                    <TableRow key={tx.id}>
                                        <TableCell>
                                            {format(new Date(tx.timestamp), "d MMMM yyyy, HH:mm", { locale: ru })}
                                        </TableCell>
                                        <TableCell>{rule?.description || tx.source}</TableCell>
                                        <TableCell className={cn("text-right font-medium", tx.value > 0 ? 'text-green-500' : 'text-red-500')}>
                                        {tx.value > 0 ? '+' : ''}{tx.value.toLocaleString('ru-RU')} PD
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
