'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { useSession } from '@/shared/lib/session/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { useToast } from '@/shared/hooks/use-toast';
import { Send, Loader2 } from 'lucide-react';
import { postStatus } from '@/entities/feed/api/feed';

export function StatusUpdateForm() {
    const { user } = useSession();
    const { toast } = useToast();
    const [text, setText] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    const handlePost = async () => {
        if (!text.trim()) return;
        setIsPosting(true);
        
        const result = await postStatus(text);

        if (result.success) {
            toast({
                title: "Статус опубликован!",
                description: "Ваш пост скоро появится в ленте новостей.",
            });
            setText('');
        } else {
             toast({
                variant: 'destructive',
                title: "Ошибка",
                description: result.error || "Не удалось опубликовать статус.",
            });
        }

        setIsPosting(false);
    };

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <Avatar>
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="w-full space-y-2">
                        <Textarea 
                            placeholder="Что у вас нового?" 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            disabled={isPosting}
                        />
                        <div className="flex justify-end">
                            <Button onClick={handlePost} size="sm" disabled={isPosting || !text.trim()}>
                                {isPosting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                Опубликовать
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
