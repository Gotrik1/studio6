

'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useSession } from '@/shared/lib/session/client';
import { getFriends, type Friend } from '@/entities/user/api/friends';
import { getTrainingProposals, createTrainingProposal, updateTrainingProposalStatus } from '@/entities/training-proposal/api/training-proposals';

// This type should align with the backend response
export type TrainingProposal = {
    id: string;
    from: Pick<Friend, 'id' | 'name' | 'avatar'>;
    to: Pick<Friend, 'id' | 'name' | 'avatar'>;
    sport: string;
    date: Date;
    comment: string | null;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
    program?: { id: string; name: string } | null;
};

interface TrainingProposalContextType {
  proposals: TrainingProposal[];
  isLoading: boolean;
  addProposal: (data: { toUserId: string, sport: string, date: Date, comment: string, programId?: string }) => Promise<boolean>;
  updateProposalStatus: (proposalId: string, status: 'ACCEPTED' | 'DECLINED') => Promise<boolean>;
  friends: Friend[];
}

const TrainingProposalContext = createContext<TrainingProposalContextType | undefined>(undefined);

export const TrainingProposalProvider = ({ children }: { children: ReactNode }) => {
    const { user: sessionUser } = useSession();
    const [proposals, setProposals] = useState<TrainingProposal[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAllData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [friendsData, proposalsResult] = await Promise.all([
                getFriends(),
                getTrainingProposals(),
            ]);

            setFriends(friendsData);

            if (proposalsResult.success && Array.isArray(proposalsResult.data)) {
                // Convert date strings to Date objects
                const formattedProposals = (proposalsResult.data as TrainingProposal[]).map((p) => ({
                    ...p,
                    date: new Date(p.date),
                }));
                setProposals(formattedProposals);
            } else if (!proposalsResult.success) {
                console.error("Failed to fetch proposals", proposalsResult.error);
                setProposals([]);
            }

        } catch (error) {
            console.error("Error loading training proposal data", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (sessionUser) {
           fetchAllData();
        }
    }, [sessionUser, fetchAllData]);


    const addProposal = async (data: { toUserId: string, sport: string, date: Date, comment: string, programId?: string }) => {
        const { toUserId, ...restData } = data;
        const result = await createTrainingProposal({ toId: toUserId, ...restData });
        if (result.success) {
            await fetchAllData();
            return true;
        }
        return false;
    };

    const updateProposalStatus = async (proposalId: string, status: 'ACCEPTED' | 'DECLINED') => {
        const result = await updateTrainingProposalStatus(proposalId, status);
        if (result.success) {
            await fetchAllData();
            return true;
        }
        return false;
    };

    return (
        <TrainingProposalContext.Provider value={{ proposals, isLoading, addProposal, updateProposalStatus, friends }}>
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
