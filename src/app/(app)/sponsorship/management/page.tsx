
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Megaphone, Users, PlusCircle, Edit, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import Image from 'next/image';
import { promotionsList as allPromotions } from '@/lib/mock-data/promotions';

// Mock data for this specific sponsor
const sponsorPromotions = allPromotions.filter(p => p.sponsor === 'GamerGear' || p.sponsor === 'TechSponsor');

const getStatusVariant = (status: string) => {
    switch (status) {
        case "Активна": return "default";
        case "Скоро": return "secondary";
        case "Завершена": return "outline";
        default: return "secondary";
    }
};

export default function SponsorshipManagementPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Спонсорский кабинет</h1>
                    <p className="text-muted-foreground">
                        Управляйте вашими рекламными кампаниями, отслеживайте эффективность и взаимодействуйте с сообществом.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/promotions/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Создать новую акцию
                    </Link>
                </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Общий бюджет</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$75,000</div>
                        <p className="text-xs text-muted-foreground">За все время</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Активные кампании</CardTitle>
                        <Megaphone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sponsorPromotions.filter(p => p.status === 'Активна').length}</div>
                        <p className="text-xs text-muted-foreground">Прямо сейчас</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Всего участников</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sponsorPromotions.reduce((acc, p) => acc + p.participants, 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Во всех кампаниях</p>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Мои акции</CardTitle>
                    <CardDescription>Список всех ваших активных и прошедших промо-акций.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {sponsorPromotions.map(promo => (
                        <Card key={promo.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 items-center">
                            <div className="md:col-span-1 flex items-center gap-4">
                                <Image src={promo.image} alt={promo.name} width={80} height={80} className="rounded-md object-cover" data-ai-hint={promo.imageHint} />
                                <div>
                                    <p className="font-semibold">{promo.name}</p>
                                    <Badge variant={getStatusVariant(promo.status)}>{promo.status}</Badge>
                                </div>
                            </div>
                            <div className="md:col-span-1">
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Участники</span>
                                        <span className="font-medium">{promo.participants} / 500</span>
                                    </div>
                                    <Progress value={(promo.participants / 500) * 100} />
                                </div>
                            </div>
                            <div className="md:col-span-1 flex justify-end gap-2">
                                <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                                <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
