
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { CodeBlock } from '@/widgets/code-block';
import { Rocket, Gem, Wrench, FolderOpen, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

const techStack = [
    "Фреймворк: Next.js (с App Router)",
    "Язык: TypeScript",
    "Стилизация: Tailwind CSS",
    "UI-компоненты: ShadCN UI",
    "Генеративный AI: Genkit (Firebase)",
    "Формы: React Hook Form & Zod",
    "Архитектура: Feature-Sliced Design (FSD)"
];

const launchSteps = [
    { title: "Установите зависимости:", code: "npm install" },
    { title: "Настройте переменные окружения:", code: "GOOGLE_API_KEY=..." },
    { title: "Запустите сервер для разработки (Next.js):", code: "npm run dev" },
    { title: "Запустите Genkit (для работы AI-функций):", code: "npm run genkit:watch" },
    { title: "Откройте приложение:", code: "http://localhost:9002" }
];

const projectStructure = [
    { layer: "`src/app`", description: "Инициализация приложения, глобальные стили, роутинг." },
    { layer: "`src/pages`", description: "Компоненты страниц, собирающие виджеты." },
    { layer: "`src/widgets`", description: "Составные блоки интерфейса (например, Header, Sidebar)." },
    { layer: "`src/features`", description: "Пользовательские сценарии (например, отправка сообщения)." },
    { layer: "`src/entities`", description: "Бизнес-сущности (User, Team) и их UI-представления." },
    { layer: "`src/shared`", description: "Переиспользуемый код (UI-кит, утилиты, конфиги)." }
];

const roadmap = [
    "Реализовать бэкенд: Заменить все моковые данные и API-вызовы на реальное взаимодействие с сервером.",
    "Внедрить систему аутентификации: Подключить Keycloak или другой сервис для безопасного управления пользователями.",
    "Написать тесты: Покрыть ключевую бизнес-логику и компоненты юнит- и интеграционными тестами.",
    "Настроить CI/CD: Автоматизировать процессы сборки, тестирования и развертывания."
];


export function ProjectReadmePage() {
    return (
        <div className="prose dark:prose-invert max-w-none">
            <div className="not-prose relative mb-8 aspect-[2/1] w-full overflow-hidden rounded-lg">
                <Image src="https://placehold.co/800x400.png" alt="ProDvor Banner" fill className="object-cover" data-ai-hint="esports sports montage" />
            </div>
            
            <h1>ProDvor: Социальная платформа для спорта и киберспорта</h1>

            <p className="lead">
                **ProDvor** — это полнофункциональный прототип современной социальной платформы, созданный для объединения мира дворового спорта и любительского киберспорта. Платформа предоставляет игрокам, командам и организаторам все необходимые инструменты для соревнований, роста и построения сообщества.
            </p>
            <p>
                Проект разработан с использованием **Next.js (App Router)** и **Feature-Sliced Design (FSD)**, что обеспечивает высокую производительность, масштабируемость и простоту поддержки. Особое внимание уделено интеграции **генеративного AI (Genkit)** для создания уникального пользовательского опыта.
            </p>
            <blockquote>
                🚀 **Цель проекта:** Продемонстрировать создание сложного, многофункционального веб-приложения с современным стеком и глубокой интеграцией AI.
            </blockquote>
            
            <hr />

            <h2><Gem className="inline-block h-6 w-6 mr-2" /> Ключевые AI-возможности</h2>
            <p>Прототип "ProDvor" демонстрирует глубокую и многогранную интеграцию генеративного AI (Genkit) во все аспекты пользовательского опыта, делая платформу по-настоящему интеллектуальной. <a href="/ai-analysis">Демо-страница AI-инструментов.</a></p>
            
            <div className="not-prose grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader><CardTitle className="text-base">Для всех пользователей</CardTitle></CardHeader>
                    <CardContent className="text-sm">Интеллектуальная лента с TTS, умный поиск (RAG), AI-генератор аватаров, AI-ассистент поддержки, персонализированный онбординг, AI-предложения для ответов в чате.</CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="text-base">Для игроков и команд</CardTitle></CardHeader>
                    <CardContent className="text-sm">AI-Коуч и Аналитик, конструктор тренировок, AI-помощник в чате, мастер создания команды, генератор спонсорских питчей, анализ заявок.</CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="text-base">Для организаторов</CardTitle></CardHeader>
                    <CardContent className="text-sm">AI-мастер создания турниров и промо-акций, AI-комментатор и медиа-центр, AI-помощник для судей, AI-скаут для спонсоров.</CardContent>
                </Card>
            </div>
            
            <hr className="my-8" />
            
            <h2><Wrench className="inline-block h-6 w-6 mr-2" /> Технологический стек</h2>
            <ul className="list-disc list-inside">
                {techStack.map(tech => <li key={tech}>{tech}</li>)}
            </ul>

            <hr className="my-8" />

            <h2><Rocket className="inline-block h-6 w-6 mr-2" /> Как запустить</h2>
            {launchSteps.map(step => (
                 <div key={step.title} className="mb-4">
                    <p><strong>{step.title}</strong></p>
                    <CodeBlock code={step.code} language="bash" />
                </div>
            ))}
           
            <hr className="my-8" />
            
            <h2><FolderOpen className="inline-block h-6 w-6 mr-2" /> Структура проекта</h2>
            <p>Проект строго следует методологии **Feature-Sliced Design**. Подробное описание архитектуры можно найти в документе <a href="/documents/architecture">архитектуры</a>.</p>
            <div className="not-prose space-y-2">
                {projectStructure.map(item => (
                    <div key={item.layer}>
                        <p><strong>{item.layer}</strong>: {item.description}</p>
                    </div>
                ))}
            </div>

            <hr className="my-8" />
            
            <h2><AlertTriangle className="inline-block h-6 w-6 mr-2" /> Что дальше? (Roadmap)</h2>
             <p>Текущий проект — это высококачественный прототип. Для перехода в продакшен необходимо:</p>
             <ul className="list-disc list-inside">
                {roadmap.map(item => <li key={item}>{item}</li>)}
            </ul>
        </div>
    );
}
