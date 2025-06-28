'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Newspaper, Trophy, Users, Edit, Sparkles, Send, Loader2, Image as ImageIcon, MessageSquare, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { generatePlatformNews, type GeneratePlatformNewsOutput } from '@/ai/flows/generate-platform-news-flow';
import { generatePostImage } from '@/ai/flows/generate-post-image-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/lib/session-client';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const upcomingMatches = [
    { id: 'match-1', team1: 'Кибер Орлы', team2: 'Стальные Титаны', time: 'Завтра, 19:00', href:'/matches/cyber-eagles-vs-ice-dragons' },
    { id: 'match-2', team1: 'Призрачные Волки', team2: 'Теневые Коты', time: '28.09, 21:00', href:'#' },
];

// Define discriminated union for feed items
type PlatformNewsItem = GeneratePlatformNewsOutput['news'][0] & { type: 'platform_news' };

type UserPostItem = {
    type: 'user_post';
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    text: string;
    imageUrl?: string;
    imageHint?: string;
    timestamp: string;
};

type FeedItem = PlatformNewsItem | UserPostItem;

// --- Components for rendering different feed item types ---

const PlatformNewsCard = ({ item }: { item: PlatformNewsItem }) => {
    const categoryIcons = {
        match: Trophy,
        team: Users,
        player: Users,
        platform: Newspaper,
    };
    const Icon = categoryIcons[item.category] || Newspaper;
    return (
        <Card>
            <CardContent className="flex items-center space-x-4 p-4">
                <Icon className="h-6 w-6 text-muted-foreground" />
                <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.summary}</p>
                </div>
                <Button variant="outline" size="sm" asChild><Link href={item.href}>Подробнее</Link></Button>
            </CardContent>
        </Card>
    );
}

const UserPostCard = ({ item }: { item: UserPostItem }) => {
    return (
        <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0 p-4">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={item.author.avatar} data-ai-hint="user avatar" />
                    <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{item.author.name}</p>
                    <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
                <p className="whitespace-pre-wrap">{item.text}</p>
                {item.imageUrl && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                        <Image src={item.imageUrl} alt="AI generated post image" fill className="object-cover" data-ai-hint={item.imageHint} />
                    </div>
                )}
            </CardContent>
             <CardFooter className="flex justify-start gap-4 p-4 pt-0">
                <Button variant="ghost" size="sm"><ThumbsUp className="mr-2 h-4 w-4"/>Лайк</Button>
                <Button variant="ghost" size="sm"><MessageSquare className="mr-2 h-4 w-4"/>Комментировать</Button>
            </CardFooter>
        </Card>
    )
}

const CreatePostCard = ({ onPostCreated }: { onPostCreated: (post: UserPostItem) => void }) => {
    const { user } = useSession();
    const { toast } = useToast();
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePost = async () => {
        if (!text.trim() || !user) return;
        setIsLoading(true);
        try {
            // Generate image based on post text
            const imageResult = await generatePostImage(text);

            const newPost: UserPostItem = {
                type: 'user_post',
                id: `post-${Date.now()}`,
                author: {
                    name: user.name,
                    avatar: user.avatar,
                },
                text,
                imageUrl: imageResult.imageDataUri,
                imageHint: text.split(' ').slice(0, 2).join(' '),
                timestamp: 'Только что'
            };
            onPostCreated(newPost);
            setText('');
            toast({ title: 'Пост опубликован!', description: 'Ваш пост появился в ленте.' });
        } catch (error) {
            console.error("Failed to create post:", error);
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось сгенерировать изображение для поста.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Edit className="h-5 w-5" />Создать пост</CardTitle>
            </CardHeader>
            <CardContent>
                <Textarea 
                    placeholder="Что у вас нового?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isLoading}
                />
            </CardContent>
            <CardFooter className="justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ImageIcon className="h-4 w-4"/>
                    <span>AI сгенерирует изображение по тексту</span>
                </div>
                <Button onClick={handlePost} disabled={isLoading || !text.trim()}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Опубликовать
                </Button>
            </CardFooter>
        </Card>
    );
};


export default function DashboardPage() {
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const handlePostCreated = (newPost: UserPostItem) => {
        setFeedItems(prev => [newPost, ...prev]);
    }

    useEffect(() => {
        const fetchNews = async () => {
            setIsLoading(true);
            try {
                const result = await generatePlatformNews();
                const platformNews: PlatformNewsItem[] = result.news.map(item => ({ ...item, type: 'platform_news' }));
                setFeedItems(platformNews);
            } catch (error) {
                console.error("Failed to fetch AI news:", error);
                setFeedItems([
                  { type: 'platform_news', title: 'Не удалось загрузить новости', summary: 'Пожалуйста, попробуйте обновить страницу.', category: 'platform', href: '#' },
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, []);


    return (
        <div className="grid grid-cols-12 gap-6">
            <main className="col-span-12 lg:col-span-8 space-y-6">
                <CreatePostCard onPostCreated={handlePostCreated} />

                <Card>
                    <CardHeader>
                        <CardTitle>Лента активности</CardTitle>
                        <CardDescription>Последние события на платформе, сгенерированные AI и пользователями.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        ) : (
                            feedItems.map((item, index) => {
                                if (item.type === 'platform_news') {
                                    return <PlatformNewsCard key={index} item={item} />;
                                }
                                if (item.type === 'user_post') {
                                    return <UserPostCard key={item.id} item={item} />;
                                }
                                return null;
                            })
                        )}
                    </CardContent>
                </Card>
            </main>

            <aside className="col-span-12 lg:col-span-4 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Ближайшие матчи</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                {upcomingMatches.map(match => (
                                    <TableRow key={match.id}>
                                        <TableCell>
                                            <p className="font-semibold">{match.team1} vs {match.team2}</p>
                                            <p className="text-xs text-muted-foreground">{match.time}</p>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild><Link href={match.href}>К матчу</Link></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </aside>
        </div>
    );
}
