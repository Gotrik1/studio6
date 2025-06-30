
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Coins, TrendingUp, TrendingDown, Save } from 'lucide-react';
import { pdRules as initialRules, type PdRule } from '@/shared/config/gamification';
import { useToast } from '@/shared/hooks/use-toast';
import { cn } from '@/shared/lib/utils';

export function PDEconomyPage() {
    const { toast } = useToast();
    const [rules, setRules] = useState<PdRule[]>(initialRules);

    const handleValueChange = (id: string, newValue: string) => {
        const value = parseInt(newValue, 10);
        if (!isNaN(value)) {
            setRules(prevRules => 
                prevRules.map(rule => 
                    rule.id === id ? { ...rule, value: rule.type === 'credit' ? value : -Math.abs(value) } : rule
                )
            );
        }
    };
    
    const handleSave = () => {
        // In a real app, this would send the updated rules to the backend.
        toast({
            title: 'Правила сохранены!',
            description: 'Новые правила начисления PD были успешно применены.',
        });
    };

    const creditRules = rules.filter(r => r.type === 'credit');
    const debitRules = rules.filter(r => r.type === 'debit');

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Управление экономикой PD</h1>
                <p className="text-muted-foreground">
                    Настройте количество ProDvor Dollars, начисляемых или списываемых за различные действия на платформе.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="text-green-500" />
                            Правила начисления
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Действие</TableHead>
                                    <TableHead className="text-right">Сумма (PD)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {creditRules.map(rule => (
                                    <TableRow key={rule.id}>
                                        <TableCell className="font-medium">{rule.description}</TableCell>
                                        <TableCell className="text-right">
                                            <Input 
                                                type="number" 
                                                value={rule.value} 
                                                onChange={(e) => handleValueChange(rule.id, e.target.value)}
                                                disabled={!rule.editable}
                                                className="w-24 ml-auto text-right font-medium text-green-500"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingDown className="text-red-500" />
                            Правила списания
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Действие</TableHead>
                                    <TableHead className="text-right">Сумма (PD)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {debitRules.map(rule => (
                                     <TableRow key={rule.id}>
                                        <TableCell className="font-medium">{rule.description}</TableCell>
                                        <TableCell className="text-right">
                                            <Input 
                                                type="number" 
                                                value={Math.abs(rule.value)}
                                                onChange={(e) => handleValueChange(rule.id, e.target.value)}
                                                disabled={!rule.editable}
                                                className="w-24 ml-auto text-right font-medium text-red-500"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            
            <div className="flex justify-end">
                <Button size="lg" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Сохранить все правила
                </Button>
            </div>
        </div>
    );
}
