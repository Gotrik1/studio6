
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  MoreHorizontal,
  Users,
  Trophy,
  Newspaper,
  Star,
} from "lucide-react";
import Image from "next/image";

const feedItems = [
  {
    id: 1,
    author: {
      name: "Команда 'Кибер Орлы'",
      avatar: "https://placehold.co/40x40.png",
      avatarHint: "eagle logo",
      href: "/teams/cyber-eagles",
    },
    timestamp: "2 часа назад",
    type: "team_news",
    content: {
      text: "Мы рады объявить о подписании нового игрока, Дмитрия 'Gadget' Кузнецова! Добро пожаловать в семью, Дима! 🔥",
    },
    stats: {
      likes: 125,
      comments: 18,
    },
  },
  {
    id: 2,
    author: {
      name: "ProDvor Tournaments",
      avatar: "https://placehold.co/40x40.png",
      avatarHint: "trophy icon",
      href: "#",
    },
    timestamp: "8 часов назад",
    type: "tournament_announcement",
    content: {
      text: "Регистрация на 'Autumn Cyber Clash 2024' открыта! Призовой фонд - $15,000. Не упусти свой шанс стать чемпионом!",
      image: "https://placehold.co/600x400.png",
      imageHint: "esports tournament poster",
    },
    stats: {
      likes: 340,
      comments: 56,
    },
  },
  {
    id: 3,
    author: {
      name: "Alex 'CyberSlasher' Doe",
      avatar: "https://placehold.co/40x40.png",
      avatarHint: "esports player",
      href: "/profile",
    },
    timestamp: "1 день назад",
    type: "player_post",
    content: {
      text: "Тяжелая игра против 'Вихревых Гадюк', но мы вырвали победу! Спасибо всем за поддержку. Готовимся к следующему матчу. #GoEagles",
      image: "https://placehold.co/600x400.png",
      imageHint: "intense gaming moment",
    },
    stats: {
      likes: 512,
      comments: 89,
    },
  },
  {
    id: 4,
    author: {
      name: "Система",
      avatar: "https://placehold.co/40x40.png",
      avatarHint: "system logo",
      href: "#",
    },
    timestamp: "2 дня назад",
    type: "system_update",
    content: {
      text: "Вышло обновление платформы! Добавлены новые достижения и улучшена система матчмейкинга. Ознакомьтесь с полным списком изменений в разделе 'Новости'.",
    },
    stats: {
      likes: 78,
      comments: 4,
    },
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'team_news':
      return <Users className="h-4 w-4 text-primary" />;
    case 'tournament_announcement':
      return <Trophy className="h-4 w-4 text-amber-500" />;
    case 'player_post':
      return <Star className="h-4 w-4 text-accent" />;
    default:
      return <Newspaper className="h-4 w-4 text-muted-foreground" />;
  }
};

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Создать пост</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full gap-2">
                <Textarea placeholder="Что у вас нового?" rows={3} />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 text-muted-foreground">
                    <Button variant="ghost" size="icon"><ImageIcon className="h-5 w-5"/></Button>
                  </div>
                  <Button>Опубликовать</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {feedItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={item.author.avatar} data-ai-hint={item.author.avatarHint} />
                        <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{item.author.name}</p>
                        <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                      </div>
                      <div className="hidden sm:block">{getTypeIcon(item.type)}</div>
                    </div>
                     <Button variant="ghost" size="icon"><MoreHorizontal className="h-5 w-5" /></Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{item.content.text}</p>
                  {item.content.image && (
                    <div className="overflow-hidden rounded-lg border">
                      <Image
                        src={item.content.image}
                        alt="Post image"
                        width={800}
                        height={400}
                        className="aspect-video w-full object-cover"
                        data-ai-hint={item.content.imageHint}
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 pt-4">
                    <div className="flex gap-4">
                         <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{item.stats.likes}</span>
                         </Button>
                         <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                             <span>{item.stats.comments}</span>
                         </Button>
                    </div>
                     <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        <span>Поделиться</span>
                     </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <aside className="col-span-12 lg:col-span-4">
          <div className="sticky top-4 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Фильтры</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm">Все</Button>
                    <Button variant="outline" size="sm">Мои команды</Button>
                    <Button variant="outline" size="sm">Турниры</Button>
                    <Button variant="outline" size="sm">Друзья</Button>
                    <Button variant="outline" size="sm">Рядом</Button>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Тренды недели</CardTitle>
                    <CardDescription>Самые обсуждаемые темы</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="text-sm font-semibold">#AutumnClash</div>
                    <div className="text-sm font-semibold">#ValorantPro</div>
                    <div className="text-sm font-semibold">#КиберОрлыВперед</div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Рекомендации</CardTitle>
                     <CardDescription>Вам может быть интересно</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="snake logo" />
                        <AvatarFallback>ВГ</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Вихревые Гадюки</p>
                        <p className="text-xs text-muted-foreground">Команда</p>
                      </div>
                      <Button variant="outline" size="sm">Подписаться</Button>
                    </div>
                </CardContent>
            </Card>
          </div>
      </aside>
    </div>
  );
}
