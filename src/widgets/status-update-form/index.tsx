'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { useSession } from '@/shared/lib/session/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { useToast } from '@/shared/hooks/use-toast';
import { Send } from 'lucide-react';

export function StatusUpdateForm() {
    const { user } = useSession();
    const { toast } = useToast();
    const [text, setText] = useState('');

    const handlePost = () => {
        if (!text.trim()) return;
        // In a real app, this would call an API
        toast({
            title: "Статус опубликован!",
            description: "Ваш пост появится в ленте новостей.",
        });
        setText('');
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
                        />
                        <div className="flex justify-end">
                            <Button onClick={handlePost} size="sm">
                                <Send className="mr-2 h-4 w-4" />
                                Опубликовать
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
