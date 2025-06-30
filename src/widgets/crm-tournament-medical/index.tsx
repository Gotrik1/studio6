'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { assignedMedics, availableMedics } from '@/shared/lib/mock-data/crm-medical';
import { useToast } from '@/shared/hooks/use-toast';
import { Badge } from '@/shared/ui/badge';

export function CrmTournamentMedical() {
    const { toast } = useToast();

    const handleAddMedic = (name: string) => {
        toast({ title: "Мед. поддержка назначена", description: `${name} будет работать на турнире.` });
    };
    
    const handleRemoveMedic = (name: string) => {
        toast({ title: "Мед. поддержка снята", description: `${name} снят(а) с турнира.` });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Закрепленная мед. поддержка</CardTitle>
                    <CardDescription>Медицинские бригады и специалисты, работающие на этом турнире.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Организация / Врач</TableHead>
                                <TableHead>Статус</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignedMedics.map(medic => (
                                <TableRow key={medic.id}>
                                    <TableCell>
                                        <p className="font-semibold">{medic.name}</p>
                                        <p className="text-xs text-muted-foreground">{medic.contact}</p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="default">{medic.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveMedic(medic.name)}>
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
                    <CardTitle>Аккредитованные мед. службы</CardTitle>
                    <CardDescription>Доступные для назначения на турнир партнеры.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Организация / Врач</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {availableMedics.map(medic => (
                                <TableRow key={medic.id}>
                                    <TableCell>
                                        <p className="font-semibold">{medic.name}</p>
                                        <p className="text-xs text-muted-foreground">{medic.contact}</p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => handleAddMedic(medic.name)}>
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
