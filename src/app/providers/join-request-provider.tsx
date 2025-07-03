'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '@/shared/lib/types';

export type JoinRequest = {
    id: string;
    teamId: string;
    applicant: User;
    message: string;
    statsSummary: string; // For AI analysis
};

// Mock initial data, but can be empty in a real app
const initialRequests: JoinRequest[] = [
    { 
        id: 'req-1',
        teamId: 'dvotovyie-atlety',
        applicant: { id: 'user-shadow', name: "ShadowStriker", role: "Нападающий", avatar: 'https://placehold.co/100x100.png', email: 'shadow@example.com' },
        message: "Привет, ищу сильную команду, чтобы выигрывать турниры. Готов играть на любой роли, но предпочитаю нападающего.",
        statsSummary: "Опытный нападающий, высокий процент голов, играет в основном в Valorant."
    },
    { 
        id: 'req-2',
        teamId: 'dvotovyie-atlety',
        applicant: { id: 'user-foxy', name: "Foxy", role: "Полузащитник", avatar: 'https://placehold.co/100x100.png', email: 'foxy@example.com' },
        message: "Ищу команду для регулярных тренировок и участия в лиге. Хорошо вижу поле.",
        statsSummary: "Универсальный игрок, хорошо видит поле. Основная игра - футбол."
    },
];

interface JoinRequestContextType {
  requests: JoinRequest[];
  addRequest: (teamId: string, user: User, message: string) => void;
  removeRequest: (requestId: string) => void;
}

const JoinRequestContext = createContext<JoinRequestContextType | undefined>(undefined);

export const JoinRequestProvider = ({ children }: { children: ReactNode }) => {
    const [requests, setRequests] = useState<JoinRequest[]>(initialRequests);

    const addRequest = (teamId: string, user: User, message: string) => {
        const newRequest: JoinRequest = {
            id: `req-${Date.now()}`,
            teamId,
            applicant: user,
            message,
            statsSummary: "Активный игрок, ищущий новую команду. Готов учиться и вносить вклад в победы." // Mock summary
        };
        setRequests(prev => [newRequest, ...prev]);
    };

    const removeRequest = (requestId: string) => {
        setRequests(prev => prev.filter(req => req.id !== requestId));
    };

    return (
        <JoinRequestContext.Provider value={{ requests, addRequest, removeRequest }}>
            {children}
        </JoinRequestContext.Provider>
    );
};

export const useJoinRequests = () => {
    const context = useContext(JoinRequestContext);
    if (context === undefined) {
        throw new Error('useJoinRequests must be used within a JoinRequestProvider');
    }
    return context;
};
