
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '@/shared/lib/types';
import { useSession } from '@/shared/lib/session/client';
import { friendsList } from '@/shared/lib/mock-data/friends';

export type TrainingProposal = {
    id: string;
    from: Pick<User, 'name' | 'avatar'>;
    to: Pick<User, 'name' | 'avatar'>;
    sport: string;
    date: Date;
    comment: string;
    status: 'pending' | 'accepted' | 'declined';
};

const otherUser1 = { name: friendsList[0].name, avatar: friendsList[0].avatar };
const otherUser2 = { name: friendsList[1].name, avatar: friendsList[1].avatar };
const currentUser = { name: 'Superuser', avatar: 'https://placehold.co/100x100.png' };


const initialProposals: TrainingProposal[] = [
    {
        id: 'tp-1',
        from: otherUser1,
        to: currentUser,
        sport: 'Баскетбол',
        date: new Date(new Date().setDate(new Date().getDate() + 2)),
        comment: 'Хочу отработать трехочковые, составишь компанию?',
        status: 'pending',
    },
    {
        id: 'tp-2',
        from: currentUser,
        to: otherUser2,
        sport: 'Футбол',
        date: new Date(new Date().setDate(new Date().getDate() + 3)),
        comment: 'Давай 1 на 1, на \'Коробке за Пятерочкой\'.',
        status: 'pending',
    },
    {
        id: 'tp-3',
        from: otherUser2,
        to: currentUser,
        sport: 'Теннис',
        date: new Date(new Date().setDate(new Date().getDate() - 1)),
        comment: 'Предложение по теннису',
        status: 'accepted',
    }
];

interface TrainingProposalContextType {
  proposals: TrainingProposal[];
  addProposal: (toUserId: string, sport: string, date: Date, comment: string) => void;
  updateProposalStatus: (proposalId: string, status: 'accepted' | 'declined') => void;
}

const TrainingProposalContext = createContext<TrainingProposalContextType | undefined>(undefined);

export const TrainingProposalProvider = ({ children }: { children: ReactNode }) => {
    const { user: sessionUser } = useSession();
    const [proposals, setProposals] = useState<TrainingProposal[]>(initialProposals);

    const addProposal = (toUserId: string, sport: string, date: Date, comment: string) => {
        if (!sessionUser) return;
        const toUser = friendsList.find(f => f.id === toUserId);
        if (!toUser) return;
        
        const newProposal: TrainingProposal = {
            id: `tp-${Date.now()}`,
            from: { name: sessionUser.name, avatar: sessionUser.avatar },
            to: { name: toUser.name, avatar: toUser.avatar },
            sport,
            date,
            comment,
            status: 'pending',
        };
        setProposals(prev => [newProposal, ...prev]);
    };

    const updateProposalStatus = (proposalId: string, status: 'accepted' | 'declined') => {
        setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status } : p));
    };

    return (
        <TrainingProposalContext.Provider value={{ proposals, addProposal, updateProposalStatus }}>
            {children}
        </TrainingProposalContext.Provider>
    );
};

export const useTrainingProposals = () => {
    const context = useContext(TrainingProposalContext);
    if (context === undefined) {
        throw new Error('useTrainingProposals must be used within a TrainingProposalProvider');
    }
    return context;
};
