
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import { Dumbbell, Calendar, TrendingUp, BrainCircuit, BookOpen, Replace, LayoutGrid, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useTraining } from '@/app/providers/training-provider';

const nextWorkout = {
    date: "Завтра, 18:00",
    muscles: "Грудь и трицепс",
};

const weeklyProgress = {
    workouts: { current: 2, total: 3 },
    volume: { current: 8500, total: 12000 },
    pd: 75,
};

const aiRecommendation = "Сделай акцент на спину — отстаёт в динамике по сравнению с грудными.";


export function TrainingCenterPage() {
    const { currentProgram } = useTraining();

    return (
        <div className="space-y-8 opacity-0 animate-fade-in-up">
            <header className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Рабочий стол атлета</h1>
                <p className="text-muted-foreground">
                    Ваш центр управления тренировочным процессом. Все под рукой.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Dumbbell className="text-primary" />
                                Текущая программа
                            </CardTitle>
                            <CardDescription>Ваш активный тренировочный план.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {currentProgram ? (
                                <>
                                    <h3 className="text-xl font-bold">{currentProgram.name}</h3>
                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                        <span>Цель: <span className="font-medium text-foreground">{currentProgram.goal}</span></span>
                                        <span>Статус: <span className="font-medium text-foreground">Активна</span></span>
                                        <span>Интенсивность: <span className="font-medium text-foreground">{currentProgram.daysPerWeek} дн/нед</span></span>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-muted-foreground p-4">
                                    <p>У вас нет активной программы.</p>
                                    <Button asChild variant="link"><Link href="/training/programs">Выбрать программу</Link></Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="text-primary" />
                                Следующая тренировка
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold">{nextWorkout.date}</p>
                                <p className="text-lg font-bold text-primary">{nextWorkout.muscles}</p>
                            </div>
                            <Button size="lg" asChild><Link href="/training/log">Начать тренировку</Link></Button>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <Button variant="outline" size="lg" asChild><Link href="/training/log"><BookOpen className="mr-2 h-4 w-4" />Дневник</Link></Button>
                        <Button variant="outline" size="lg" asChild><Link href="/training/calendar"><Calendar className="mr-2 h-4 w-4" />Календарь</Link></Button>
                        <Button variant="outline" size="lg" asChild><Link href="/training/analytics"><BarChart3 className="mr-2 h-4 w-4" />Аналитика</Link></Button>
                        <Button variant="outline" size="lg" asChild><Link href="/training/programs"><Replace className="mr-2 h-4 w-4" />Программы</Link></Button>
                        <Button variant="outline" size="lg" asChild><Link href="/training/programs/new"><LayoutGrid className="mr-2 h-4 w-4" />Конструктор</Link></Button>
                    </div>
                </div>

                <aside className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="text-primary" />
                                Прогресс недели
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">Тренировки</span>
                                    <span>{weeklyProgress.workouts.current} / {currentProgram?.daysPerWeek || 3}</span>
                                </div>
                                <Progress value={currentProgram ? (weeklyProgress.workouts.current / currentProgram.daysPerWeek) * 100 : 0} />
                            </div>
                             <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">Общий объем</span>
                                    <span>{weeklyProgress.volume.current.toLocaleString('ru-RU')} / {weeklyProgress.volume.total.toLocaleString('ru-RU')} кг</span>
                                </div>
                                <Progress value={(weeklyProgress.volume.current / weeklyProgress.volume.total) * 100} />
                            </div>
                             <div className="flex justify-between items-center text-sm font-medium border-t pt-3 mt-3">
                                <span>Заработано PD</span>
                                <span className="font-bold text-green-500">+{weeklyProgress.pd} PD</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BrainCircuit className="text-primary" />
                                AI-рекомендация
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground italic">&quot;{aiRecommendation}&quot;</p>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
