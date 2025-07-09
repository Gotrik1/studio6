"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  Dumbbell,
  Calendar,
  Users,
  Swords,
  BarChart3,
  Ruler,
  Award,
  HeartPulse,
  Search,
  Users2,
  GraduationCap,
  UserSearch,
  Shapes,
  ListChecks,
} from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProposeTrainingDialog } from "@/widgets/propose-training-dialog";

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <Card className="flex flex-col">
    <CardHeader>
      <div className="flex items-start gap-4">
        <div className="p-3 bg-muted rounded-full">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="flex-1 space-y-2">{children}</CardContent>
  </Card>
);

const FeatureLink = ({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href?: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) => {
  const content = (
    <div className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium text-sm">{label}</span>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className="block w-full text-left">
      {content}
    </button>
  );
};

export function TrainingCenterPage() {
  const [isProposeTrainingOpen, setIsProposeTrainingOpen] = useState(false);

  const planningLinks = [
    {
      href: "/training/programs",
      icon: ListChecks,
      label: "Программы тренировок",
    },
    {
      href: "/training/exercises",
      icon: Dumbbell,
      label: "Каталог упражнений",
    },
    { href: "/training/log", icon: Calendar, label: "Дневник тренировок" },
    { href: "/training/calendar", icon: Calendar, label: "Календарь" },
  ];

  const gamesLinks = [
    { href: "/lfg", icon: Search, label: "Найти игру (LFG)" },
    {
      onClick: () => setIsProposeTrainingOpen(true),
      icon: Users,
      label: "Предложить тренировку",
    },
    { href: "/matches/new", icon: Swords, label: "Бросить вызов" },
    { href: "/teams", icon: Users, label: "Мои команды" },
  ];

  const analyticsLinks = [
    { href: "/training/analytics", icon: BarChart3, label: "Общая аналитика" },
    { href: "/training/records", icon: Award, label: "Личные рекорды" },
    { href: "/training/measurements", icon: Ruler, label: "Замеры тела" },
    { href: "/training/nutrition", icon: HeartPulse, label: "Центр питания" },
  ];

  const communityLinks = [
    { href: "/scouting", icon: UserSearch, label: "Поиск игроков" },
    { href: "/coaches", icon: GraduationCap, label: "Найти тренера" },
    { href: "/leaderboards", icon: BarChart3, label: "Таблицы лидеров" },
    { href: "/sports", icon: Shapes, label: "Все виды спорта" },
  ];

  return (
    <>
      <div className="space-y-8 opacity-0 animate-fade-in-up">
        <header className="space-y-2">
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Тренировочный центр
          </h1>
          <p className="text-muted-foreground">
            Ваш хаб для всех видов спортивной активности: от силовых тренировок
            до командных игр.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          <FeatureCard
            title="Планирование"
            description="Создавайте программы, ведите дневник и планируйте свой календарь."
            icon={Calendar}
          >
            {planningLinks.map((link) => (
              <FeatureLink key={link.label} {...link} />
            ))}
          </FeatureCard>

          <FeatureCard
            title="Игры и Соревнования"
            description="Находите партнеров, планируйте матчи и бросайте вызовы."
            icon={Swords}
          >
            {gamesLinks.map((link) => (
              <FeatureLink key={link.label} {...link} />
            ))}
          </FeatureCard>

          <FeatureCard
            title="Аналитика"
            description="Отслеживайте достижения, питание и анализируйте результаты для роста."
            icon={BarChart3}
          >
            {analyticsLinks.map((link) => (
              <FeatureLink key={link.label} {...link} />
            ))}
          </FeatureCard>

          <FeatureCard
            title="Сообщество"
            description="Ищите игроков и тренеров, изучайте дисциплины и следите за лидерами."
            icon={Users2}
          >
            {communityLinks.map((link) => (
              <FeatureLink key={link.label} {...link} />
            ))}
          </FeatureCard>
        </div>
      </div>
      <ProposeTrainingDialog
        isOpen={isProposeTrainingOpen}
        onOpenChange={setIsProposeTrainingOpen}
      />
    </>
  );
}
