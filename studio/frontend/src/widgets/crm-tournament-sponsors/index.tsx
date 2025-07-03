
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { tournamentSponsors, potentialSponsors } from '@/shared/lib/mock-data/crm-sponsors';
import { useToast } from '@/shared/hooks/use-toast';

export function CrmTournamentSponsors() {
     const { toast } = useToast();

    const handleAddSponsor = (name: string) => {
        toast({ title: "Спонсор добавлен", description: `Компания ${name} теперь является спонсором турнира.` });
    };
    
    const handleRemoveSponsor = (name: string) => {
        toast({ title: "Спонсор удален", description: `${name} больше не является спонсором турнира.` });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Спонсоры турнира</CardTitle>
                    <CardDescription>Партнеры, поддерживающие это событие.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Спонсор</TableHead>
                                <TableHead>Вклад</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tournamentSponsors.map(sponsor => (
                                <TableRow key={sponsor.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8"><AvatarImage src={sponsor.logo} data-ai-hint={sponsor.logoHint} /><AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback></Avatar>
                                            <p className="font-semibold">{sponsor.name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{sponsor.contribution}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveSponsor(sponsor.name)}>
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
                    <CardTitle>Потенциальные спонсоры</CardTitle>
                    <CardDescription>Компании, заинтересованные в поддержке.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Спонсор</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {potentialSponsors.map(sponsor => (
                                <TableRow key={sponsor.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8"><AvatarImage src={sponsor.logo} data-ai-hint={sponsor.logoHint} /><AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback></Avatar>
                                            <p className="font-semibold">{sponsor.name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => handleAddSponsor(sponsor.name)}>
                                            <PlusCircle className="mr-2 h-4 w-4" /> Добавить
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
