import { 
    Users, 
    ShieldCheck, 
    FolderKanban, 
    BrainCircuit,
    Palette,
    Handshake,
    Trophy,
    Gavel,
    Coins,
    DollarSign,
    ShoppingCart,
    Megaphone,
    Map as MapIcon,
    User,
    Briefcase,
    ClipboardList,
    Heart,
    Shield,
    ShieldAlert,
    FileText,
    HeartPulse,
    Server,
    Map,
    FileSignature
} from 'lucide-react';

export const managementCards = [
    { title: "Управление пользователями", description: "Просмотр, роли и статусы всех пользователей.", href: "/administration/users", icon: Users },
    { title: "Турниры (CRM)", description: "Полный цикл управления турнирами.", href: "/administration/tournament-crm/dashboard", icon: Trophy },
    { title: "Очередь модерации", description: "Жалобы и инциденты.", href: "/administration/moderation-queue", icon: Gavel },
    { title: "Центр судейства", description: "Разрешение споров и управление матчами.", href: "/judge-center", icon: Gavel },
    { title: "Геймификация", description: "Настройка рангов и квестов.", href: "/administration/gamification", icon: ShieldCheck },
    { title: "Управление площадками", description: "Модерация и одобрение площадок.", href: "/administration/playgrounds", icon: Map },
    { title: "Виды спорта", description: "Управление дисциплинами.", href: "/administration/sports", icon: Handshake },
    { title: "Мед. аккредитация", description: "Аккредитация мед. партнеров.", href: "/documents/med-accreditation", icon: HeartPulse },
];

export const profileCards = [
    { title: "Профиль Игрока", description: "Пример страницы обычного игрока.", href: "/administration/player", icon: User },
    { title: "Профиль Тренера", description: "Пример страницы тренера.", href: "/administration/coach", icon: ClipboardList },
    { title: "Профиль Судьи", description: "Пример страницы судьи.", href: "/administration/judge", icon: Gavel },
    { title: "Профиль Менеджера", description: "Пример страницы менеджера.", href: "/administration/manager", icon: Briefcase },
    { title: "Профиль Модератора", description: "Пример страницы модератора.", href: "/administration/moderator", icon: Shield },
    { title: "Профиль Организатора", description: "Пример страницы организатора.", href: "/administration/organizer", icon: Megaphone },
    { title: "Профиль Спонсора", description: "Пример страницы спонсора.", href: "/administration/sponsor", icon: Handshake },
    { title: "Профиль Болельщика", description: "Пример страницы болельщика.", href: "/administration/fan", icon: Heart },
    { title: "Профиль Администратора", description: "Пример страницы администратора.", href: "/administration/administrator", icon: ShieldAlert },
];

export const contentCards = [
    { title: "Партнеры", description: "Управление спонсорами и партнерами.", href: "/sponsors", icon: Handshake },
    { title: "Экономика PD", description: "Настройка правил начисления PD.", href: "/pd-economy", icon: Coins },
    { title: "Монетизация", description: "Управление подписками.", href: "/monetization", icon: DollarSign },
    { title: "Магазин", description: "Редактирование товаров в магазине.", href: "/administration/store", icon: ShoppingCart },
    { title: "Промо-акции", description: "Создание и управление акциями.", href: "/promotions", icon: Megaphone },
]

export const systemCards = [
    { title: "Инструменты AI", description: "Демонстрация работы AI-агентов.", href: "/ai-analysis", icon: BrainCircuit },
    { title: "Readme проекта", description: "Обзор проекта, стек, возможности.", href: "/documents/project-readme", icon: FileText },
    { title: "Документация (Frontend)", description: "Подробная техническая документация фронтенда, включая стек, структуру, ADR и гайдлайны.", href: "/documents/architecture", icon: FolderKanban },
    { title: "Документация (Backend)", description: "Обзор архитектуры бэкенда.", href: "/documents/backend-documentation", icon: Server },
    { title: "ADR: Выбор брокера", description: "Почему был выбран Kafka, а не RabbitMQ/NATS.", href: "/documents/adr/ADR-001-Message-Broker-Choice", icon: FileSignature },
    { title: "Демо темы", description: "Просмотр всех UI компонентов.", href: "/theme-demo", icon: Palette },
    { title: "Карта сайта", description: "Обзор всех страниц приложения.", href: "/administration/sitemap", icon: MapIcon },
];