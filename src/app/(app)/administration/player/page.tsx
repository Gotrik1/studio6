import PlayerClient from "./client";

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

  return <PlayerClient user={user} isCurrentUser={false} />;
}
