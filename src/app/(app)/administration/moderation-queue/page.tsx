
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Gavel } from "lucide-react";
import { reportsQueue as initialReports, type Report } from "@/lib/mock-data/moderation";
import { ReportAnalysisDialog } from '@/components/report-analysis-dialog';

export default function ModerationQueuePage() {
    const [reports, setReports] = useState<Report[]>(initialReports);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    const handleOpenDialog = (report: Report) => {
        setSelectedReport(report);
        setIsDialogOpen(true);
    };

    const handleResolveReport = (reportId: string) => {
        setReports(prev => prev.filter(r => r.id !== reportId));
        setIsDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Очередь модерации</h1>
                <p className="text-muted-foreground">
                    Список жалоб от пользователей, требующих вашего внимания.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Активные жалобы ({reports.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {reports.length > 0 ? (
                        reports.map(report => (
                            <Card key={report.id} className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Нарушитель:</p>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8"><AvatarImage src={report.reportedUser.avatar} data-ai-hint={report.reportedUser.avatarHint} /><AvatarFallback>{report.reportedUser.name.charAt(0)}</AvatarFallback></Avatar>
                                                <span className="font-semibold">{report.reportedUser.name}</span>
                                            </div>
                                        </div>
                                         <div className="text-sm text-muted-foreground">&rarr;</div>
                                         <div>
                                            <p className="text-sm text-muted-foreground">Жалоба от:</p>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8"><AvatarImage src={report.reportedBy.avatar} data-ai-hint={report.reportedBy.avatarHint} /><AvatarFallback>{report.reportedBy.name.charAt(0)}</AvatarFallback></Avatar>
                                                <span className="font-semibold">{report.reportedBy.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground pt-2 border-t mt-2">Причина: <span className="text-foreground font-medium">{report.reason}</span></p>
                                </div>
                                <div className="flex w-full md:w-auto items-center justify-end gap-2">
                                     <p className="text-xs text-muted-foreground mr-4">{report.timestamp}</p>
                                    <Button onClick={() => handleOpenDialog(report)}>
                                        <Gavel className="mr-2 h-4 w-4" />
                                        Рассмотреть
                                    </Button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            <Gavel className="mx-auto h-12 w-12 mb-4" />
                            <h3 className="text-lg font-semibold">Очередь пуста</h3>
                            <p>Все жалобы рассмотрены. Отличная работа!</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <ReportAnalysisDialog 
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                report={selectedReport}
                onResolve={handleResolveReport}
            />
        </div>
    );
}
