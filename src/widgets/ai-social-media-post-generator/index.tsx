'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { Loader2, Sparkles, FileText, Image as ImageIcon, Copy, Share2 } from 'lucide-react';
import { Skeleton } from '@/shared/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { useToast } from '@/shared/hooks/use-toast';
import { Separator } from '@/shared/ui/separator';
import { generateSocialMediaPost, type GenerateSocialMediaPostOutput, type GenerateSocialMediaPostInput } from '@/shared/api/genkit/flows/generate-social-media-post-flow';
import { generatePostImage } from '@/shared/api/genkit/flows/generate-post-image-flow';
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
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

    const handleGeneratePost = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        setGeneratedImage(null);

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

    const handleGenerateImage = async () => {
        if (!result?.imagePrompt) return;
        setIsGeneratingImage(true);
        try {
            const imageResult = await generatePostImage(result.imagePrompt);
            setGeneratedImage(imageResult.imageDataUri);
        } catch (e) {
            console.error("Image generation failed:", e);
            toast({
                variant: 'destructive',
                title: 'Ошибка генерации изображения',
            });
        } finally {
            setIsGeneratingImage(false);
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
                    Сгенерировать текст и хештеги
                </Button>
            </CardContent>
            
            {(isLoading || error || result) && <Separator className="my-4" />}

            <CardContent className="space-y-4">
                {isLoading && <Skeleton className="h-48 w-full" />}
                {error && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                
                {result && (
                    <div className="space-y-4 animate-in fade-in-50">
                        <div className="space-y-2">
                            <Label>Сгенерированный текст</Label>
                            <Textarea readOnly value={result.postText} className="h-32 bg-muted"/>
                        </div>
                        <div className="space-y-2">
                             <Label>Хештеги</Label>
                             <p className="text-sm text-primary font-medium">{result.hashtags.join(' ')}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleCopyText(`${result.postText}\n\n${result.hashtags.join(' ')}`)}>
                            <Copy className="mr-2 h-4 w-4"/>Копировать все
                        </Button>
                        <Separator />
                        <div className="space-y-2">
                            <Label>Изображение для поста</Label>
                            {isGeneratingImage ? <Skeleton className="aspect-square w-full rounded-md" /> : (
                                generatedImage ? (
                                    <NextImage src={generatedImage} alt="Сгенерированное изображение" width={512} height={512} className="rounded-md border aspect-square object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-md bg-muted">
                                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                )
                            )}
                            <Button onClick={handleGenerateImage} disabled={isGeneratingImage}>
                                 {isGeneratingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                                Сгенерировать изображение
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>

             {result && generatedImage && (
                <CardFooter>
                    <Button className="w-full">
                        <Share2 className="mr-2 h-4 w-4"/> Опубликовать
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
