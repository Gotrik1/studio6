
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import Link from 'next/link';
import Image from 'next/image';
import type { TrainingProgram } from '@/shared/lib/mock-data/training-programs';
import { Button } from "@/shared/ui/button";
import { PlusCircle } from "lucide-react";

interface MyProgramsTabProps {
    programs: TrainingProgram[];
}

export function MyProgramsTab({ programs }: MyProgramsTabProps) {
    // In a real app, this would be filtered by the coach's ID
    const coachPrograms = programs.filter(p => p.author === 'Coach Anna' || p.isAiGenerated);

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
                        <Card key={program.id} className="overflow-hidden">
                           <div className="relative h-40 w-full">
                                <Image 
                                    src={program.coverImage} 
                                    alt={program.name}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={program.coverImageHint} 
                                />
                           </div>
                           <div className="p-4">
                                <h3 className="font-semibold">{program.name}</h3>
                                <p className="text-xs text-muted-foreground">{program.description}</p>
                           </div>
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
