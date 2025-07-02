import { addHours, setMinutes } from 'date-fns';

export type PlaygroundBooking = {
    id: string;
    playgroundId: string;
    team: {
        name: string;
        avatar: string;
        avatarHint: string;
    };
    startTime: Date;
    endTime: Date;
};

const now = new Date();
const todayAt = (hour: number, minute: number = 0) => setMinutes(addHours(now, hour - now.getHours()), minute);

export const playgroundSchedule: PlaygroundBooking[] = [
    {
        id: 'booking-1',
        playgroundId: 'playground-1',
        team: { name: 'Дворовые Атлеты', avatar: 'https://placehold.co/100x100.png', avatarHint: 'athletic team logo' },
        startTime: todayAt(18, 0),
        endTime: todayAt(19, 30),
    },
    {
        id: 'booking-2',
        playgroundId: 'playground-1',
        team: { name: 'Соколы', avatar: 'https://placehold.co/100x100.png', avatarHint: 'falcon logo' },
        startTime: todayAt(18, 30), // Overlapping booking
        endTime: todayAt(20, 0),
    },
    {
        id: 'booking-3',
        playgroundId: 'playground-2',
        team: { name: 'Торпедо', avatar: 'https://placehold.co/100x100.png', avatarHint: 'torpedo logo' },
        startTime: todayAt(19, 0),
        endTime: todayAt(20, 0),
    }
];
