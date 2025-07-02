
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { useToast } from "@/shared/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { CheckCircle, Dumbbell, Target, CalendarDays, Bot, User, Link2, Share2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { useTraining } from "@/app/providers/training-provider";
import type { TrainingProgram } from "@/entities/training-program/model/types";
import { cn } from "@/shared/lib/utils";

interface TrainingProgramDetailsPageProps {
    program: TrainingProgram;
}

export function TrainingProgramDetailsPage({ program }: TrainingProgramDetailsPageProps) {
    const { toast } = useToast();
    const router = useRouter();
    const { selectProgram, currentProgram } = useTraining();
    const isCurrent = currentProgram?.id === program.id;

    const handleSelectProgram = () => {
        selectProgram(program);
        toast({
            title: "Программа выбрана!",
            description: `Вы успешно переключились на программу "${program.name}".`
        });
        router.push('/training/log');
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast({
            title: "Ссылка скопирована!",
            description: "Вы можете поделиться этой программой с друзьями.",
        });
    };

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <Card className="overflow-hidden">
                 <div className="relative h-48 w-full">
                    <Image
                        src={program.coverImage}
                        alt={program.name}
                        fill
                        className="object-cover"
                        data-ai-hint={program.coverImageHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                     <div className="absolute bottom-4 left-4 text-white">
                        <h1 className="font-headline text-3xl font-bold">{program.name}</h1>
                        <div className="flex items-center gap-2 text-sm">
                            {program.isAiGenerated ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                            <span>Автор: {program.author}</span>
                        </div>
                    </div>
                </div>
                <CardContent className="p-6">
                    <p className="text-muted-foreground">{program.description}</p>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> <span>Цель: <strong>{program.goal}</strong></span></div>
                        <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> <span>Частота: <strong>{program.daysPerWeek} дн/нед</strong></span></div>
                        <div className="flex items-center gap-2"><Dumbbell className="h-4 w-4 text-primary" /> <span>Тип: <strong>{program.splitType}</strong></span></div>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>План тренировок на неделю</CardTitle>
                    <CardDescription>Ниже представлена полная структура вашей тренировочной недели.</CardDescription>
                </CardHeader>
                <CardContent>
                    {program.weeklySplit && program.weeklySplit.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full" defaultValue="day-1">
                            {program.weeklySplit.map(day => (
                                <AccordionItem value={`day-${day.day}`} key={day.day}>
                                    <AccordionTrigger className="text-lg">День {day.day}: {day.title}</AccordionTrigger>
                                    <AccordionContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-8 p-0"></TableHead>
                                                    <TableHead>Упражнение</TableHead>
                                                    <TableHead className="text-center">Подходы</TableHead>
                                                    <TableHead className="text-center">Повторения</TableHead>
                                                    <TableHead className="text-center">Вес</TableHead>
                                                    <TableHead className="text-center">Техника</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {day.exercises.map(ex => (
                                                    <TableRow key={ex.name} className={cn(ex.isSupersetWithPrevious && "border-t-2 border-dashed border-primary/20")}>
                                                        <TableCell className="p-0">
                                                            {ex.isSupersetWithPrevious && <Link2 className="h-4 w-4 text-muted-foreground rotate-90 mx-auto" />}
                                                        </TableCell>
                                                        <TableCell className="font-medium">{ex.name}</TableCell>
                                                        <TableCell className="text-center">{ex.sets}</TableCell>
                                                        <TableCell className="text-center">{ex.reps}</TableCell>
                                                        <TableCell className="text-center">{ex.plannedWeight || '-'}</TableCell>
                                                        <TableCell className="text-center">{ex.technique || '-'}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <p className="text-muted-foreground">Детальный план для этой программы еще не добавлен.</p>
                    )}
                </CardContent>
                 <CardFooter className="flex flex-col sm:flex-row gap-2">
                     <Button size="lg" className="w-full" onClick={handleSelectProgram} disabled={isCurrent}>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        {isCurrent ? 'Это ваша текущая программа' : 'Выбрать эту программу'}
                    </Button>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Поделиться
                    </Button>
                </CardFooter>
            </Card>

        </div>
    );
}
