'use client';

import { useMemo } from 'react';
import type { TrainingProgram } from '@/entities/training-program/model/types';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { useToast } from '@/shared/hooks/use-toast';
import { Bot, CalendarDays, Dumbbell, Edit, MoreVertical, PlusCircle, Save, Target, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from '@/shared/lib/session/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { useTraining } from '@/app/providers/training-provider';
import { Skeleton } from '@/shared/ui/skeleton';
import type { ProgramFormValues } from '@/entities/training-program/api/programs';

function ProgramCard({ program, isOwner, onSave, onDelete }: { program: TrainingProgram; isOwner: boolean; onSave: (p: TrainingProgram) => Promise<boolean>; onDelete: (p: TrainingProgram) => Promise<boolean>; }) {
    return (
        <Card className="flex flex-col overflow-hidden transition-all hover:shadow-2xl h-full group">
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
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                </Link>
                <div className="absolute top-2 right-2 flex gap-2">
                    {program.isAiGenerated && (
                        <Badge variant="destructive" className="pointer-events-none">
                            <Bot className="mr-1.5 h-3.5 w-3.5" /> AI
                        </Badge>
                    )}
                    {isOwner && (
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
                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => onDelete(program)}>
                                    <Trash2 className="mr-2 h-4 w-4" />Удалить
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
                <div className="absolute bottom-2 left-4 text-white">
                    <p className="font-semibold text-sm">Автор: {program.author}</p>
                </div>
            </div>
            <CardHeader className="p-4">
                 <Link href={`/training/programs/${program.id}`} className="block">
                    <CardTitle className="font-headline group-hover:text-primary transition-colors">{program.name}</CardTitle>
                </Link>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1">
                <CardDescription className="text-sm line-clamp-2">{program.description}</CardDescription>
                 <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mt-4">
                    <span className="flex items-center"><Target className="mr-1.5 h-4 w-4" />{program.goal}</span>
                    <span className="flex items-center"><CalendarDays className="mr-1.5 h-4 w-4" />{program.daysPerWeek} дн/нед</span>
                    <span className="flex items-center"><Dumbbell className="mr-1.5 h-4 w-4" />{program.splitType}</span>
                </div>
            </CardContent>
            {!isOwner && (
                 <CardContent className="p-4 pt-0">
                    <Button className="w-full" variant="outline" onClick={() => onSave(program)}>
                        <Save className="mr-2 h-4 w-4"/>Сохранить себе
                    </Button>
                </CardContent>
            )}
        </Card>
    );
}

const ProgramGridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
    </div>
);


export function TrainingProgramsPage() {
    const { programs, addProgram, deleteProgram, isLoading } = useTraining();
    const { user } = useSession();
    const { toast } = useToast();

    const myPrograms = useMemo(() => {
        return programs.filter(p => p.author === user?.name || p.author === 'Вы' || p.author === 'ProDvor AI');
    }, [programs, user]);

    const communityPrograms = useMemo(() => {
        return programs.filter(p => p.author !== user?.name && p.author !== 'Вы' && p.author !== 'ProDvor AI');
    }, [programs, user]);
    
    const handleDelete = async (program: TrainingProgram) => {
        const success = await deleteProgram(program.id);
        if (success) {
            toast({
                title: "Программа удалена",
                description: `Программа "${program.name}" была успешно удалена.`,
            });
        }
    };

    const handleSaveProgram = async (programToClone: TrainingProgram) => {
        if (!user) return;
        
        const programData: ProgramFormValues = {
            name: `${programToClone.name} (Копия)`,
            description: programToClone.description,
            goal: programToClone.goal,
            splitType: programToClone.splitType,
            days: programToClone.weeklySplit.map(day => ({
                title: day.title,
                exercises: day.exercises.map(ex => ({...ex, id: `temp-${Math.random()}`}))
            }))
        }

        const success = await addProgram(programData);
        if (success) {
            toast({
                title: "Программа сохранена!",
                description: `Программа "${programToClone.name}" была добавлена в 'Мои программы'.`,
            });
        }
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
            
            <Tabs defaultValue="my-programs">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="my-programs">Мои программы</TabsTrigger>
                    <TabsTrigger value="community">Программы сообщества</TabsTrigger>
                </TabsList>
                <TabsContent value="my-programs" className="mt-6">
                    {isLoading ? <ProgramGridSkeleton /> : myPrograms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myPrograms.map((program: TrainingProgram) => (
                               <ProgramCard key={program.id} program={program} isOwner={true} onDelete={handleDelete} onSave={handleSaveProgram} />
                            ))}
                        </div>
                    ) : <p className="text-center text-muted-foreground py-16">У вас пока нет программ. Создайте первую или скопируйте из сообщества.</p>}
                </TabsContent>
                <TabsContent value="community" className="mt-6">
                     {isLoading ? <ProgramGridSkeleton /> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {communityPrograms.map((program: TrainingProgram) => (
                               <ProgramCard key={program.id} program={program} isOwner={false} onDelete={handleDelete} onSave={handleSaveProgram} />
                            ))}
                        </div>
                     )}
                </TabsContent>
            </Tabs>

        </div>
    );
}
