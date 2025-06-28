import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSession } from "@/lib/session";
import { Award, Users, Trophy, Target, Medal, Share2, MapPin, Activity, GalleryHorizontal, Briefcase, BarChart3, Star, BrainCircuit, Link as LinkIcon, CheckCircle } from "lucide-react";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const achievements = [
  { name: "Лучший новичок", icon: Award, description: "Выиграть награду лучшего новичка сезона.", unlocked: true },
  { name: "Золотая нога", icon: Star, description: "Забить 50 голов за сезон.", unlocked: true },
  { name: "Чемпион турнира", icon: Trophy, description: "Выиграть крупный турнир.", unlocked: false },
  { name: "Топ-10 города", icon: Target, description: "Войти в топ-10 игроков своего города.", unlocked: true },
  { name: "Железный человек", icon: Medal, description: "Сыграть 100 матчей без замен.", unlocked: false },
  { name: "Командный игрок", icon: Users, description: "Отдать 50 голевых передач.", unlocked: true },
];

const teams = [
  { name: "Кибер Орлы", role: "Капитан", logo: "https://placehold.co/128x128.png", dataAiHint: "eagle logo" },
  { name: "Ночные Охотники", role: "Игрок", logo: "https://placehold.co/128x128.png", dataAiHint: "wolf logo" },
];

const recentMatches = [
  { id: 1, teamA: "Кибер Орлы", scoreA: 13, teamB: "Вихревые Гадюки", scoreB: 9, result: "victory", game: "Valorant", map: "Ascent" },
  { id: 2, teamA: "Кибер Орлы", scoreA: 7, teamB: "Квантовые Квазары", scoreB: 13, result: "defeat", game: "Valorant", map: "Bind" },
  { id: 3, teamA: "Ночные Охотники", scoreA: 16, teamB: "Багровые Крестоносцы", scoreB: 14, result: "victory", game: "CS:GO 2", map: "Mirage" },
];

const gallery = [
    { src: "https://placehold.co/600x400.png", alt: "Момент с турнира", dataAiHint: "esports gaming" },
    { src: "https://placehold.co/600x400.png", alt: "Командное фото", dataAiHint: "team photo" },
    { src: "https://placehold.co/600x400.png", alt: "Победный крик", dataAiHint: "celebration gaming" },
    { src: "https://placehold.co/600x400.png", alt: "Клатч-момент", dataAiHint: "intense gaming" },
];

const careerHistory = [
    { teamName: "Юниоры 'Пламя'", period: "2018 - 2020", role: "Нападающий", review: "Отличный старт карьеры, показал себя как перспективный игрок." },
    { teamName: "Городская лига 'Вымпел'", period: "2020 - 2022", role: "Полузащитник", review: "Стал ключевым игроком центра поля, много работал над выносливостью." },
    { teamName: "Кибер Орлы", period: "2022 - н.в.", role: "Капитан", review: "Взял на себя лидерские функции, привел команду к нескольким победам в региональных турнирах." },
]


