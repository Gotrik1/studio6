
'use client';

import { useState, useMemo } from "react";
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
  Coins,
  BrainCircuit,
  Loader2,
  FileQuestion,
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { PD_RATES, PD_SOURCE_DETAILS } from "@/config/gamification";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { generateContent } from "@/ai/flows/generate-content-flow";
import { useSession } from "@/lib/session-client";
import { cn } from "@/lib/utils";

const initialFeedItems = [
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
    likedByUser: false,
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
    likedByUser: false,
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
    likedByUser: true,
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
    likedByUser: false,
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

type FeedItem = (typeof initialFeedItems)[0];

const filterButtons = [
    { label: "Все", type: "all" },
    { label: "Мои команды", type: "team_news" },
    { label: "Турниры", type: "tournament_announcement" },
    { label: "Друзья", type: "player_post" },
    { label: "Рядом", type: "nearby" }, // Placeholder, no logic for this yet
];

export default function DashboardPage() {
  const { user } = useSession();
  const { toast } = useToast();
  const [postCount, setPostCount] = useState(0);
  const [postContent, setPostContent] = useState("");
  const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItems);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredFeedItems = useMemo(() => {
    if (activeFilter === "all") {
      return feedItems;
    }
    if (activeFilter === "nearby") { // No data for this filter yet
      return [];
    }
    return feedItems.filter(item => item.type === activeFilter);
  }, [feedItems, activeFilter]);

  const handlePublish = () => {
    if (!postContent.trim() || !user) {
      toast({
          variant: "destructive",
          title: "Пустой пост",
          description: "Вы не можете опубликовать пустой пост.",
      });
      return;
    }

    const newPost: FeedItem = {
      id: Date.now(),
      author: {
        name: user.name,
        avatar: user.avatar,
        avatarHint: "user avatar",
        href: "/profile",
      },
      timestamp: "только что",
      type: "player_post",
      content: {
        text: postContent,
      },
      stats: {
        likes: 0,
        comments: 0,
      },
      likedByUser: false,
    };
    
    setFeedItems([newPost, ...feedItems]);
    
    const newCount = postCount + 1;
    let rate;
    let description;

    if (newCount === 1) {
      rate = PD_RATES.MEDIA_POST_TIER_1;
      description = PD_SOURCE_DETAILS.MEDIA_POST_TIER_1.description;
    } else if (newCount === 2) {
      rate = PD_RATES.MEDIA_POST_TIER_2;
      description = PD_SOURCE_DETAILS.MEDIA_POST_TIER_2.description;
    } else if (newCount === 3) {
      rate = PD_RATES.MEDIA_POST_TIER_3;
      description = PD_SOURCE_DETAILS.MEDIA_POST_TIER_3.description;
    } else {
      toast({
          title: "Пост опубликован!",
          description: "Вы уже получили максимальную награду за посты на сегодня.",
      });
      setPostContent("");
      return;
    }

    setPostCount(newCount);
    
    toast({
        title: (
            <div className="flex items-center">
                <Coins className="mr-2 h-5 w-5 text-amber-400" />
                <span>+{rate} PD</span>
            </div>
        ),
        description: description,
    });
    setPostContent("");
  };

  const handleGeneratePost = async () => {
    if (!aiTopic.trim()) return;
    setIsGenerating(true);
    try {
        const result = await generateContent({
            topic: aiTopic,
            tone: 'enthusiastic',
            contentType: 'news post'
        });
        setPostContent(result.generatedText);
        setIsAiDialogOpen(false);
        setAiTopic("");
        toast({
            title: "Контент сгенерирован!",
            description: "Ваш пост готов к публикации.",
        });
    } catch (e) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Ошибка генерации",
            description: "Не удалось сгенерировать контент.",
        });
    } finally {
        setIsGenerating(false);
    }
  };

  const handleLike = (itemId: number) => {
    setFeedItems(prevItems =>
        prevItems.map(item => {
            if (item.id === itemId) {
                const liked = !item.likedByUser;
                const newLikes = liked ? item.stats.likes + 1 : item.stats.likes - 1;
                return {
                    ...item,
                    likedByUser: liked,
                    stats: { ...item.stats, likes: newLikes },
                };
            }
            return item;
        })
    );
  };


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
                <Textarea
                  placeholder="Что у вас нового?"
                  rows={3}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 text-muted-foreground">
                    <Button variant="ghost" size="icon"><ImageIcon className="h-5 w-5"/></Button>
                     <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <BrainCircuit className="h-5 w-5 text-primary" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Сгенерировать пост с помощью ИИ</DialogTitle>
                                <DialogDescription>
                                    Введите тему, и ИИ напишет пост для вас. Вы сможете отредактировать его перед публикацией.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ai-topic">Тема поста</Label>
                                    <Input 
                                        id="ai-topic"
                                        placeholder="Например, 'победа Кибер Орлов в финале'"
                                        value={aiTopic}
                                        onChange={(e) => setAiTopic(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleGeneratePost} disabled={isGenerating} className="w-full">
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Генерация...
                                        </>
                                    ) : 'Сгенерировать'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                  </div>
                  <Button onClick={handlePublish}>Опубликовать</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {filteredFeedItems.length > 0 ? (
                filteredFeedItems.map((item) => (
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
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="flex items-center gap-2"
                                  onClick={() => handleLike(item.id)}
                                >
                                    <ThumbsUp className={cn("h-4 w-4", item.likedByUser && "fill-current text-primary")} />
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
                ))
            ) : (
                <Card className="flex h-64 flex-col items-center justify-center gap-4 border-2 border-dashed">
                    <FileQuestion className="h-12 w-12 text-muted-foreground" />
                    <div className="text-center">
                        <CardTitle>Нет новостей</CardTitle>
                        <CardDescription className="mt-2">Попробуйте выбрать другой фильтр или опубликуйте что-нибудь!</CardDescription>
                    </div>
                </Card>
            )}
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
                    {filterButtons.map(filter => (
                        <Button 
                            key={filter.label} 
                            variant={activeFilter === filter.type ? "secondary" : "outline"} 
                            size="sm"
                            onClick={() => setActiveFilter(filter.type)}
                            disabled={filter.type === 'nearby'}
                        >
                            {filter.label}
                        </Button>
                    ))}
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
