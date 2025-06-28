'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userList as initialUserList } from "@/lib/mock-data/users";
import { Search } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { UserTable } from "@/components/user-table";
import { useToast } from '@/hooks/use-toast';
import type { userList as UserListType } from '@/lib/mock-data/users';
import { UserEditDialog } from '@/components/user-edit-dialog';
import { UserPdDialog } from '@/components/user-pd-dialog';

type User = (typeof UserListType)[0];
type PdAction = 'credit' | 'debit';

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

export default function UserManagementPage() {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [users, setUsers] = useState<User[]>(initialUserList);

    // State for the edit dialog
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // New state for PD dialog
    const [isPdDialogOpen, setIsPdDialogOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState<PdAction | null>(null);


    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  user.email.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesRole = activeTab === 'all' || user.role === activeTab;
            
            return matchesSearch && matchesRole;
        });
    }, [searchQuery, activeTab, users]);

    const handleBanUser = (userId: string) => {
        const userToBan = users.find(user => user.id === userId);
        if (userToBan) {
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? { ...user, status: 'Забанен' } : user
                )
            );
            toast({
                title: "Действие выполнено",
                description: `Пользователь ${userToBan.name} был забанен.`,
                variant: 'destructive'
            });
        }
    };

    const handleEditUserClick = (user: User) => {
        setSelectedUser(user);
        setIsEditDialogOpen(true);
    };

    const handleUpdateUser = (userId: string, newRole: string) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            )
        );
        toast({
            title: "Пользователь обновлен",
            description: `Роль для ${selectedUser?.name} была изменена на "${newRole}".`,
        });
    };

    const handlePdActionClick = (user: User, action: PdAction) => {
        setSelectedUser(user);
        setSelectedAction(action);
        setIsPdDialogOpen(true);
    };

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
                        <Input 
                            placeholder="Поиск по имени или email..." 
                            className="w-full pl-10" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                        <ScrollArea className="w-full">
                            <TabsList>
                                {roles.map(role => (
                                    <TabsTrigger key={role.value} value={role.value}>{role.label}</TabsTrigger>
                                ))}
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>

                        <TabsContent value={activeTab} className="mt-4">
                            <UserTable
                                users={filteredUsers}
                                onBanUser={handleBanUser}
                                onEditUser={handleEditUserClick}
                                onPdAction={handlePdActionClick}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
            <UserEditDialog
                user={selectedUser}
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onUserUpdate={handleUpdateUser}
            />
             <UserPdDialog 
                user={selectedUser}
                action={selectedAction}
                isOpen={isPdDialogOpen}
                onOpenChange={setIsPdDialogOpen}
            />
        </div>
    );
}
