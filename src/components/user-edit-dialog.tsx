'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { userList as UserListType } from '@/lib/mock-data/users';

type User = (typeof UserListType)[0];

interface UserEditDialogProps {
    user: User | null;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onUserUpdate: (userId: string, newRole: string) => void;
}

const allRoles = [ "Администратор", "Модератор", "Капитан", "Игрок", "Судья", "Менеджер", "Организатор", "Спонсор", "Болельщик" ];

export function UserEditDialog({ user, isOpen, onOpenChange, onUserUpdate }: UserEditDialogProps) {
    const [selectedRole, setSelectedRole] = useState(user?.role || '');

    useEffect(() => {
        if (user) {
            setSelectedRole(user.role);
        }
    }, [user]);

    const handleSave = () => {
        if (user) {
            onUserUpdate(user.id, selectedRole);
        }
        onOpenChange(false);
    };
    
    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Редактировать пользователя</DialogTitle>
                    <DialogDescription>
                        Изменение данных для пользователя {user.name}.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div>
                        <Label htmlFor="user-name">Имя</Label>
                        <Input id="user-name" value={user.name} disabled />
                    </div>
                     <div>
                        <Label htmlFor="user-email">Email</Label>
                        <Input id="user-email" value={user.email} disabled />
                    </div>
                     <div>
                        <Label htmlFor="user-role">Роль</Label>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger id="user-role">
                                <SelectValue placeholder="Выберите роль" />
                            </SelectTrigger>
                            <SelectContent>
                                {allRoles.map(role => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
                    <Button onClick={handleSave}>Сохранить</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
