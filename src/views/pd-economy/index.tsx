
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Coins, ShoppingCart, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const earningMethods = [
    { title: 'Регистрация', description: 'Создайте аккаунт и получите стартовый бонус.', reward: '+50 PD' },
    { title: 'Заполнение профиля', description: 'Полностью заполненный профиль приносит награду.', reward: '+100 PD' },
    { title: 'Победы в матчах', description: 'За каждую победу в рейтинговом матче.', reward: 'от +10 PD' },
    { title: 'Участие в турнирах', description: 'Получайте PD за участие и призовые места.', reward: 'до 10,000 PD' },
    { title: 'Выполнение квестов', description: 'Завершайте ежедневные и еженедельные задания.', reward: 'Различные' },
    { title: 'Промо-акции', description: 'Участвуйте в акциях от наших партнеров.', reward: 'Различные' },
];

export function PDEconomyPage() {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <Coins className="mx-auto h-12 w-12 text-amber-500" />
                <h1 className="font-headline text-3xl font-bold tracking-tight">Экономика ProDvor</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Узнайте всё о ProDvor Dollars (PD) — нашей внутренней валюте, которая вознаграждает вашу активность и мастерство.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Как заработать PD?</CardTitle>
                        <CardDescription>Ваша активность на платформе — ваш доход.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {earningMethods.map((method) => (
                            <div key={method.title} className="flex items-center justify-between rounded-md border p-3">
                                <div>
                                    <p className="font-semibold">{method.title}</p>
                                    <p className="text-sm text-muted-foreground">{method.description}</p>
                                </div>
                                <div className="font-bold text-green-500 whitespace-nowrap">{method.reward}</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Где потратить PD?</CardTitle>
                            <CardDescription>Инвестируйте в свое развитие и кастомизацию.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="flex items-center gap-4 rounded-md border p-4">
                               <ShoppingCart className="h-8 w-8 text-primary" />
                               <div>
                                   <h3 className="font-semibold">Магазин ProDvor</h3>
                                   <p className="text-sm text-muted-foreground">Покупайте подписки, бустеры и предметы кастомизации.</p>
                               </div>
                               <Button asChild size="sm" variant="outline" className="ml-auto">
                                   <Link href="/store">В магазин <ArrowRight className="ml-2 h-4 w-4"/></Link>
                               </Button>
                           </div>
                           <div className="flex items-center gap-4 rounded-md border p-4">
                               <Target className="h-8 w-8 text-primary" />
                               <div>
                                   <h3 className="font-semibold">Участие в квестах</h3>
                                   <p className="text-sm text-muted-foreground">Некоторые премиальные квесты могут требовать взнос.</p>
                               </div>
                               <Button asChild size="sm" variant="outline" className="ml-auto">
                                   <Link href="/quests">К квестам <ArrowRight className="ml-2 h-4 w-4"/></Link>
                               </Button>
                           </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
