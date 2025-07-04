
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Search } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { UserTable } from '@/entities/user/ui/user-table';
import { UserEditDialog } from '@/widgets/user-edit-dialog';
import { UserPdDialog } from '@/widgets/user-pd-dialog';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Button, buttonVariants } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton';
import { getUsers } from '@/entities/user/api/get-users';
import type { User } from '@/shared/lib/types';


const allRoles = ["Все роли", "Администратор", "Модератор", "Капитан", "Игрок", "Судья", "Менеджер", "Организатор", "Спонсор", "Болельщик"];
const allStatuses = ["Все статусы", "Активен", "Забанен"];

const USERS_PER_PAGE = 8;

export function UserManagementPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('Все роли');
    const [statusFilter, setStatusFilter] = useState('Все статусы');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Dialog states
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isPdDialogOpen, setIsPdDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [pdAction, setPdAction] = useState<'credit' | 'debit' | null>(null);

    // Alert dialog state for ban/unban
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [userToAction, setUserToAction] = useState<User | null>(null);
    const [actionType, setActionType] = useState<'ban' | 'unban' | null>(null);

     const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить пользователей.' });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === 'Все роли' || user.role === roleFilter;
            const matchesStatus = statusFilter === 'Все статусы' || user.status === statusFilter;
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchQuery, roleFilter, statusFilter]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, roleFilter, statusFilter]);
    
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * USERS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

    const handleOpenBanUnbanDialog = (user: User, type: 'ban' | 'unban') => {
        setUserToAction(user);
        setActionType(type);
        setIsAlertOpen(true);
    };

    const handleConfirmAction = () => {
        if (!userToAction || !actionType) return;

        const newStatus = actionType === 'ban' ? 'Забанен' : 'Активен';
        setUsers(prev => prev.map(u => u.id === userToAction.id ? { ...u, status: newStatus } : u));
        
        // In a real app, we'd await an API call here.
        // For now, optimistic update is shown.
        toast({
            title: `Статус пользователя ${userToAction.name} изменен на "${newStatus}".`,
            variant: actionType === 'unban' ? 'default' : 'destructive'
        });
        
        setIsAlertOpen(false);
        setUserToAction(null);
        setActionType(null);
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
        <>
            <div className="space-y-6 opacity-0 animate-fade-in-up">
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
                
                {loading ? (
                    <div className="space-y-2">
                        {Array.from({length: USERS_PER_PAGE}).map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                ) : (
                    <UserTable 
                        users={paginatedUsers}
                        onOpenBanUnbanDialog={handleOpenBanUnbanDialog}
                        onEditUser={handleEditUser}
                        onPdAction={handlePdAction}
                    />
                )}
                
                {totalPages > 1 && (
                     <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                           Всего {filteredUsers.length} пользователей.
                        </div>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Назад
                            </Button>
                             <span className="text-sm text-muted-foreground">
                                Страница {currentPage} из {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Вперед
                            </Button>
                        </div>
                    </div>
                )}
                
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

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Вы собираетесь {actionType === 'ban' ? 'забанить' : 'разбанить'} пользователя 
                        <span className="font-bold"> {userToAction?.name}</span>. Это действие можно будет отменить.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <Button
                        onClick={handleConfirmAction}
                        className={cn(
                            actionType === 'ban' ? buttonVariants({ variant: 'destructive' }) : 'bg-green-600 hover:bg-green-700 text-primary-foreground'
                        )}
                    >
                        {actionType === 'ban' ? 'Да, забанить' : 'Да, разбанить'}
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
