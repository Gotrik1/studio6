'use client';

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Logo } from "@/shared/ui/icons";
import { BrainCircuit, Trophy, Users, UserPlus, ShieldPlus, Sword } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";

export function LandingPage() {
  const Slogan = ({ text }: { text: string }) => {
    return (
      <h1 className="animated-slogan font-headline text-4xl font-extrabold tracking-tight text-center md:text-5xl lg:text-6xl">
        {text.split(' ').map((word, index) => (
          <span key={index} className="inline-block" style={{animationDelay: `${index * 100}ms`}}>{word}&nbsp;</span>
        ))}
      </h1>
    );
  };

  const features = [
    {
      icon: BrainCircuit,
      title: "AI-Помощники",
      description: "От анализа матчей до создания логотипа команды — наши AI-инструменты помогут вам на каждом шагу.",
    },
    {
      icon: Trophy,
      title: "Турниры и Матчи",
      description: "Участвуйте в турнирах, бросайте вызов другим командам и отслеживайте свой прогресс в удобной турнирной сетке.",
    },
    {
      icon: Users,
      title: "Команды и Сообщество",
      description: "Создавайте команды, находите единомышленников, общайтесь в командном чате и стройте свою спортивную карьеру.",
    },
  ];

  const steps = [
      {
          icon: UserPlus,
          title: "1. Регистрация",
          description: "Создайте свой аккаунт и получите доступ ко всем возможностям платформы."
      },
      {
          icon: ShieldPlus,
          title: "2. Создание команды",
          description: "Соберите свой состав или присоединитесь к существующей команде."
      },
      {
          icon: Sword,
          title: "3. Участие в турнирах",
          description: "Сражайтесь за славу и призы в регулярных турнирах и лигах."
      }
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Logo className="h-5 w-5" />
            </div>
            <div className="font-headline text-lg font-semibold">ProDvor</div>
        </div>
        <Button asChild>
          <Link href="/auth">Войти</Link>
        </Button>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="flex flex-col items-center justify-center p-4 py-20 md:py-32">
            <div className="max-w-4xl text-center space-y-6">
            <Slogan text="Твоя игра. Твои правила. Твоя арена." />
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
                ProDvor — это социальная платформа, объединяющая дворовый спорт и любительский киберспорт. Создавай команду, находи соперников, участвуй в турнирах и строй свою спортивную карьеру.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto pulsing-button">
                <Link href="/auth">Начать побеждать</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/dashboard">Подробнее</Link>
                </Button>
            </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center space-y-2 mb-12">
                     <h2 className="font-headline text-3xl font-bold tracking-tight">Все, что нужно для победы</h2>
                     <p className="text-muted-foreground max-w-2xl mx-auto">Платформа ProDvor предоставляет полный набор инструментов для игроков и команд любого уровня.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground mx-auto mb-4">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16">
             <div className="container mx-auto px-4 sm:px-6">
                 <div className="text-center space-y-2 mb-12">
                     <h2 className="font-headline text-3xl font-bold tracking-tight">Начните свой путь в три шага</h2>
                     <p className="text-muted-foreground max-w-2xl mx-auto">Присоединиться к сообществу ProDvor очень просто.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {steps.map((step, index) => (
                        <Card key={index} className="text-center">
                            <CardHeader>
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-muted text-primary mx-auto mb-4">
                                    <step.icon className="h-6 w-6" />
                                </div>
                                <CardTitle>{step.title}</CardTitle>
                            </CardHeader>
                            <CardDescription className="p-6 pt-0">{step.description}</CardDescription>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 bg-muted/50">
             <div className="container mx-auto px-4 sm:px-6 text-center">
                 <h2 className="font-headline text-3xl font-bold tracking-tight">Готовы ворваться в игру?</h2>
                 <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Присоединяйтесь к тысячам игроков, которые уже соревнуются и побеждают на ProDvor.</p>
                 <div className="mt-8">
                     <Button asChild size="lg">
                         <Link href="/auth">Создать аккаунт бесплатно</Link>
                     </Button>
                 </div>
            </div>
        </section>

      </main>

      <footer className="p-4 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} ProDvor. Все права защищены.
      </footer>
    </div>
  );
}
