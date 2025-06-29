import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';

const roadmapItems = [
    { title: "Модуль пользователей (Users)", description: "CRUD для профилей, управление ролями, статистика." },
    { title: "Модуль команд (Teams)", description: "Создание/редактирование команд, управление составом, подача заявок." },
    { title: "Модуль матчей (Matches)", description: "Создание матчей, отчеты о результатах, система споров." },
    { title: "Модуль турниров (Tournaments)", description: "Полный цикл управления турнирами: от создания до генерации сетки и завершения." },
    { title: "API для Genkit", description: "Эндпоинты для предоставления данных AI-агентам (например, история матчей для анализа)." },
    { title: "Система уведомлений", description: "Бэкенд для отправки real-time уведомлений пользователям." },
    { title: "Экономика (PD)", description: "API для управления балансом ProDvor Dollars." },
];

export function BackendRoadmapPage() {
    return (
        <div className="prose dark:prose-invert max-w-none">
            <h1>Дорожная карта разработки бэкенда</h1>
            <p className="lead">
                Эта дорожная карта представляет собой высокоуровневый план по созданию серверной части для платформы "ProDvor", заменяя текущие моковые данные.
            </p>
            
            <div className="not-prose grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {roadmapItems.map((item, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>Этап {index + 1}: {item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{item.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
