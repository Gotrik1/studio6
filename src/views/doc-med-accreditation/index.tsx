
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { useToast } from '@/shared/hooks/use-toast';
import { FileUp, Send } from 'lucide-react';

export function MedAccreditationPage() {
    const { toast } = useToast();

    const handleSubmit = () => {
        toast({
            title: "Заявка отправлена!",
            description: "Ваша заявка на аккредитацию будет рассмотрена в ближайшее время.",
        });
    };

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Аккредитация медицинских организаций</h1>
                <p className="text-muted-foreground">
                    Подайте заявку, чтобы стать официальным медицинским партнером мероприятий на платформе ProDvor.
                </p>
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Форма заявки</CardTitle>
                    <CardDescription>Пожалуйста, предоставьте информацию о вашей организации и прикрепите необходимые документы.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="org-name">Название организации</Label>
                        <Input id="org-name" placeholder="ООО 'МедПомощь'" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="org-license">Номер лицензии</Label>
                        <Input id="org-license" placeholder="Л041-01137-77/00368451" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="org-contact">Контактное лицо</Label>
                        <Input id="org-contact" placeholder="Иванов Иван Иванович, +7 (999) 123-45-67" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="org-docs">Документы (лицензия, сертификаты)</Label>
                        <Button variant="outline" className="w-full justify-center gap-2">
                            <FileUp className="h-4 w-4" />
                            Загрузить файлы
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="org-comment">Комментарий</Label>
                        <Textarea id="org-comment" placeholder="Любая дополнительная информация..."/>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleSubmit}>
                        <Send className="mr-2 h-4 w-4" />
                        Отправить заявку
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
