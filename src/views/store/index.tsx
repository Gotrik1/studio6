
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { storeItems, type StoreItem } from '@/shared/lib/mock-data/store';
import { Coins, ShoppingCart, Loader2, Sparkles, ShieldCheck, Backpack, Megaphone, Handshake, DollarSign } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/shared/hooks/use-toast';
import { findEquipment, type FindEquipmentOutput } from '@/shared/api/genkit/flows/find-equipment-flow';
import { Textarea } from '@/shared/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { usePDEconomy } from '@/app/providers/pd-provider';
import Link from 'next/link';

function StoreItemCard({ item, onPurchase, disabled }: { item: StoreItem; onPurchase: (item: StoreItem) => void; disabled: boolean }) {
    return (
        <Card className="flex flex-col">
            <CardHeader className="p-0 relative h-40">
                <Image src={item.image} alt={item.name} fill className="object-cover rounded-t-lg" data-ai-hint={item.imageHint} />
            </CardHeader>
            <CardContent className="p-6 flex-1">
                <CardTitle>{item.name}</CardTitle>
                <CardDescription className="mt-2">{item.description}</CardDescription>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={() => onPurchase(item)} disabled={disabled}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {item.isRealMoney ? `Купить за $${item.price}` : (
                        <>
                            Купить за {item.price}
                            <Coins className="ml-1.5 h-4 w-4 text-amber-300" />
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}

const platformLinks = [
    { href: "/pd-economy", icon: Coins, title: "Экономика PD", description: "Ваш баланс и история транзакций." },
    { href: "/quests", icon: ShieldCheck, title: "Квесты", description: "Задания для получения наград." },
    { href: "/inventory", icon: Backpack, title: "Инвентарь", description: "Отслеживайте свое снаряжение." },
    { href: "/promotions", icon: Megaphone, title: "Промо-акции", description: "Специальные события и конкурсы." },
    { href: "/sponsors", icon: Handshake, title: "Центр спонсорства", description: "Найдите партнеров для команды." },
    { href: "/monetization", icon: DollarSign, title: "PRO Подписки", description: "Улучшите свой аккаунт." },
];

const PlatformLinkCard = ({ href, icon: Icon, title, description }: (typeof platformLinks)[0]) => (
    <Card className="hover:bg-muted/50 transition-colors h-full">
        <Link href={href} className="block p-4 h-full">
            <div className="flex items-start gap-4">
                <Icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
        </Link>
    </Card>
);

export function StorePage() {
    const { toast } = useToast();
    const { balance, addTransaction } = usePDEconomy();
    const [prompt, setPrompt] = useState('Легкая игровая мышь для шутеров');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<FindEquipmentOutput | null>(null);

    const handleSearch = async () => {
        if (!prompt) {
            setError('Пожалуйста, опишите, какой товар вы ищете.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const searchResult = await findEquipment(prompt);
            setResult(searchResult);
            if (searchResult.recommendations.length === 0) {
                 toast({
                    title: "Ничего не найдено",
                    description: "Попробуйте изменить ваш запрос.",
                });
            }
        } catch (e) {
            console.error(e);
            setError('Не удалось выполнить поиск. Попробуйте еще раз.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePurchase = (item: StoreItem) => {
        if (item.isRealMoney) {
            toast({
                title: 'Перенаправляем на страницу оплаты...',
                description: 'Эта функция будет реализована в продакшен-версии.',
            });
            return;
        }

        if (balance < item.price) {
            toast({
                variant: 'destructive',
                title: 'Недостаточно средств',
                description: `У вас ${balance} PD, а для покупки нужно ${item.price} PD.`,
            });
            return;
        }
        
        addTransaction(`Покупка: ${item.name}`, -item.price);
        toast({
            title: 'Покупка совершена!',
            description: `Вы успешно приобрели "${item.name}". С вашего счета списано ${item.price} PD.`,
        });
    };
    
    const itemsToDisplay = result ? result.recommendations : storeItems;

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Магазин</h1>
                <p className="text-muted-foreground">
                    Приобретайте подписки, бустеры и предметы кастомизации. Ваш баланс: <strong className="text-primary">{balance.toLocaleString('ru-RU')} PD</strong>
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Умный поиск товаров</CardTitle>
                    <CardDescription>Опишите что вы ищете, и наш AI-ассистент подберет лучшие варианты.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Textarea
                        placeholder="Например, 'футбольные бутсы для искусственного газона' или 'хочу недорогую, но качественную клавиатуру'"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                        className="min-h-[80px]"
                    />
                     {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Ошибка</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        {isLoading ? 'Идет поиск...' : 'Найти товары'}
                    </Button>
                </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading && Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-[380px] w-full" />
                ))}

                {!isLoading && itemsToDisplay.map(item => (
                    <StoreItemCard
                        key={item.id}
                        item={item}
                        onPurchase={handlePurchase}
                        disabled={!item.isRealMoney && balance < item.price}
                    />
                ))}
            </div>
            {!isLoading && itemsToDisplay.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                    <p>Товары не найдены. Попробуйте изменить фильтры или сбросить поиск.</p>
                </div>
            )}

            <div className="space-y-4 pt-6 mt-6 border-t">
                <h2 className="font-headline text-2xl font-bold">Разделы платформы</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {platformLinks.map(link => (
                        <PlatformLinkCard key={link.href} {...link} />
                    ))}
                </div>
            </div>
        </div>
    );
}
