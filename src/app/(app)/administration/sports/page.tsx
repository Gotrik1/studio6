import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { teamSports, individualSports } from "@/lib/mock-data/sports";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SportsAdminPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Управление видами спорта</h1>
                    <p className="text-muted-foreground">
                        Просмотр и управление всеми доступными видами спорта на платформе.
                    </p>
                </div>
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добавить новый вид спорта
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Командные виды спорта</CardTitle>
                        <CardDescription>
                            Список всех командных дисциплин.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-96">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Название</TableHead>
                                        <TableHead>ID</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teamSports.map((sport) => (
                                        <TableRow key={sport.id}>
                                            <TableCell className="font-medium">{sport.name}</TableCell>
                                            <TableCell className="font-mono text-xs">{sport.id}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Индивидуальные виды спорта</CardTitle>
                        <CardDescription>
                            Список всех одиночных и парных дисциплин.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-96">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Название</TableHead>
                                        <TableHead>ID</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {individualSports.map((sport) => (
                                        <TableRow key={sport.id}>
                                            <TableCell className="font-medium">{sport.name}</TableCell>
                                            <TableCell className="font-mono text-xs">{sport.id}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
