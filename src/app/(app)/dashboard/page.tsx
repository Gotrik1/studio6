
'use client';

import { useState, useMemo, useEffect } from "react";
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
  Trash2,
  Volume2,
  AlertCircle,
  ClipboardList,
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
import { generatePostImage } from "@/ai/flows/generate-post-image-flow";
import { Skeleton } from "@/components/ui/skeleton";
import { textToSpeech } from "@/ai/flows/tts-flow";
import { aiTeamAssistant, type AiTeamAssistantOutput } from '@/ai/flows/ai-team-assistant';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { dailyQuests as initialDailyQuests, weeklyQuests as initialWeeklyQuests, type Quest } from "@/lib/mock-data/quests";
import { Badge } from "@/components/ui/badge";

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

export default function DashboardPage() {
  const { user } = useSession();
  const { toast } = useToast();
  const [postCount, setPostCount] = useState(0);
  const [postContent, setPostContent] = useState("");
  const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItems);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  const [postImage, setPostImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  const [loadingAudioId, setLoadingAudioId] = useState<number | null>(null);
  const [activeAudio, setActiveAudio] = useState<{ id: number; url: string; } | null>(null);

  const [assistantResult, setAssistantResult] = useState<AiTeamAssistantOutput | null>(null);
  const [isAssistantLoading, setIsAssistantLoading] = useState(true);
  const [assistantError, setAssistantError] = useState<string | null>(null);
  
  const [dailyQuests, setDailyQuests] = useState(initialDailyQuests);
  const [weeklyQuests, setWeeklyQuests] = useState(initialWeeklyQuests);

  useEffect(() => {
    async function getAssistantSummary() {
      setIsAssistantLoading(true);
      setAssistantError(null);
      try {
        const result = await aiTeamAssistant({
            teamActivity: "Последние матчи: победа 13-9 против 'Вихревых Гадюк', поражение 7-13 от 'Квантовых Квазаров'. Активность в чате высокая, обсуждается новая тактика на карте Ascent.",
            teamGoals: "Главная цель - войти в топ-3 на турнире 'Autumn Cyber Clash'. Второстепенная цель - улучшить винрейт на карте Bind.",
            relevantContent: "Анализ последней игры от тренера: https://example.com/analysis-bind-game"
        });
        setAssistantResult(result);
      } catch (e) {
        console.error("AI Assistant failed:", e);
        setAssistantError("Не удалось загрузить сводку от AI-ассистента.");
      } finally {
        setIsAssistantLoading(false);
      }
    }
    getAssistantSummary();
  }, []);

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
        ...(postImage && { image: postImage, imageHint: "AI generated" }),
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
      setPostImage(null);
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
    setPostImage(null);
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

  const handleGenerateImage = async () => {
    if (!postContent.trim()) {
      toast({
        variant: "destructive",
        title: "Пустой пост",
        description: "Сначала напишите что-нибудь, чтобы сгенерировать изображение.",
      });
      return;
    }
    setIsGeneratingImage(true);
    try {
      const result = await generatePostImage(postContent);
      setPostImage(result.imageDataUri);
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Ошибка генерации изображения",
        description: "Не удалось создать изображение. Попробуйте снова.",
      });
    } finally {
      setIsGeneratingImage(false);
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

  const handlePlayAudio = async (itemId: number, text: string) => {
    if (loadingAudioId === itemId || activeAudio?.id === itemId) return;
    setLoadingAudioId(itemId);
    setActiveAudio(null);
    try {
        const result = await textToSpeech(text);
        setActiveAudio({ id: itemId, url: result.audioDataUri });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Ошибка озвучивания",
            description: "Не удалось сгенерировать аудио для этого поста."
        });
    } finally {
        setLoadingAudioId(null);
    }
  }

  const handleClaimQuest = (questId: string, type: 'daily' | 'weekly') => {
    const questList = type === 'daily' ? dailyQuests : weeklyQuests;
    const setQuestList = type === 'daily' ? setDailyQuests : setWeeklyQuests;
    const quest = questList.find(q => q.id === questId);

    if (quest && quest.currentProgress >= quest.goal && !quest.isClaimed) {
        setQuestList(prev => prev.map(q => q.id === questId ? { ...q, isClaimed: true } : q));
        toast({
            title: (
              <div className="flex items-center">
                  <Coins className="mr-2 h-5 w-5 text-amber-400" />
                  <span>Награда получена!</span>
              </div>
            ),
            description: `Вы получили +${quest.reward} PD за выполнение задания "${quest.title}".`,
        });
        // Here you would also update the global PD balance
    }
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
                 {isGeneratingImage && <Skeleton className="mt-2 h-48 w-full rounded-lg" />}
                 {postImage && !isGeneratingImage && (
                    <div className="relative mt-2">
                        <Image src={postImage} alt="Сгенерированное изображение" width={800} height={400} className="rounded-lg border object-cover aspect-video"/>
                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => setPostImage(null)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 text-muted-foreground">
                    <Button variant="ghost" size="icon" onClick={handleGenerateImage} disabled={isGeneratingImage} title="Сгенерировать изображение по тексту">
                      {isGeneratingImage ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageIcon className="h-5 w-5 text-purple-500" />}
                    </Button>
                     <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" title="Сгенерировать текст поста">
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
            {feedItems.length > 0 ? (
                feedItems.map((item) => (
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
                         {activeAudio?.id === item.id && (
                            <audio src={activeAudio.url} autoPlay controls className="w-full h-10 mt-2" />
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
                                 <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="flex items-center gap-2"
                                    onClick={() => handlePlayAudio(item.id, item.content.text)}
                                    disabled={loadingAudioId === item.id}
                                    title="Озвучить пост"
                                >
                                  {loadingAudioId === item.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Volume2 className="h-4 w-4" />
                                  )}
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
                    <CardTitle className="flex items-center gap-2"><ClipboardList className="text-primary"/> Задания</CardTitle>
                    <CardDescription>Выполняйте задания, чтобы получить PD.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-sm mb-2">Ежедневные</h4>
                        <div className="space-y-3">
                        {dailyQuests.map((quest) => (
                            <div key={quest.id}>
                                <div className="flex items-center gap-2 text-sm">
                                    <quest.icon className="h-4 w-4 text-muted-foreground" />
                                    <span className="flex-1 font-medium">{quest.title}</span>
                                    <Badge variant="secondary" className="flex items-center gap-1"><Coins className="h-3 w-3" />+{quest.reward} PD</Badge>
                                </div>
                                <Progress value={(quest.currentProgress / quest.goal) * 100} className="mt-1 h-2" />
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-xs text-muted-foreground">{quest.description}</p>
                                     <Button 
                                        size="xs" 
                                        variant="link"
                                        disabled={quest.isClaimed || quest.currentProgress < quest.goal}
                                        onClick={() => handleClaimQuest(quest.id, 'daily')}
                                        className="text-xs h-auto p-0"
                                    >
                                        {quest.isClaimed ? 'Получено' : 'Забрать'}
                                    </Button>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-sm mb-2">Еженедельные</h4>
                         <div className="space-y-3">
                         {weeklyQuests.map((quest) => (
                            <div key={quest.id}>
                                <div className="flex items-center gap-2 text-sm">
                                    <quest.icon className="h-4 w-4 text-muted-foreground" />
                                    <span className="flex-1 font-medium">{quest.title}</span>
                                    <Badge variant="secondary" className="flex items-center gap-1"><Coins className="h-3 w-3" />+{quest.reward} PD</Badge>
                                </div>
                                <Progress value={(quest.currentProgress / quest.goal) * 100} className="mt-1 h-2" />
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-xs text-muted-foreground">{quest.description}</p>
                                     <Button 
                                        size="xs" 
                                        variant="link"
                                        disabled={quest.isClaimed || quest.currentProgress < quest.goal}
                                        onClick={() => handleClaimQuest(quest.id, 'weekly')}
                                        className="text-xs h-auto p-0"
                                    >
                                        {quest.isClaimed ? 'Получено' : 'Забрать'}
                                    </Button>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BrainCircuit className="text-primary"/>AI-ассистент команды</CardTitle>
                    <CardDescription>Краткая сводка и рекомендации для вашей команды.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isAssistantLoading && (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-4 w-1/2 mt-4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    )}
                    {assistantError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Ошибка</AlertTitle>
                            <AlertDescription>{assistantError}</AlertDescription>
                        </Alert>
                    )}
                    {assistantResult && (
                        <div className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-semibold">Сводка</h4>
                                <p className="text-muted-foreground">{assistantResult.summary}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">Рекомендации</h4>
                                <p className="text-muted-foreground">{assistantResult.suggestions}</p>
                            </div>
                        </div>
                    )}
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
