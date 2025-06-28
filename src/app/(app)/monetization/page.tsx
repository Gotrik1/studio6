'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, Star, Crown } from "lucide-react";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const plans = [
    {
        name: 'Новичок',
        price: { monthly: 0, yearly: 0 },
        description: 'Для тех, кто только начинает свой путь на ProDvor.',
        features: [
            'Создание/управление 1 командой',
            'Доступ к базовой статистике',
            'Участие в бесплатных турнирах',
            'Стандартная поддержка'
        ],
        isMostPopular: false,
        buttonText: 'Ваш текущий план',
        isCurrent: true,
    },
    {
        name: 'PRO',
        price: { monthly: 9.99, yearly: 99.99 },
        description: 'Раскройте свой потенциал с расширенными возможностями.',
        features: [
            'Все возможности плана "Новичок"',
            'Создание/управление до 3 команд',
            'PRO-значок в профиле',
            'Расширенная статистика и аналитика',
            'Генерация AI-планов тренировок',
            'Приоритетная поддержка',
            'Отсутствие рекламы',
        ],
        isMostPopular: true,
        buttonText: 'Перейти на PRO',
        isCurrent: false,
    },
    {
        name: 'Легенда',
        price: { monthly: 19.99, yearly: 199.99 },
        description: 'Для настоящих лидеров, которые хотят максимум.',
        features: [
            'Все возможности плана PRO',
            'Неограниченное количество команд',
            'Значок Легенды и рамка аватара',
            'Полный доступ к AI-инструментам',
            'Ежемесячный кейс с предметами',
            'Ранний доступ к новым функциям',
        ],
        isMostPopular: false,
        buttonText: 'Стать Легендой',
        isCurrent: false,
    }
];

export default function MonetizationPage() {
    const { toast } = useToast();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const handleSubscription = (planName: string) => {
        toast({
            title: 'Подписка оформляется...',
            description: `Вы выбрали план "${planName}". В реальном приложении здесь был бы переход к оплате.`,
        });
        // Here you would integrate a payment provider like Stripe
    };
    
    return (
        <div className="flex flex-col items-center space-y-8">
            <div className="text-center space-y-2">
                <h1 className="font-headline text-4xl font-bold">Выберите свой план</h1>
                <p className="text-lg text-muted-foreground">
                    Получите доступ к эксклюзивным функциям и поддержите развитие платформы.
                </p>
            </div>

            <div className="flex items-center space-x-2">
                <Label htmlFor="billing-cycle">Ежемесячно</Label>
                <Switch 
                    id="billing-cycle" 
                    onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
                />
                <Label htmlFor="billing-cycle">Ежегодно</Label>
                <span className="text-sm font-medium text-primary ml-2">(Сэкономьте ~17%!)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                {plans.map((plan) => (
                    <Card key={plan.name} className={cn(
                        "flex flex-col",
                        plan.isMostPopular && "border-2 border-primary shadow-lg"
                    )}>
                        {plan.isMostPopular && (
                            <div className="w-full bg-primary text-center py-1 text-sm font-semibold text-primary-foreground">
                                Самый популярный
                            </div>
                        )}
                        <CardHeader className="items-center text-center">
                            <div className="mb-4 text-primary">
                                {plan.name === 'Новичок' && <Star className="h-10 w-10" />}
                                {plan.name === 'PRO' && <Crown className="h-10 w-10" />}
                                {plan.name === 'Легенда' && <Star className="h-10 w-10 fill-primary" />}
                            </div>
                            <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-6">
                            <div className="text-center">
                                <span className="font-headline text-4xl font-bold">
                                    ${billingCycle === 'monthly' ? plan.price.monthly : (plan.price.yearly / 12).toFixed(2)}
                                </span>
                                <span className="text-muted-foreground">/ месяц</span>
                                {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                                     <p className="text-xs text-muted-foreground">Оплата за год: ${plan.price.yearly}</p>
                                )}
                            </div>
                            <ul className="space-y-3 text-sm">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <Check className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className="w-full" 
                                size="lg" 
                                disabled={plan.isCurrent}
                                variant={plan.isMostPopular ? 'default' : 'outline'}
                                onClick={() => handleSubscription(plan.name)}
                            >
                                {plan.buttonText}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}