export default async function ProfilePage() {
  const user = await getSession();
  if (!user) redirect('/auth');

  // Augment user data for this page example
  const userProfile = {
      ...user,
      location: "Москва, Россия",
      mainSport: "Valorant",
      status: "Капитан команды 'Кибер Орлы'",
      isVerified: true,
  }

  const initials = userProfile.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={userProfile.avatar} alt={userProfile.name} data-ai-hint="esports player" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
                <h1 className="font-headline text-3xl font-bold">{userProfile.name}</h1>
                {userProfile.isVerified && <CheckCircle className="h-6 w-6 text-primary" />}
            </div>
            <p className="text-muted-foreground">{userProfile.email}</p>
            <div className="flex flex-wrap justify-center gap-2 pt-2 sm:justify-start">
              <Badge>{userProfile.role}</Badge>
              <Badge variant="secondary">{userProfile.status}</Badge>
              <Badge variant="outline">PRO Пользователь</Badge>
            </div>
             <div className="flex items-center justify-center gap-4 pt-2 text-sm text-muted-foreground sm:justify-start">
                <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {userProfile.location}</div>
                <div className="flex items-center gap-1"><Activity className="h-4 w-4" /> {userProfile.mainSport}</div>
                 <div className="flex items-center gap-2">
                    <Link href="#" className="text-muted-foreground hover:text-primary"><LinkIcon className="h-4 w-4" /></Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary"><LinkIcon className="h-4 w-4" /></Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary"><LinkIcon className="h-4 w-4" /></Link>
                </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon"><BrainCircuit className="h-5 w-5"/></Button>
            <Button variant="outline" size="icon"><Share2 className="h-5 w-5"/></Button>
            <Button>Редактировать профиль</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Прогресс до Уровня 28</span>
              <span>2,300 / 5,000 XP</span>
            </div>
            <Progress value={46} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
           <TabsTrigger value="overview"><Activity className="mr-2 h-4 w-4"/>Обзор</TabsTrigger>
          <TabsTrigger value="stats"><BarChart3 className="mr-2 h-4 w-4"/>Статистика</TabsTrigger>
          <TabsTrigger value="career"><Briefcase className="mr-2 h-4 w-4"/>Карьера</TabsTrigger>
          <TabsTrigger value="achievements"><Trophy className="mr-2 h-4 w-4"/>Достижения</TabsTrigger>
          <TabsTrigger value="teams"><Users className="mr-2 h-4 w-4"/>Команды</TabsTrigger>
          <TabsTrigger value="gallery"><GalleryHorizontal className="mr-2 h-4 w-4"/>Галерея</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
            <Card>
                <CardHeader>
                    <CardTitle>Последние матчи</CardTitle>
                    <CardDescription>Результаты ваших недавних игр.</CardDescription>
                </CardHeader>
                <CardContent>
                    {recentMatches.length > 0 ? (
                        <div className="space-y-4">
                            {recentMatches.map((match) => (
                                <div key={match.id} className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="flex flex-col gap-1 text-center">
                                        <p className="font-semibold">{match.teamA}</p>
                                        <p className={`font-bold text-2xl ${match.scoreA > match.scoreB ? 'text-primary' : 'text-destructive'}`}>{match.scoreA}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">{match.game}</p>
                                        <p className="font-bold">VS</p>
                                        <Badge variant="outline">{match.map}</Badge>
                                    </div>
                                    <div className="flex flex-col gap-1 text-center">
                                        <p className="font-semibold">{match.teamB}</p>
                                        <p className={`font-bold text-2xl ${match.scoreB > match.scoreA ? 'text-primary' : 'text-destructive'}`}>{match.scoreB}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground">У вас еще нет сыгранных матчей.</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="stats">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Матчи</CardDescription>
                <CardTitle className="font-headline text-4xl">218</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Победы</CardDescription>
                <CardTitle className="font-headline text-4xl">152</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Поражения</CardDescription>
                <CardTitle className="font-headline text-4xl">61</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Голы</CardDescription>
                <CardTitle className="font-headline text-4xl">88</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="career">
            <Card>
                <CardHeader>
                    <CardTitle>История карьеры</CardTitle>
                    <CardDescription>Ваш путь от новичка до капитана.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   {careerHistory.map((item, index) => (
                       <div key={index} className="flex items-start gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                <Briefcase className="h-5 w-5 text-muted-foreground"/>
                            </div>
                            <div>
                                <h4 className="font-semibold">{item.teamName} <span className="text-sm font-normal text-muted-foreground">({item.period})</span></h4>
                                <p className="text-sm font-medium">Роль: {item.role}</p>
                                <p className="text-sm text-muted-foreground mt-1">{item.review}</p>
                            </div>
                       </div>
                   ))}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="achievements">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {achievements.map((ach) => (
                  <div key={ach.name} className={`flex flex-col items-center text-center ${ach.unlocked ? '' : 'opacity-40'}`}>
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${ach.unlocked ? 'border-accent bg-accent/20 text-accent' : 'border-dashed'}`}>
                      <ach.icon className="h-8 w-8" />
                    </div>
                    <p className="mt-2 font-semibold">{ach.name}</p>
                    <p className="text-xs text-muted-foreground">{ach.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="teams">
             <Card>
                <CardHeader>
                    <CardTitle>Мои команды</CardTitle>
                    <CardDescription>Команды, в которых вы состоите.</CardDescription>
                </CardHeader>
                <CardContent>
                    {teams.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {teams.map((team) => (
                                <Link href="#" key={team.name} className="block h-full">
                                    <Card className="flex h-full flex-col items-center p-6 text-center transition-all hover:shadow-lg">
                                    <Image 
                                        src={team.logo} 
                                        alt={`Логотип ${team.name}`} 
                                        width={80} 
                                        height={80} 
                                        className="rounded-full border"
                                        data-ai-hint={team.dataAiHint}
                                    />
                                    <CardTitle className="mt-4 font-headline">{team.name}</CardTitle>
                                    <CardDescription>{team.role}</CardDescription>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground">Вы еще не состоите ни в одной команде.</p>
                    )}
                </CardContent>
             </Card>
        </TabsContent>
        <TabsContent value="gallery">
            <Card>
                <CardHeader>
                    <CardTitle>Галерея</CardTitle>
                    <CardDescription>Ваши фото и видео с матчей.</CardDescription>
                </CardHeader>
                <CardContent>
                    {gallery.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {gallery.map((item, index) => (
                                <div key={index} className="overflow-hidden rounded-lg border">
                                    <Image 
                                        src={item.src} 
                                        alt={item.alt} 
                                        width={600} 
                                        height={400} 
                                        className="aspect-video h-full w-full object-cover transition-transform hover:scale-105"
                                        data-ai-hint={item.dataAiHint}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                         <p className="text-center text-muted-foreground">Ваша галерея пуста.</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
