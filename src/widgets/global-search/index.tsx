
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Search } from 'lucide-react';

export function GlobalSearchWidget() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Общий поиск</CardTitle>
                <CardDescription>
                    Для быстрого поиска по всей платформе используйте глобальный поиск в шапке сайта (нажмите <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">⌘K</kbd>).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Искать везде..." className="pl-10" disabled />
                </div>
            </CardContent>
        </Card>
    );
}
