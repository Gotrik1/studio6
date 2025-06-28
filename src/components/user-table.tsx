import type { FC } from 'react';
import Link from "next/link";
import { ArrowRight, Users2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { userList } from "@/lib/mock-data";

type User = (typeof userList)[0];

export const UserTable: FC<{ users: User[] }> = ({ users }) => {
    if (users.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
                <Users2 className="h-12 w-12 mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold">Пользователи не найдены</h3>
                <p className="text-muted-foreground">В этой категории пока нет никого. Попробуйте изменить фильтры.</p>
            </div>
        );
    }
    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Аватар</TableHead>
                            <TableHead>Пользователь</TableHead>
                            <TableHead className="hidden md:table-cell">Роль</TableHead>
                            <TableHead className="hidden md:table-cell">Статус</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Badge variant="outline">{user.role}</Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Badge variant={user.status === 'Активен' ? 'default' : 'destructive'}>{user.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href={user.profileUrl}>
                                            Перейти <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
