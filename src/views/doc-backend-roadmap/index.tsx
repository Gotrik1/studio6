'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { AlertTriangle, Database, Server, UploadCloud } from 'lucide-react';

const roadmapItems = [
    { 
        title: "Этап 1: Фундамент и Аутентификация", 
        icon: Database,
        points: [
            "Выбор и настройка СУБД (PostgreSQL / MongoDB).",
            "Разработка схемы данных для всех сущностей (Prisma).",
            "Интеграция с сервисом аутентификации (Keycloak / Firebase Auth).",
            "Замена сессий на JWT-токены.",
        ]
    },
    { 
        title: "Этап 2: Основной API", 
        icon: Server,
        points: [
            "CRUD-эндпоинты для всех сущностей (пользователи, команды, матчи).",
            "Реализация бизнес-логики (создание команд, система заявок).",
            "API для турниров: создание, генерация сетки, отчеты о результатах.",
            "API для системы уведомлений.",
        ]
    },
    { 
        title: "Этап 3: Интеграция с AI", 
        icon: Server,
        points: [
            "Создание защищенных эндпоинтов для Genkit-инструментов.",
            "Настройка векторной базы данных для RAG-сценариев (поиск, FAQ).",
            "Оптимизация передачи данных для AI-анализа.",
        ]
    },
    { 
        title: "Этап 4: Тестирование и DevOps", 
        icon: UploadCloud,
        points: [
            "Написание юнит- и интеграционных тестов для API.",
            "Настройка CI/CD-пайплайнов для автоматической сборки и деплоя.",
            "Конфигурация продакшен-окружения (масштабирование, логирование, мониторинг).",
        ]
    },
];

export function BackendRoadmapPage() {
    return (
        <div className="prose dark:prose-invert max-w-none opacity-0 animate-fade-in-up">
            <h1>Дорожная карта разработки бэкенда</h1>
            <p className="lead">
                Эта дорожная карта представляет собой высокоуровневый план по созданию серверной части для платформы &quot;ProDvor&quot;, заменяя текущие моковые данные.
            </p>
            
            <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Важное замечание</AlertTitle>
                <AlertDescription>
                    Текущая реализация использует моковые данные и не имеет реального бэкенда. Все описанные ниже пункты требуют полной реализации для запуска в продакшен.
                </AlertDescription>
            </Alert>
            
            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {roadmapItems.map((item, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <item.icon className="h-6 w-6 text-primary" />
                                {item.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-2 text-sm">
                                {item.points.map((point, i) => (
                                    <li key={i}>{point}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
