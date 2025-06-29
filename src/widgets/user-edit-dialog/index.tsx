
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import type { userList as UserListType } from '@/shared/lib/mock-data/users';
import { analyzeRoleChange, type AnalyzeRoleChangeOutput } from '@/shared/api/genkit/flows/analyze-role-change-flow';
import { BrainCircuit, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';

type User = (typeof UserListType)[0];

interface UserEditDialogProps {
    user: User | null;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onUserUpdate: (userId: string, newRole: string) => void;
}

const allRoles = [ "Администратор", "Модератор", "Капитан", "Игрок", "Судья", "Менеджер", "Организатор", "Спонсор", "Болельщик" ];

const getConfidenceColor = (confidence?: 'high' | 'medium' | 'low') => {
    switch(confidence) {
        case 'high': return 'text-green-500';
        case 'medium': return 'text-yellow-500';
        case 'low': return 'text-orange-500';
        default: return 'text-muted-foreground';
    }
}

export function UserEditDialog({ user, isOpen, onOpenChange, onUserUpdate }: UserEditDialogProps) {
    const [selectedRole, setSelectedRole] = useState(user?.role || '');

    // AI State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState<AnalyzeRoleChangeOutput | null>(null);
    const [aiError, setAiError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setSelectedRole(user.role);
        }
        // Reset AI state when dialog opens with a new user
        setAiResult(null);
        setAiError(null);
    }, [user, isOpen]);

    const handleAnalyzeRole = async () => {
        if (!user || selectedRole === user.role) {
            return;
        }
        setIsAnalyzing(true);
        setAiResult(null);
        setAiError(null);

        try {
            const result = await analyzeRoleChange({
                userName: user.name,
                currentRole: user.role,
                requestedRole: selectedRole,
                activitySummary: user.activitySummary,
            });
            setAiResult(result);
        } catch (e) {
            console.error(e);
            setAiError("Не удалось получить рекомендацию от ИИ.");
        } finally {
            setIsAnalyzing(false);
        }
    };

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

                    {(selectedRole !== user.role && (selectedRole === 'Модератор' || selectedRole === 'Судья')) && (
                        <div className="space-y-2 pt-2 border-t">
                            <Button type="button" variant="outline" size="sm" onClick={handleAnalyzeRole} disabled={isAnalyzing}>
                                {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <BrainCircuit className="mr-2 h-4 w-4"/>}
                                AI-анализ для повышения роли
                            </Button>
                            {aiError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Ошибка</AlertTitle><AlertDescription>{aiError}</AlertDescription></Alert>}
                            {aiResult && (
                                <Alert>
                                    <Sparkles className="h-4 w-4" />
                                    <AlertTitle className="flex justify-between items-center">
                                        <span>Рекомендация: {
                                            { 'approve': 'Одобрить', 'deny': 'Отклонить', 'caution': 'С осторожностью' }[aiResult.recommendation]
                                        }</span>
                                        <Badge variant="outline" className={cn(getConfidenceColor(aiResult.confidence))}>
                                            Уверенность: {aiResult.confidence}
                                        </Badge>
                                    </AlertTitle>
                                    <AlertDescription>
                                    {aiResult.reasoning}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
                    <Button onClick={handleSave}>Сохранить</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
