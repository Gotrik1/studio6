
'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Activity, ArrowRight, BadgeCheck, Coins, Crown, Gem, Handshake, Newspaper, Palette, PlayCircle, Shirt, Swords, Trophy, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const AnimatedCounter = ({ endValue, duration = 2000 }: { endValue: number, duration?: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const animationFrame = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * endValue));
            if (progress < 1) {
                requestAnimationFrame(animationFrame);
            }
        };
        requestAnimationFrame(animationFrame);
    }, [endValue, duration]);

    return <span className="font-headline font-bold">{count.toLocaleString()}</span>;
};

const ValueCard = ({ icon, title, children }: { icon: ReactNode, title: string, children: ReactNode }) => (
    <Popover>
        <PopoverTrigger asChild>
            <Card className="group cursor-pointer text-center p-6 transition-all hover:bg-primary/10 hover:border-primary hover:-translate-y-2">
                <div className="flex justify-center mb-4 text-primary transition-transform group-hover:scale-110">{icon}</div>
                <h3 className="font-headline text-xl font-bold">{title}</h3>
            </Card>
        </PopoverTrigger>
        <PopoverContent className="w-64">
            <div className="space-y-2">
                <h4 className="font-medium leading-none">{title}</h4>
                <p className="text-sm text-muted-foreground">{children}</p>
            </div>
        </PopoverContent>
    </Popover>
);

const economyBreakdownData = [
  { name: 'Награды за матчи', value: 450, color: 'hsl(var(--primary))' },
  { name: 'Покупки в магазине', value: 250, color: 'hsl(var(--accent))' },
  { name: 'Донаты и поддержка', value: 150, color: 'hsl(var(--secondary))' },
  { name: 'Создание контента', value: 100, color: 'hsl(var(--muted-foreground))' },
];

const topEarners = {
  players: [
    { name: "Alex 'CyberSlasher' Doe", change: 1250, avatar: 'https://placehold.co/40x40.png', avatarHint: 'esports player' },
    { name: "Верный Ларри", change: 800, avatar: 'https://placehold.co/40x40.png', avatarHint: 'sports fan' },
    { name: "Судья Джуди", change: 650, avatar: 'https://placehold.co/40x40.png', avatarHint: 'judge portrait' },
  ],
  teams: [
    { name: 'Кибер Орлы', change: 5300, avatar: 'https://placehold.co/40x40.png', avatarHint: 'eagle logo' },
    { name: 'Ледяные Драконы', change: 2100, avatar: 'https://placehold.co/40x40.png', avatarHint: 'dragon logo' },
    { name: 'Вихревые Гадюки', change: 1800, avatar: 'https://placehold.co/40x40.png', avatarHint: 'snake logo' },
  ]
};

const liveTransactions = [
  { description: "Alex 'CyberSlasher' Doe получил +15 PD за победу в матче", time: "10 сек назад" },
  { description: 'Команда "Кибер Орлы" купила "Командная рамка"', time: "45 сек назад" },
  { description: "Верный Ларри получил +5 PD за комментарий", time: "1 мин назад" },
  { description: 'Команда "Ледяные Драконы" получила +5000 PD за победу в турнире', time: "3 мин назад" },
];

