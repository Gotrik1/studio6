import CoachClient from "@/app/(app)/administration/coach/client";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { notFound } from "next/navigation";
import type { CoachedPlayer } from '@/widgets/team-training-analytics';

const DEMO_COACH_ID = '3'; // Maria 'Shadow' Petrova will be our demo coach

// Mock data that would normally come from a more specific API endpoint or a different source
const coachAchievements = [
    { name: 'Первый ученик', description: 'Начать тренировать первого игрока', icon: 'Award', unlocked: true },
    { name: 'Мастер-план', description: 'Создать 5 уникальных программ', icon: 'ClipboardList', unlocked: true },
    { name: 'Восходящая звезда', description: 'Ученик достиг высокого ранга', icon: 'TrendingUp', unlocked: false },
    { name: 'Чемпионский состав', description: 'Команда ученика выиграла турнир', icon: 'Trophy', unlocked: false },
    { name: 'Гуру тактики', description: 'Получить 50 положительных отзывов', icon: 'Star', unlocked: true },
    { name: 'Полный состав', description: 'Тренировать 5 игроков одновременно', icon: 'Users', unlocked: false },
];

export async function CoachProfilePage() {
    const profileData = await getPlayerProfile(DEMO_COACH_ID);

    if (!profileData) {
        notFound();
    }
    
    // In a real app, coachedPlayers would come from profileData.user.coaching
    // For now, we are creating a mock structure that matches the CoachedPlayer type
    const coachedPlayers: CoachedPlayer[] = (profileData.user.coaching || []).map((player: any) => ({
        id: player.id,
        name: player.name,
        avatar: player.avatar || '',
        avatarHint: 'esports player portrait',
        role: player.role,
        // Mock stats and history as the backend doesn't provide this level of detail yet
        stats: { kda: '1.2', winRate: '55%', favoriteMap: 'Ascent' },
        matchHistory: 'W 13-8, L 10-13, W 13-2',
    }));
    
    return (
        <CoachClient 
            user={profileData.user}
            achievements={coachAchievements}
            players={coachedPlayers}
        />
    );
}
