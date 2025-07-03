'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { useToast } from '@/shared/hooks/use-toast';
import { pdRules as initialPdRules, type PdRule } from '@/shared/config/gamification';
import { PlusCircle, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';

export function PDEconomyAdminPage() {
    const { toast } = useToast();
    const [rules, setRules] = useState<PdRule[]>(initialPdRules);
    
    // State for the new rule form
    const [newRuleDesc, setNewRuleDesc] = useState('');
    const [newRuleValue, setNewRuleValue] = useState('10');
    const [newRuleType, setNewRuleType] = useState<'credit' | 'debit'>('credit');

    const handleAddRule = () => {
        if (!newRuleDesc || !newRuleValue) {
            toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: 'Пожалуйста, заполните описание и сумму.',
            });
            return;
        }

        const newRule: PdRule = {
            id: `custom-${Date.now()}`,
            description: newRuleDesc,
            value: newRuleType === 'credit' ? Math.abs(parseInt(newRuleValue)) : -Math.abs(parseInt(newRuleValue)),
            type: newRuleType,
            editable: true,
            isCustom: true,
        };
        
        setRules(prev => [newRule, ...prev]);
        setNewRuleDesc('');
        setNewRuleValue('10');
        toast({ title: 'Правило добавлено', description: 'Новое правило экономики успешно создано.' });
    };
    
    const handleDeleteRule = (ruleId: string) => {
        setRules(prev => prev.filter(r => r.id !== ruleId));
        toast({ title: 'Правило удалено' });
    };

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Управление экономикой PD</h1>
                <p className="text-muted-foreground">
                    Настраивайте правила начисления и списания PD для пользователей.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Текущие правила экономики</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Описание</TableHead>
                                        <TableHead>Сумма</TableHead>
                                        <TableHead>Тип</TableHead>
                                        <TableHead className="text-right">Действия</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rules.map(rule => (
                                        <TableRow key={rule.id}>
                                            <TableCell className="font-medium">{rule.description}</TableCell>
                                            <TableCell className={cn(rule.value > 0 ? 'text-green-500' : 'text-red-500', 'font-bold')}>
                                                {rule.value > 0 ? `+${rule.value}` : rule.value}
                                            </TableCell>
                                            <TableCell>
                                                {rule.type === 'credit' 
                                                    ? <Badge variant="outline" className="text-green-600 border-green-500/50"><TrendingUp className="mr-1 h-3 w-3"/> Начисление</Badge>
                                                    : <Badge variant="outline" className="text-red-600 border-red-500/50"><TrendingDown className="mr-1 h-3 w-3"/> Списание</Badge>
                                                }
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {rule.isCustom ? (
                                                     <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                ) : (
                                                    <Badge variant="secondary">Системное</Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div>
                     <Card>
                        <CardHeader>
                            <CardTitle>Добавить новое правило</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="rule-desc">Описание</Label>
                                <Input id="rule-desc" value={newRuleDesc} onChange={(e) => setNewRuleDesc(e.target.value)} placeholder="Бонус за лучший комментарий" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="rule-value">Сумма PD</Label>
                                    <Input id="rule-value" type="number" value={newRuleValue} onChange={(e) => setNewRuleValue(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rule-type">Тип</Label>
                                     <Select value={newRuleType} onValueChange={(value: 'credit' | 'debit') => setNewRuleType(value)}>
                                        <SelectTrigger id="rule-type"><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="credit">Начисление</SelectItem>
                                            <SelectItem value="debit">Списание</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                        <CardContent>
                             <Button className="w-full" onClick={handleAddRule}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Добавить правило
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
