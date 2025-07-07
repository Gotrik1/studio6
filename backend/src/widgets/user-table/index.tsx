
'use client';

import type { FC } from 'react';
import Link from "next/link";
import { MoreHorizontal, Gavel, Pencil, Coins, Undo2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import type { User } from "@/shared/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { Users2 } from 'lucide-react';

interface UserTableProps {
    users: User[];
    onOpenBanUnbanDialog: (user: User, action: 'ban' | 'unban') => void;
    onEditUser: (user: User) => void;
    onPdAction: (user: User, action: 'credit' | 'debit') => void;
}

const roleToPathMap: {[key: string]: string} = {
      'Игрок': 'player',
      'Капитан': 'player',
      'Администратор': 'administrator',
      'Тренер': 'coach',
      'Судья': 'judge',
      'Менеджер': 'manager',
      'Модератор': 'moderator',
      'Организатор': 'organizer',
      'Спонсор': 'sponsor',
      'Болельщик': 'fan',
};

const getProfileUrl = (user: User) => {
    const pathSegment = roleToPathMap[user.role] || 'player';
    return `/profiles/${pathSegment}/${user.id}`;
};

export const UserTable: FC<UserTableProps> = ({ users, onOpenBanUnbanDialog, onEditUser, onPdAction }) => {
    
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
                                        <AvatarImage src={user.avatar || undefined} alt={user.name} />
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
                                                <Link href={getProfileUrl(user)}>Просмотр профиля</Link>
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
                                            {user.status !== 'Забанен' ? (
                                                <DropdownMenuItem 
                                                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                    onClick={() => onOpenBanUnbanDialog(user, 'ban')}
                                                >
                                                    <Gavel className="mr-2 h-4 w-4"/>
                                                    Забанить
                                                </DropdownMenuItem>
                                            ) : (
                                                 <DropdownMenuItem 
                                                    className="text-green-600 focus:bg-green-100 dark:focus:bg-green-900/50 dark:focus:text-green-400"
                                                    onClick={() => onOpenBanUnbanDialog(user, 'unban')}
                                                >
                                                    <Undo2 className="mr-2 h-4 w-4"/>
                                                    Разбанить
                                                </DropdownMenuItem>
                                            )}
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
