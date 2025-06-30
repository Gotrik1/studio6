
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { assignedJudges, availableJudges } from '@/shared/lib/mock-data/crm-judges';
import { useToast } from '@/shared/hooks/use-toast';

export function CrmTournamentJudges() {
    const { toast } = useToast();

    const handleAddJudge = (name: string) => {
        toast({ title: "Судья назначен", description: `${name} был назначен на турнир.` });
    };
    
    const handleRemoveJudge = (name: string) => {
        toast({ title: "Судья снят с турнира", description: `${name} был удален из судейского состава.` });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Назначенные судьи</CardTitle>
                    <CardDescription>Судейский состав, работающий на этом турнире.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Судья</TableHead>
                                <TableHead className="text-right">Действие</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignedJudges.map(judge => (
                                <TableRow key={judge.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8"><AvatarImage src={judge.avatar} /><AvatarFallback>{judge.name.charAt(0)}</AvatarFallback></Avatar>
                                            <div>
                                                <p className="font-semibold">{judge.name}</p>
                                                <p className="text-xs text-muted-foreground">{judge.role}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveJudge(judge.name)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Доступные судьи</CardTitle>
                    <CardDescription>Аккредитованные судьи, доступные для назначения.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Судья</TableHead>
                                <TableHead className="text-right">Действие</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {availableJudges.map(judge => (
                                <TableRow key={judge.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8"><AvatarImage src={judge.avatar} /><AvatarFallback>{judge.name.charAt(0)}</AvatarFallback></Avatar>
                                            <p className="font-semibold">{judge.name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => handleAddJudge(judge.name)}>
                                            <PlusCircle className="mr-2 h-4 w-4" /> Назначить
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
