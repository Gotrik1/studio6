
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useToast } from '@/shared/hooks/use-toast';

const tiers = [
    {
        name: 'Стандарт',
        price: 'Бесплатно',
        description: 'Базовый функционал для всех игроков.',
        features: [
            'Создание профиля игрока и команды',
            'Участие в открытых турнирах',
            'Доступ к ленте новостей и чатам',
        ],
        isCurrent: true,
    },
    {
        name: 'PRO-игрок',
        price: '$5/мес',
        description: 'Для амбициозных игроков, стремящихся к максимуму.',
        features: [
            'Все возможности "Стандарта"',
            'Глубокий AI-анализ производительности',
            'AI-генератор аватаров и баннеров',
            'Значок PRO в профиле и приоритет в поиске',
            'Доступ к эксклюзивным квестам',
        ],
        isPopular: true,
    },
    {
        name: 'PRO-команда',
        price: '$20/мес',
        description: 'Все инструменты для управления и развития профессиональной команды.',
        features: [
            '5 PRO-подписок для игроков',
            'AI-ассистент для анализа командной игры',
            'AI-генератор питчей для спонсоров',
            'Расширенное управление командой',
            'Приоритетная поддержка',
        ],
    },
];

export function MonetizationPage() {
    const { toast } = useToast();

    const handleSubscribe = (tierName: string) => {
        toast({
            title: 'Подписка оформлена!',
            description: `Вы успешно подписались на тариф "${tierName}".`,
        });
    };

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Монетизация и PRO-подписки</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Поддержите платформу и получите доступ к эксклюзивным функциям, которые помогут вам и вашей команде достичь новых высот.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {tiers.map((tier) => (
                    <Card key={tier.name} className={cn("flex flex-col", tier.isPopular && "border-primary ring-2 ring-primary shadow-lg")}>
                        <CardHeader className="text-center">
                            <CardTitle className="font-headline">{tier.name}</CardTitle>
                            <p className="text-4xl font-bold">{tier.price}</p>
                            <CardDescription>{tier.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3">
                                {tier.features.map((feature, i) => (
                                    <li key={i} className="flex items-start text-sm">
                                        <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className="w-full" 
                                disabled={tier.isCurrent}
                                onClick={() => handleSubscribe(tier.name)}
                            >
                                {tier.isCurrent ? 'Ваш текущий план' : 'Выбрать'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
