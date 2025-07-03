'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Users, Gamepad2, BrainCircuit, Trophy } from 'lucide-react';

export function VisionAndPrinciplesPage() {
    return (
        <div className="prose dark:prose-invert max-w-none opacity-0 animate-fade-in-up">
            <h1>Видение и принципы проекта &quot;ProDvor&quot;</h1>
            <p className="lead">
                &quot;ProDvor&quot; — это больше, чем просто платформа. Это экосистема, созданная для того, чтобы дать каждому шанс проявить себя в мире спорта и киберспорта.
            </p>

            <h2>Наша миссия</h2>
            <p>
                Мы стремимся разрушить барьеры между профессиональным и любительским спортом, предоставляя удобные и мощные инструменты для организации, участия и роста. Мы верим, что каждый двор, каждая команда и каждый игрок заслуживают своей минуты славы.
            </p>

            <h2>Ключевые принципы</h2>
            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Users className="h-8 w-8 text-primary" />
                        <CardTitle>Доступность для всех</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Платформа должна быть интуитивно понятной и доступной как для обычных игроков, так и для организаторов крупных турниров.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Gamepad2 className="h-8 w-8 text-primary" />
                        <CardTitle>Объединение миров</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Мы стираем границы между реальным дворовым спортом (футбол, баскетбол) и киберспортом, создавая единое сообщество.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <BrainCircuit className="h-8 w-8 text-primary" />
                        <CardTitle>Интеллектуальный помощник</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Интеграция AI (Genkit) — это не просто модная функция, а основной инструмент, помогающий пользователям на каждом шагу.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Trophy className="h-8 w-8 text-primary" />
                        <CardTitle>Дух соревнования</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Всё на платформе — от системы рейтинга до квестов — направлено на поддержание здорового соревновательного духа.
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
