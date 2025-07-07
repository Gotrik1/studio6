

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { Loader2, FileText, Share2, Copy, Download, Sparkles } from 'lucide-react';
import { Skeleton } from '@/shared/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { useToast } from '@/shared/hooks/use-toast';
import { Separator } from '@/shared/ui/separator';
import { generateSocialMediaPost, type GenerateSocialMediaPostOutput, type GenerateSocialMediaPostInput } from '@/shared/api/genkit/flows/generate-social-media-post-flow';
import NextImage from 'next/image';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui/select';

const mockTeamInfo = {
    teamName: "Дворовые Атлеты",
};

export function AiSocialMediaPostGenerator() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<GenerateSocialMediaPostOutput | null>(null);
    const [postType, setPostType] = useState<GenerateSocialMediaPostInput['postType']>('match_announcement');
    const [context, setContext] = useState("Предстоящий матч против 'Соколы' в 20:00. Это будет битва за первое место в лиге!");

    const handleGeneratePost = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const postResult = await generateSocialMediaPost({
                ...mockTeamInfo,
                postType,
                context,
            });
            setResult(postResult);
        } catch (e) {
            console.error("Post generation failed:", e);
            setError("Не удалось сгенерировать пост.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyText = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
        toast({ title: 'Текст скопирован!' });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>SMM-Ассистент</CardTitle>
                <CardDescription>Создавайте контент для социальных сетей вашей команды.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label>Тип поста</Label>
                        <Select value={postType} onValueChange={(v) => setPostType(v as GenerateSocialMediaPostInput['postType'])}>
                            <SelectTrigger>
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="match_announcement">Анонс матча</SelectItem>
                                <SelectItem value="player_highlight">Хайлайт игрока</SelectItem>
                                <SelectItem value="general_update">Общее объявление</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="smm-context">Контекст для поста</Label>
                    <Textarea 
                        id="smm-context"
                        placeholder="Например: 'Победа в турнире!' или 'Наш игрок Sonic сделал эйс!'"
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        disabled={isLoading}
                        className="min-h-[80px]"
                    />
                </div>
                 <Button onClick={handleGeneratePost} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileText className="mr-2 h-4 w-4"/>}
                    Сгенерировать пост
                </Button>
            </CardContent>
            
            {(isLoading || error || result) && <Separator className="my-4" />}

            <CardContent className="space-y-4">
                {isLoading && (
                     <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="h-48 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="aspect-square w-full" />
                            </div>
                        </div>
                    </div>
                )}
                {error && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                
                {result && (
                     <div className="space-y-4 animate-in fade-in-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Сгенерированный пост</Label>
                                <Textarea readOnly value={result.postText} className="h-48 bg-muted"/>
                                <div className="space-y-1">
                                    <Label>Хештеги</Label>
                                    <p className="text-sm text-primary font-medium">{result.hashtags.join(' ')}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Изображение</Label>
                                <div className="relative aspect-square w-full overflow-hidden rounded-md border">
                                    <NextImage src={result.imageDataUri} alt="Сгенерированное изображение для поста" fill className="object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>

             {result && (
                <CardFooter className="flex-wrap gap-2">
                    <Button onClick={() => handleCopyText(`${result.postText}\n\n${result.hashtags.join(' ')}`)}>
                        <Copy className="mr-2 h-4 w-4"/>Копировать текст
                    </Button>
                    <Button variant="outline" asChild>
                        <a href={result.imageDataUri} download="post_image.png">
                            <Download className="mr-2 h-4 w-4"/> Скачать изображение
                        </a>
                    </Button>
                    <Button className="flex-grow sm:flex-grow-0">
                        <Share2 className="mr-2 h-4 w-4"/> Опубликовать
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
