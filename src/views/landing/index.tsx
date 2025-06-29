
'use client';

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Logo } from "@/shared/ui/icons";

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
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4">
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
      <main className="flex-1 flex flex-col items-center justify-center p-4">
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
      </main>
      <footer className="p-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ProDvor. Все права защищены.
      </footer>
    </div>
  );
}
