

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { ReportAnalysisDialog } from '@/widgets/report-analysis-dialog';
import { useToast } from '@/shared/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Skeleton } from '@/shared/ui/skeleton';
import { resolveReport, getReports, type Report } from '@/entities/report/api/reports';

export function ModerationQueuePage() {
    const { toast } = useToast();
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getReports('PENDING');
            setReports(data);
        } catch (error) {
            console.error('Failed to fetch reports:', error);
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить список жалоб.' });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleReviewClick = (report: Report) => {
        setSelectedReport(report);
        setIsDialogOpen(true);
    };
    
    const handleResolve = async (reportId: string, action: string) => {
        const reportToResolve = reports.find(r => r.id === reportId);
        if (!reportToResolve) return;

        const status = action === 'Нет нарушений' ? 'DISMISSED' : 'RESOLVED';
        const resolution = `Модератор принял решение: ${action}.`;
        
        const result = await resolveReport(reportId, resolution, status);
        
        if (result.success) {
            toast({
                title: 'Жалоба рассмотрена!',
                description: `Решение по жалобе на игрока ${reportToResolve.reportedUser.name} было принято.`
            });
            await fetchData(); // Refetch data
            setIsDialogOpen(false);
        } else {
             toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: result.error || "Не удалось разрешить спор.",
            });
        }
    };

    return (
        <>
            <div className="space-y-6 opacity-0 animate-fade-in-up">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Очередь модерации</h1>
                    <p className="text-muted-foreground">
                        Жалобы от пользователей, требующие вашего внимания.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Активные жалобы</CardTitle>
                        <CardDescription>
                            {isLoading ? 'Загрузка...' : 
                                reports.length > 0 
                                ? `Всего жалоб в очереди: ${reports.length}` 
                                : 'В очереди нет активных жалоб. Отличная работа!'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         {isLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>На кого</TableHead>
                                        <TableHead>Кто</TableHead>
                                        <TableHead className="hidden md:table-cell">Причина</TableHead>
                                        <TableHead className="hidden md:table-cell">Поступила</TableHead>
                                        <TableHead className="text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reports.length > 0 ? reports.map(report => (
                                        <TableRow key={report.id}>
                                            <TableCell className="font-medium">{report.reportedUser.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{report.reporter.name}</TableCell>
                                            <TableCell className="hidden md:table-cell truncate max-w-sm">{report.category}</TableCell>
                                            <TableCell className="hidden md:table-cell">{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true, locale: ru })}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" onClick={() => handleReviewClick(report)}>Рассмотреть</Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow><TableCell colSpan={5} className="h-24 text-center">Активных жалоб нет.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ReportAnalysisDialog 
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                report={selectedReport}
                onResolve={handleResolve}
            />
        </>
    );
}
