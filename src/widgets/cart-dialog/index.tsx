
'use client';

import { useState } from 'react';
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { useCart } from '@/app/providers/cart-provider';
import { usePDEconomy } from '@/app/providers/pd-provider';
import { useToast } from '@/shared/hooks/use-toast';
import { ShoppingCart, Trash2, Coins, Loader2, CreditCard } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';
import { Input } from '@/shared/ui/input';

export function CartDialog() {
    const { toast } = useToast();
    const { items, removeItem, updateQuantity, clearCart, totalPricePD, totalPriceReal, isCartOpen, setIsCartOpen } = useCart();
    const { balance, addTransaction } = usePDEconomy();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = () => {
        if (balance < totalPricePD) {
            toast({
                variant: 'destructive',
                title: 'Недостаточно средств',
                description: `У вас ${balance} PD, а для покупки нужно ${totalPricePD} PD.`
            });
            return;
        }

        setIsCheckingOut(true);

        setTimeout(() => {
            // Process PD transaction
            if (totalPricePD > 0) {
                 addTransaction('Покупка в магазине', -totalPricePD);
            }
            
            // Handle real money items (mock)
            if (totalPriceReal > 0) {
                toast({
                    title: "Требуется оплата",
                    description: `Перенаправляем на страницу оплаты для покупки товаров на сумму $${totalPriceReal.toFixed(2)}.`,
                });
            }

            toast({
                title: 'Заказ успешно оформлен!',
                description: 'Спасибо за покупку.'
            });

            clearCart();
            setIsCheckingOut(false);
            setIsCartOpen(false);
        }, 1500);
    };

    return (
        <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><ShoppingCart /> Ваша корзина</DialogTitle>
                    <DialogDescription>Проверьте товары и перейдите к оформлению заказа.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[50vh] pr-4 -mr-4">
                    <div className="py-4 space-y-4">
                        {items.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">Ваша корзина пуста.</p>
                        ) : (
                            items.map(item => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md border aspect-square object-cover" data-ai-hint={item.imageHint}/>
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.name}</p>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span>{item.price}</span>
                                            {item.isRealMoney ? <CreditCard className="h-4 w-4 text-green-500" /> : <Coins className="h-4 w-4 text-amber-500" />}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            className="w-16 h-8 text-center"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                                            min="1"
                                        />
                                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
                {items.length > 0 && (
                     <div className="border-t pt-4 space-y-2">
                         <div className="flex justify-between font-semibold">
                            <span>Итого:</span>
                             <span>
                                {totalPricePD > 0 && `${totalPricePD.toLocaleString('ru-RU')} PD`}
                                {totalPricePD > 0 && totalPriceReal > 0 && ' + '}
                                {totalPriceReal > 0 && `$${totalPriceReal.toFixed(2)}`}
                            </span>
                         </div>
                         <p className="text-xs text-muted-foreground">Ваш баланс: {balance.toLocaleString('ru-RU')} PD</p>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCartOpen(false)}>Продолжить покупки</Button>
                    <Button onClick={handleCheckout} disabled={items.length === 0 || isCheckingOut}>
                        {isCheckingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ShoppingCart className="mr-2 h-4 w-4" />}
                        {isCheckingOut ? 'Обработка...' : 'Оформить заказ'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
