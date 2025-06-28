'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { Gamepad2, Users, Trophy } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function LandingPage() {
    const { theme } = useTheme();

    const featureCards = [
        {
            icon: <Users className="h-10 w-10 text-primary" />,
            title: "Создавайте команды",
            description: "Объединяйтесь с друзьями, создавайте свою команду и поднимайтесь в рейтинге."
        },
        {
            icon: <Trophy className="h-10 w-10 text-primary" />,
            title: "Участвуйте в турнирах",
            description: "Найдите или создайте турниры для любого уровня мастерства и соревнуйтесь за призы."
        },
        {
            icon: <Gamepad2 className="h-10 w-10 text-primary" />,
            title: "Для спорта и киберспорта",
            description: "Неважно, играете ли вы в футбол во дворе или в Valorant дома — мы вас поддержим."
        }
    ];

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
                <div className="container flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo className="h-6 w-6" />
                        <span className="font-bold font-headline">ProDvor</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href="/auth">Войти</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/auth">Регистрация</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="container grid grid-cols-1 items-center gap-8 py-12 md:grid-cols-2 md:py-24">
                    <div className="space-y-4 text-center md:text-left">
                        <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                            От дворового футбола до киберспорта
                        </h1>
                        <p className="max-w-xl text-lg text-muted-foreground">
                            ProDvor — это единая платформа для организации матчей, создания команд и отслеживания вашего спортивного пути.
                        </p>
                        <Button size="lg" asChild>
                            <Link href="/auth">Начать бесплатно</Link>
                        </Button>
                    </div>
                    <div>
                        <Image
                            src="https://placehold.co/600x400.png"
                            alt="Esports and sports montage"
                            width={600}
                            height={400}
                            className="rounded-lg shadow-xl"
                            data-ai-hint="sports esports montage"
                        />
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-muted py-12 md:py-24">
                    <div className="container space-y-12">
                         <div className="text-center">
                            <h2 className="font-headline text-3xl font-bold">Все инструменты для победы</h2>
                            <p className="mt-2 text-muted-foreground">Мы предоставляем всё необходимое для вашей спортивной карьеры.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {featureCards.map((feature, index) => (
                                <div key={index} className="flex flex-col items-center text-center">
                                    {feature.icon}
                                    <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
                                    <p className="mt-2 text-muted-foreground">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                 {/* Call to Action */}
                <section className="container py-12 text-center md:py-24">
                     <h2 className="font-headline text-3xl font-bold">Готовы ворваться в игру?</h2>
                     <p className="mt-2 text-muted-foreground">Присоединяйтесь к тысячам игроков и команд уже сегодня.</p>
                     <Button size="lg" className="mt-6" asChild>
                         <Link href="/auth">Присоединиться к ProDvor</Link>
                     </Button>
                </section>
            </main>

            <footer className="border-t bg-muted">
                <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} ProDvor. Все права защищены.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Условия</Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Конфиденциальность</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}