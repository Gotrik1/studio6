import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userList } from "@/lib/mock-data"; 
import { Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { FC } from 'react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";


type User = typeof userList[0];

const roles = [
    { value: "all", label: "Все" },
    { value: "Администратор", label: "Админы" },
    { value: "Модератор", label: "Модеры" },
    { value: "Капитан", label: "Капитаны" },
    { value: "Игрок", label: "Игроки" },
    { value: "Судья", label: "Судьи" },
    { value: "Менеджер", label: "Менеджеры" },
    { value: "Организатор", label: "Организаторы" },
    { value: "Спонсор", label: "Спонсоры" },
    { value: "Болельщик", label: "Болельщики" },
];

const UserTable: FC<{ users: User[] }> = ({ users }) => {
    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <p className="text-lg font-semibold">Пользователи не найдены</p>
                <p className="text-muted-foreground">В этой категории пока нет пользователей.</p>
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

export default function UserManagementPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Управление пользователями</h1>
                <p className="text-muted-foreground">
                    Просмотр, поиск и управление всеми пользователями платформы.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Поиск по имени или email..." className="w-full pl-10" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all">
                        <ScrollArea className="w-full">
                            <TabsList>
                                {roles.map(role => (
                                    <TabsTrigger key={role.value} value={role.value}>{role.label}</TabsTrigger>
                                ))}
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>

                        <TabsContent value="all" className="mt-4">
                            <UserTable users={userList} />
                        </TabsContent>

                        {roles.filter(r => r.value !== 'all').map(role => (
                            <TabsContent key={role.value} value={role.value} className="mt-4">
                                <UserTable users={userList.filter(u => u.role === role.value)} />
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
