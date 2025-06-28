
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Award, BookOpen, BrainCircuit, CheckCircle, Dumbbell, Goal, Loader2, Sparkles, Youtube } from "lucide-react";

// Mock data for a generated plan
const initialTrainingPlan = {
  weeklyFocus: "Улучшение точности при стрельбе на дальние дистанции и принятие решений в клатч-ситуациях.",
  weeklyGoal: "Увеличить процент хэдшотов на 5% и выиграть 3 клатч-ситуации (1 в 2 или сложнее).",
  drills: [
    { name: "Тренировка в Aim Lab", description: "30 минут на сценариях Gridshot и Strafetrack.", duration: "Ежедневно", completed: false },
    { name: "Анализ реплеев", description: "Просмотреть 2 своих проигранных матча, фокусируясь на позиционировании в поздней игре.", duration: "2 раза в неделю", completed: false },
    { name: "Клатч-сценарии", description: "Сыграть 5 кастомных игр с установкой Spike и защитой в одиночку.", duration: "3 раза в неделю", completed: true },
    { name: "Deathmatch", description: "Сыграть 3 игры в режиме Deathmatch, используя только Sheriff или Guardian.", duration: "Через день", completed: false },
  ],
  suggestedVideos: [
    { title: "Как выигрывать клатчи в Valorant - Гайд от про", url: "#" },
    { title: "Разбор позиционки на карте Ascent", url: "#" },
    { title: "Топ-5 ошибок при стрельбе на дальние дистанции", url: "#" },
  ],
};

type Drill = (typeof initialTrainingPlan.drills)[0];

export default function TrainingCenterPage() {
    const { toast } = useToast();
    const [plan, setPlan] = useState(initialTrainingPlan);
    const [isLoading, setIsLoading] = useState(false);

    const handleGeneratePlan = async () => {
        setIsLoading(true);
        // Simulate API call to generate a new plan
        await new Promise(resolve => setTimeout(resolve, 1500));
        // In a real app, we'd get new data. For demo, we just reset the state.
        setPlan(initialTrainingPlan); 
        setIsLoading(false);
        toast({
            title: "Новый план сгенерирован!",
            description: "Ваш план тренировок на неделю обновлен.",
        });
    };

    const toggleDrillCompletion = (drillName: string) => {
        setPlan(prevPlan => ({
            ...prevPlan,
            drills: prevPlan.drills.map(drill => 
                drill.name === drillName ? { ...drill, completed: !drill.completed } : drill
            )
        }));
    };

    const completedDrills = plan.drills.filter(d => d.completed).length;
    const totalDrills = plan.drills.length;
    const progressPercentage = totalDrills > 0 ? (completedDrills / totalDrills) * 100 : 0;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Dumbbell className="h-8 w-8 text-primary" />
                    Тренировочный Центр
                </h1>
                <p className="text-muted-foreground">
                    Ваш персональный план развития, созданный AI-тренером на эту неделю.
                </p>
            </div>

            <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Прогресс за неделю</CardTitle>
                        <CardDescription>Выполнено {completedDrills} из {totalDrills} заданий.</CardDescription>
                    </div>
                    <Button onClick={handleGeneratePlan} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                        {isLoading ? "Генерация..." : "Сгенерировать новый план"}
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div 
                          className="h-full bg-primary transition-all duration-500" 
                          style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary"/>План тренировок</CardTitle>
                            <CardDescription>Отмечайте выполненные задания, чтобы отслеживать прогресс.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {plan.drills.map((drill, index) => (
                               <div key={index} className="flex items-start gap-4 rounded-md border p-4 transition-colors hover:bg-muted/50">
                                   <Checkbox 
                                        id={`drill-${index}`} 
                                        checked={drill.completed}
                                        onCheckedChange={() => toggleDrillCompletion(drill.name)}
                                        className="mt-1"
                                    />
                                   <div className="grid gap-1.5">
                                       <label htmlFor={`drill-${index}`} className="font-semibold cursor-pointer">{drill.name} <span className="font-normal text-muted-foreground">({drill.duration})</span></label>
                                       <p className="text-sm text-muted-foreground">{drill.description}</p>
                                   </div>
                               </div>
                           ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-primary"/>Фокус недели</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{plan.weeklyFocus}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Goal className="h-5 w-5 text-primary"/>Цель на неделю</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-semibold">{plan.weeklyGoal}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Youtube className="h-5 w-5 text-primary"/>Видео-гайды</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           {plan.suggestedVideos.map((video, index) => (
                               <a key={index} href={video.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline-offset-4 hover:underline block truncate">
                                   {video.title}
                               </a>
                           ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
