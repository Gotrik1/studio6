
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Shield, MapPin, CalendarDays, Users, Swords, Trophy, Newspaper, BarChart3, Star, Share2, Settings, Gem, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

const roster = [
  { name: "Alex 'CyberSlasher' Doe", role: "Капитан / Дуэлянт", avatar: "https://placehold.co/100x100.png", avatarHint: "esports player" },
  { name: "Maria 'Shadow' Petrova", role: "Смоукер", avatar: "https://placehold.co/100x100.png", avatarHint: "female gamer" },
  { name: "Ivan 'Beast' Orlov", role: "Страж", avatar: "https://placehold.co/100x100.png", avatarHint: "focused gamer" },
  { name: "Olga 'Phoenix' Smirnova", role: "Зачинщик", avatar: "https://placehold.co/100x100.png", avatarHint: "gamer with headphones" },
  { name: "Dmitry 'Gadget' Kuznetsov", role: "Зачинщик", avatar: "https://placehold.co/100x100.png", avatarHint: "tech savvy gamer" },
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
                        <Button><Users className="mr-2 h-5 w-5"/>Вступить в команду</Button>
                        <Button variant="secondary"><Settings className="mr-2 h-5 w-5"/>Управлять</Button>
                    </div>
                </CardHeader>
                <CardContent className="relative flex flex-col items-center gap-4 p-6 pt-0 text-center sm:flex-row sm:text-left">
                    <Avatar className="-mt-12 h-24 w-24 shrink-0 border-4 border-background sm:h-32 sm:w-32">
                        <AvatarImage src={team.logo} alt={team.name} data-ai-hint={team.logoHint} />
                        <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                    </Avatar>
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
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
                    <TabsTrigger value="roster"><Users className="mr-2 h-4 w-4"/>Состав</TabsTrigger>
                    <TabsTrigger value="matches"><Swords className="mr-2 h-4 w-4"/>Матчи</TabsTrigger>
                    <TabsTrigger value="stats"><BarChart3 className="mr-2 h-4 w-4"/>Статистика</TabsTrigger>
                    <TabsTrigger value="achievements"><Trophy className="mr-2 h-4 w-4"/>Достижения</TabsTrigger>
                    <TabsTrigger value="about"><Newspaper className="mr-2 h-4 w-4"/>О команде</TabsTrigger>
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
                            {roster.map(player => (
                                <Card key={player.name} className="flex flex-col items-center p-4 text-center transition-shadow hover:shadow-md">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={player.avatar} alt={player.name} data-ai-hint={player.avatarHint} />
                                        <AvatarFallback>{player.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div className="mt-2">
                                        <p className="font-semibold">{player.name}</p>
                                        <p className="text-sm text-muted-foreground">{player.role}</p>
                                    </div>
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
            </Tabs>
        </div>
    );
}
