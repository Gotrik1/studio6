
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { reportsQueue as initialReports, type Report } from '@/shared/lib/mock-data/moderation';
import { ReportAnalysisDialog } from '@/widgets/report-analysis-dialog';

export function ModerationQueuePage() {
    const { toast } = useToast();
    const [reports, setReports] = useState<Report[]>(initialReports);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleReviewClick = (report: Report) => {
        setSelectedReport(report);
        setIsDialogOpen(true);
    };

    const handleResolve = (reportId: string, action: string) => {
        const reportToResolve = reports.find(r => r.id === reportId);
        if (reportToResolve) {
            setReports(prev => prev.filter(r => r.id !== reportId));
            // In a real app, you would also persist this resolution.
            toast({
                title: "Решение принято",
                description: `Вы вынесли решение по жалобе на ${reportToResolve.reportedUser.name}. Действие: ${action}.`
            });
        }
        setIsDialogOpen(false);
    };

    return (
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
                        {reports.length > 0 
                            ? `Всего жалоб в очереди: ${reports.length}` 
                            : 'В очереди нет активных жалоб. Отличная работа!'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>На кого жалоба</TableHead>
                                <TableHead>Причина</TableHead>
                                <TableHead className="hidden md:table-cell">Отправитель</TableHead>
                                <TableHead className="hidden md:table-cell">Время</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={report.reportedUser.avatar} alt={report.reportedUser.name} data-ai-hint={report.reportedUser.avatarHint} />
                                                <AvatarFallback>{report.reportedUser.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{report.reportedUser.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{report.reason}</TableCell>
                                    <TableCell className="hidden md:table-cell">{report.reportedBy.name}</TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground">
                                        {formatDistanceToNow(new Date(report.timestamp), { addSuffix: true, locale: ru })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" onClick={() => handleReviewClick(report)}>Рассмотреть</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <ReportAnalysisDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                report={selectedReport}
                onResolve={handleResolve}
            />
        </div>
    );
}
