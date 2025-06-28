import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userList } from "@/lib/mock-data";
import { Search } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { UserTable } from "@/components/user-table";

const roles = [
    { value: "all", label: "Все" },
    { value: "Администратор", label: "Админы" },
    { value: "Модератор", label: "Модеры" },
    { value: "Капитан", label: "Капитаны" },
    { value: "Игрок", label: "Игроки" },
    { value: "Судья", label: "Судьи" },
    { value: "Менеджер", label: "Менеджеры" },
    { value: "Организатор", label: "Организаторы" },
    { value: "Спонсор", label: "Спонсоры" },
    { value: "Болельщик", label: "Болельщики" },
];

export default function UserManagementPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Управление пользователями</h1>
                <p className="text-muted-foreground">
                    Просмотр, поиск и управление всеми пользователями платформы.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Поиск по имени или email..." className="w-full pl-10" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all">
                        <ScrollArea className="w-full">
                            <TabsList>
                                {roles.map(role => (
                                    <TabsTrigger key={role.value} value={role.value}>{role.label}</TabsTrigger>
                                ))}
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>

                        <TabsContent value="all" className="mt-4">
                            <UserTable users={userList} />
                        </TabsContent>

                        {roles.filter(r => r.value !== 'all').map(role => (
                            <TabsContent key={role.value} value={role.value} className="mt-4">
                                <UserTable users={userList.filter(u => u.role === role.value)} />
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
