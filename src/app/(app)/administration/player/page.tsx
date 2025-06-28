import { PlayerProfile } from "@/components/player-profile";

export default function PlayerProfilePage() {
    const user = {
        name: "Alex 'CyberSlasher' Doe",
        email: 'alex.doe@prodvor.com',
        role: 'Игрок',
        avatar: 'https://placehold.co/100x100.png',
        location: "Москва, Россия",
        mainSport: "Valorant",
        status: "Капитан команды 'Кибер Орлы'",
        isVerified: true,
    };

  return <PlayerProfile user={user} isCurrentUser={false} />;
}
