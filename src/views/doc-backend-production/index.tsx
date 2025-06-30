
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { CheckCircle, AlertTriangle, Database, Lock } from 'lucide-react';

export function BackendProductionPage() {
    return (
        <div className="prose dark:prose-invert max-w-none opacity-0 animate-fade-in-up">
            <h1>План миграции бэкенда на продакшен</h1>
            <p className="lead">
                Этот документ описывает шаги и требования для перехода от мокового бэкенда к полноценной, готовой к продакшену серверной части.
            </p>

            <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Важное замечание</AlertTitle>
                <AlertDescription>
                    Текущая реализация использует моковые данные и не имеет реального бэкенда. Все описанные ниже пункты требуют полной реализации.
                </AlertDescription>
            </Alert>

            <h2>1. База данных</h2>
            <Card className="not-prose">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Database /> Выбор и настройка СУБД</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p><CheckCircle className="inline h-4 w-4 text-green-500 mr-2" /> <strong>Рекомендация:</strong> PostgreSQL или MongoDB.</p>
                    <p><CheckCircle className="inline h-4 w-4 text-green-500 mr-2" /> <strong>Задача:</strong> Разработать схему данных для всех сущностей (Users, Teams, Matches, Tournaments и т.д.).</p>
                    <p><CheckCircle className="inline h-4 w-4 text-green-500 mr-2" /> <strong>Задача:</strong> Настроить миграции для управления изменениями схемы (например, с помощью Prisma Migrate).</p>
                </CardContent>
            </Card>

            <h2 className="mt-8">2. Аутентификация и авторизация</h2>
            <Card className="not-prose">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lock /> Безопасность пользователей</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p><CheckCircle className="inline h-4 w-4 text-green-500 mr-2" /> <strong>Рекомендация:</strong> Интеграция с Keycloak, Firebase Authentication или аналогичным IdP.</p>
                     <p><CheckCircle className="inline h-4 w-4 text-green-500 mr-2" /> <strong>Задача:</strong> Заменить текущую систему сессий на основе cookie на JWT-токены.</p>
                     <p><CheckCircle className="inline h-4 w-4 text-green-500 mr-2" /> <strong>Задача:</strong> Реализовать ролевую модель доступа (RBAC) на уровне API.</p>
                </CardContent>
            </Card>
            
            <h2 className="mt-8">3. Разработка API</h2>
            <p>Необходимо создать RESTful или GraphQL API для взаимодействия с фронтендом. Все функции, которые сейчас используют моковые данные (например, `getMatchById`), должны быть заменены на реальные API-вызовы.</p>

        </div>
    );
}
