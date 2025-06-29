'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Search } from 'lucide-react';
import { userList as initialUserList, type userList as UserListType } from '@/shared/lib/mock-data/users';
import { useToast } from '@/shared/hooks/use-toast';
import { UserTable } from '@/widgets/user-table';
import { UserEditDialog } from '@/widgets/user-edit-dialog';
import { UserPdDialog } from '@/widgets/user-pd-dialog';

type User = (typeof UserListType)[0];

const allRoles = ["Все роли", "Администратор", "Модератор", "Капитан", "Игрок", "Судья", "Менеджер", "Организатор", "Спонсор", "Болельщик"];
const allStatuses = ["Все статусы", "Активен", "Забанен"];

export function UserManagementPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>(initialUserList);
    
    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('Все роли');
    const [statusFilter, setStatusFilter] = useState('Все статусы');
    
    // Dialog states
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isPdDialogOpen, setIsPdDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [pdAction, setPdAction] = useState<'credit' | 'debit' | null>(null);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === 'Все роли' || user.role === roleFilter;
            const matchesStatus = statusFilter === 'Все статусы' || user.status === statusFilter;
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchQuery, roleFilter, statusFilter]);

    const handleBanUser = (userId: string) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Забанен' } : u));
        toast({ title: 'Пользователь забанен', description: 'Статус пользователя был изменен на "Забанен".' });
    };
    
    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsEditDialogOpen(true);
    };

    const handleUserUpdate = (userId: string, newRole: string) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        toast({ title: 'Пользователь обновлен', description: 'Роль пользователя была успешно изменена.' });
    };
    
    const handlePdAction = (user: User, action: 'credit' | 'debit') => {
        setSelectedUser(user);
        setPdAction(action);
        setIsPdDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Управление пользователями</h1>
                <p className="text-muted-foreground">Просмотр, редактирование и управление пользователями платформы.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Фильтры</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            placeholder="Поиск по имени или email..." 
                            className="w-full pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                     <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Роль" />
                        </SelectTrigger>
                        <SelectContent>
                            {allRoles.map(role => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Статус" />
                        </SelectTrigger>
                        <SelectContent>
                             {allStatuses.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
            
            <UserTable 
                users={filteredUsers}
                onBanUser={handleBanUser}
                onEditUser={handleEditUser}
                onPdAction={handlePdAction}
            />
            
            <UserEditDialog 
                user={selectedUser}
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onUserUpdate={handleUserUpdate}
            />

            <UserPdDialog
                user={selectedUser}
                action={pdAction}
                isOpen={isPdDialogOpen}
                onOpenChange={setIsPdDialogOpen}
            />
        </div>
    );
}
