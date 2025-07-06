
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/ui/card";
import Link from 'next/link';
import Image from 'next/image';
import type { TrainingProgram } from '@/entities/training-program/model/types';
import { Button } from "@/shared/ui/button";
import { PlusCircle, Share } from "lucide-react";
import { useTraining } from "@/shared/context/training-provider";

interface MyProgramsTabProps {
    onAssignProgram: (program: TrainingProgram) => void;
    authorName: string;
}

export function MyProgramsTab({ onAssignProgram, authorName }: MyProgramsTabProps) {
    const { programs } = useTraining();
    
    // In a real app, this would be filtered by the coach's ID
    const coachPrograms = programs.filter(p => p.author === authorName || p.isAiGenerated);

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Мои тренировочные программы</CardTitle>
                        <CardDescription>Созданные вами программы для игроков и команд.</CardDescription>
                    </div>
                    <Button asChild>
                        <Link href="/training/programs/new"><PlusCircle className="mr-2 h-4 w-4"/>Создать новую</Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {coachPrograms.map((program) => (
                        <Card key={program.id} className="overflow-hidden flex flex-col">
                            <Link href={`/training/programs/${program.id}`}>
                               <div className="relative h-40 w-full">
                                    <Image 
                                        src={program.coverImage} 
                                        alt={program.name}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={program.coverImageHint} 
                                    />
                               </div>
                                <CardHeader>
                                    <CardTitle className="hover:text-primary transition-colors">{program.name}</CardTitle>
                                    <CardDescription className="text-xs">{program.description}</CardDescription>
                                </CardHeader>
                            </Link>
                           <CardFooter className="p-4 pt-0 mt-auto">
                                <Button variant="outline" className="w-full" onClick={() => onAssignProgram(program)}>
                                    <Share className="mr-2 h-4 w-4" />
                                    Назначить игрокам
                                </Button>
                           </CardFooter>
                        </Card>
                    ))}
                    {coachPrograms.length === 0 && (
                        <p className="text-sm text-muted-foreground col-span-full text-center py-8">Вы еще не создали ни одной программы.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
