'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { SponsoredTeam } from '@/entities/sponsorship/model/types';


interface SponsoredTeamsTabProps {
    teams: SponsoredTeam[];
}

export function SponsoredTeamsTab({ teams }: SponsoredTeamsTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Спонсируемые команды</CardTitle>
                <CardDescription>Команды, которые в настоящее время получают вашу поддержку.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Команда</TableHead>
                            <TableHead>Инвестиции</TableHead>
                            <TableHead className="hidden md:table-cell">Сотрудничество с</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teams.map((team) => (
                            <TableRow key={team.slug}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={team.logo} alt={team.name} data-ai-hint={team.logoHint} />
                                            <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{team.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-semibold">{team.investment}</TableCell>
                                <TableCell className="hidden md:table-cell">{format(new Date(team.since), 'd MMMM yyyy', { locale: ru })}</TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/teams/${team.slug}`}>Профиль</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
