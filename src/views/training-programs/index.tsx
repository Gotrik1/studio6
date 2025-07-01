'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { useTraining } from '@/app/providers/training-provider';
import type { TrainingProgram } from '@/entities/training-program/model/types';
import Image from 'next/image';
import { Dumbbell, Target, CalendarDays, Bot, PlusCircle, MoreVertical, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useToast } from "@/shared/hooks/use-toast";


export function TrainingProgramsPage() {
    const { programs, deleteProgram } = useTraining();
    const { toast } = useToast();
    
    const handleDelete = (program: TrainingProgram) => {
        deleteProgram(program.id);
        toast({
            title: "Программа удалена",
            description: `Программа "${program.name}" была успешно удалена.`,
        });
    };

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Программы тренировок</h1>
                    <p className="text-muted-foreground">
                        Выберите готовую программу от наших экспертов или создайте свою собственную.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/training/programs/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Создать программу
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((program: TrainingProgram) => (
                    <Card key={program.id} className="flex flex-col overflow-hidden transition-all hover:shadow-2xl h-full group">
                        <div className="relative">
                            <Link href={`/training/programs/${program.id}`}>
                                <div className="relative h-48">
                                    <Image
                                        src={program.coverImage}
                                        alt={program.name}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={program.coverImageHint}
                                    />
                                </div>
                            </Link>
                            <div className="absolute top-2 right-2 flex gap-2">
                                {program.isAiGenerated && (
                                    <Badge variant="destructive" className="pointer-events-none">
                                        <Bot className="mr-1.5 h-3.5 w-3.5" /> AI
                                    </Badge>
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="secondary" size="icon" className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white border-none">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/training/programs/${program.id}/edit`}>
                                                <Edit className="mr-2 h-4 w-4" />Редактировать
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(program)}>
                                            <Trash2 className="mr-2 h-4 w-4" />Удалить
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <CardHeader className="p-6">
                            <Link href={`/training/programs/${program.id}`} className="block">
                                <CardTitle className="font-headline group-hover:text-primary transition-colors">{program.name}</CardTitle>
                                <CardDescription className="mt-2 text-sm">{program.description}</CardDescription>
                            </Link>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 mt-auto">
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                <span className="flex items-center"><Target className="mr-1.5 h-4 w-4" />{program.goal}</span>
                                <span className="flex items-center"><CalendarDays className="mr-1.5 h-4 w-4" />{program.daysPerWeek} дн/нед</span>
                                <span className="flex items-center"><Dumbbell className="mr-1.5 h-4 w-4" />{program.splitType}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