export default function PDEconomyPage() {
    return (
        <div className="pd-economy-page space-y-12">
            <header className="relative text-center py-8 md:py-16 overflow-hidden rounded-lg bg-card shadow-inner-glow">
                 <div className="absolute inset-0" id="pd-coin-animation"></div>
                <h1 className="animated-slogan font-headline text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    <span>Играешь&nbsp;</span>
                    <span>—&nbsp;</span>
                    <span className="text-amber-400">влияешь&nbsp;</span>
                    <span>—&nbsp;</span>
                    <span>побеждаешь!</span>
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">ProDvor — твоя энергия в цифре!</p>
            </header>
            
            <section>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
                    <Card className="col-span-1 lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Как работает экономика ProDvor</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-8 items-center">
                            <div className="flex flex-col items-center gap-4 text-center">
                                <h3 className="font-headline text-2xl font-bold">Зарабатывай</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted"><Swords className="h-6 w-6 text-primary"/><span>Участвуй в матчах</span></div>
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted"><Trophy className="h-6 w-6 text-primary"/><span>Побеждай в турнирах</span></div>
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted"><Newspaper className="h-6 w-6 text-primary"/><span>Создавай контент</span></div>
                                </div>
                            </div>

                            <div className="text-center">
                                <ArrowRight size={48} className="mx-auto rotate-90 md:rotate-0 text-muted-foreground" />
                            </div>

                            <div className="flex flex-col items-center gap-4 text-center">
                                <h3 className="font-headline text-2xl font-bold">Трать</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted"><Shirt className="h-6 w-6 text-accent"/><span>Кастомные скины</span></div>
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted"><Palette className="h-6 w-6 text-accent"/><span>Темы для профиля</span></div>
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted"><BadgeCheck className="h-6 w-6 text-accent"/><span>Уникальные бейджи</span></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="text-center p-6 bg-gradient-to-br from-primary/90 to-primary">
                        <CardHeader className="p-0">
                           <Coins className="mx-auto h-16 w-16 text-primary-foreground/80 mb-4"/>
                           <CardTitle className="text-primary-foreground">Всего в обращении</CardTitle>
                           <CardDescription className="text-primary-foreground/70">Динамика платформы</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 mt-4">
                            <p className="text-5xl font-headline font-bold text-white">
                                <AnimatedCounter endValue={123456789} />
                                <span className="text-3xl text-amber-300 ml-1">PD</span>
                            </p>
                        </CardContent>
                    </Card>
                 </div>
            </section>

            <section>
                <h2 className="text-center font-headline text-3xl font-bold mb-8">Ключевые ценности PD</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <ValueCard icon={<Activity size={48} />} title="Активность">
                        Ваше участие в жизни платформы — ключ к заработку. Чем больше вы играете, тренируетесь и общаетесь, тем больше PD получаете.
                    </ValueCard>
                    <ValueCard icon={<Handshake size={48} />} title="Вклад">
                        Помогая другим, создавая полезный контент или выступая в роли судьи, вы делаете платформу лучше и получаете за это вознаграждение.
                    </ValueCard>
                    <ValueCard icon={<Crown size={48} />} title="Престиж">
                        Победы в турнирах и высокий ранг приносят не только славу, но и значительное количество PD. Ваш статус имеет реальную ценность.
                    </ValueCard>
                     <ValueCard icon={<Gem size={48} />} title="Уникальность">
                        PD позволяет вам выделиться. Тратьте их на редкие предметы и кастомизацию, чтобы показать свою индивидуальность всему сообществу.
                    </ValueCard>
                </div>
            </section>
            
            <section>
                <h2 className="text-center font-headline text-3xl font-bold mb-8">Экономика в цифрах</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Распределение PD</CardTitle>
                            <CardDescription>Источники получения и траты PD в экосистеме.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={economyBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                        {economyBreakdownData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                         <CardHeader>
                            <CardTitle>Живая лента</CardTitle>
                            <CardDescription>Последние транзакции.</CardDescription>
                        </CardHeader>
                         <CardContent className="space-y-4">
                            {liveTransactions.map((tx, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="mt-1 flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
                                    <div>
                                        <p className="text-sm">{tx.description}</p>
                                        <p className="text-xs text-muted-foreground">{tx.time}</p>
                                    </div>
                                </div>
                            ))}
                         </CardContent>
                    </Card>
                </div>
            </section>
            
            <section>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Лидеры по заработку (неделя)</CardTitle>
                            <CardDescription>Самые активные участники платформы.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {topEarners.players.map(player => (
                                <div key={player.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={player.avatar} alt={player.name} data-ai-hint={player.avatarHint} />
                                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{player.name}</span>
                                    </div>
                                    <Badge variant="secondary" className="text-green-600">
                                        <TrendingUp className="mr-1.5 h-4 w-4"/>
                                        +{player.change.toLocaleString()} PD
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Топ команд по заработку (неделя)</CardTitle>
                            <CardDescription>Самые успешные коллективы.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {topEarners.teams.map(team => (
                                <div key={team.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={team.avatar} alt={team.name} data-ai-hint={team.avatarHint} />
                                            <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{team.name}</span>
                                    </div>
                                    <Badge variant="default">
                                        <TrendingUp className="mr-1.5 h-4 w-4"/>
                                        +{team.change.toLocaleString()} PD
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                 </div>
            </section>

            <section>
                 <Card className="grid md:grid-cols-2 overflow-hidden shadow-lg">
                    <div className="relative group aspect-video">
                        <Image src="https://placehold.co/800x450.png" alt="Что такое PD видео" fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint="esports economy" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <PlayCircle className="h-20 w-20 text-white/70 transition-all group-hover:text-white group-hover:scale-110" />
                        </div>
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                        <h2 className="font-headline text-3xl font-bold">Что такое PD?</h2>
                        <p className="mt-2 text-muted-foreground">Это не просто цифры на счету. Это ваша репутация, ваш статус и ваша возможность влиять на мир ProDvor.</p>
                        <ul className="mt-4 space-y-2 list-disc list-inside">
                           <li><strong>Алексей &apos;CyberCat&apos;</strong> купил эксклюзивный скин &quot;Золотой Орел&quot; и попал на доску почета главной страницы.</li>
                           <li><strong>Команда &apos;Вихрь&apos;</strong> собрала донатами 50,000 PD на поездку на LAN-турнир.</li>
                           <li><strong>Елена &apos;Valkyrie&apos;</strong> потратила PD, чтобы забрендировать свой турнир в уникальном стиле.</li>
                        </ul>
                    </div>
                </Card>
            </section>

             <section className="text-center py-12">
                <Link href="/leaderboards">
                    <Button size="lg" className="pulsing-button h-14 px-10 text-lg font-bold">
                        <Coins className="mr-3 h-6 w-6"/>
                        Начать фармить PD
                    </Button>
                </Link>
            </section>
        </div>
    );
}
