'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '@/shared/lib/types';
import { useSession } from '@/shared/lib/session/client';
import { getFriends, type Friend } from '@/entities/user/api/friends';

export type TrainingProposal = {
    id: string;
    from: Pick<User, 'name' | 'avatar'>;
    to: Pick<User, 'name' | 'avatar'>;
    sport: string;
    date: Date;
    comment: string;
    status: 'pending' | 'accepted' | 'declined';
};

const initialProposals: TrainingProposal[] = []; // In a real app, this would be fetched.


interface TrainingProposalContextType {
  proposals: TrainingProposal[];
  addProposal: (toUserId: string, sport: string, date: Date, comment: string) => void;
  updateProposalStatus: (proposalId: string, status: 'accepted' | 'declined') => void;
  friends: Friend[];
}

const TrainingProposalContext = createContext<TrainingProposalContextType | undefined>(undefined);

export const TrainingProposalProvider = ({ children }: { children: ReactNode }) => {
    const { user: sessionUser } = useSession();
    const [proposals, setProposals] = useState<TrainingProposal[]>(initialProposals);
    const [friends, setFriends] = useState<Friend[]>([]);

    useEffect(() => {
        if (sessionUser) {
            getFriends().then(setFriends);
            // Here you would also fetch existing proposals.
        }
    }, [sessionUser]);


    const addProposal = (toUserId: string, sport: string, date: Date, comment: string) => {
        if (!sessionUser) return;
        const toUser = friends.find(f => f.id === toUserId);
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
        // This is a client-side mock. In reality, you'd post to the backend.
        setProposals(prev => [newProposal, ...prev]);
    };

    const updateProposalStatus = (proposalId: string, status: 'accepted' | 'declined') => {
        // Client-side mock.
        setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status } : p));
    };

    return (
        <TrainingProposalContext.Provider value={{ proposals, addProposal, updateProposalStatus, friends }}>
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
