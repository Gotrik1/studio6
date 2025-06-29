'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { trainingPrograms, type TrainingProgram } from '@/shared/lib/mock-data/training-programs';
import Image from 'next/image';
import { Dumbbell, Target, CalendarDays, Bot, ArrowRight, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export function TrainingProgramsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Программы тренировок</h1>
                    <p className="text-muted-foreground">
                        Выберите готовую программу от наших экспертов или создайте свою собственную.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/training/programs/new">
                        <BrainCircuit className="mr-2 h-4 w-4" />
                        Создать с помощью AI
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainingPrograms.map((program: TrainingProgram) => (
                    <Card key={program.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
                        <CardHeader className="p-0 relative h-48">
                            <Image
                                src={program.coverImage}
                                alt={program.name}
                                fill
                                className="object-cover"
                                data-ai-hint={program.coverImageHint}
                            />
                            {program.isAiGenerated && (
                                <Badge variant="destructive" className="absolute top-2 right-2">
                                    <Bot className="mr-1.5 h-3.5 w-3.5" /> AI-Generated
                                </Badge>
                            )}
                        </CardHeader>
                        <CardContent className="p-6 flex-1">
                            <CardTitle className="font-headline">{program.name}</CardTitle>
                            <CardDescription className="mt-2 text-sm">{program.description}</CardDescription>
                            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                <span className="flex items-center"><Target className="mr-1.5 h-4 w-4" />{program.goal}</span>
                                <span className="flex items-center"><CalendarDays className="mr-1.5 h-4 w-4" />{program.daysPerWeek} дн/нед</span>
                                <span className="flex items-center"><Dumbbell className="mr-1.5 h-4 w-4" />{program.splitType}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">
                                Посмотреть программу <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
