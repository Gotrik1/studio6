'use client';

import type { FC } from 'react';
import Link from "next/link";
import { MoreHorizontal, Gavel, Pencil, Coins } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { userList } from "@/lib/mock-data/users";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Users2 } from 'lucide-react';

type User = (typeof userList)[0];

interface UserTableProps {
    users: User[];
    onBanUser: (userId: string) => void;
    onEditUser: (user: User) => void;
    onPdAction: (user: User, action: 'credit' | 'debit') => void;
}

export const UserTable: FC<UserTableProps> = ({ users, onBanUser, onEditUser, onPdAction }) => {
    
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
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <span className="sr-only">Открыть меню</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={user.profileUrl}>Просмотр профиля</Link>
                                            </DropdownMenuItem>
                                             <DropdownMenuItem onClick={() => onEditUser(user)}>
                                                <Pencil className="mr-2 h-4 w-4"/>
                                                Редактировать
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onPdAction(user, 'credit')}>
                                                <Coins className="mr-2 h-4 w-4 text-green-500" />
                                                Начислить PD
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onPdAction(user, 'debit')}>
                                                <Coins className="mr-2 h-4 w-4 text-red-500" />
                                                Списать PD
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem 
                                                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                onClick={() => onBanUser(user.id)}
                                                disabled={user.status === 'Забанен'}
                                            >
                                                <Gavel className="mr-2 h-4 w-4"/>
                                                Забанить
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
