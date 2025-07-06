'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { LfgLobby } from '@/entities/lfg/model/types';
import { fetchLobbies, createLobby, joinLobby as apiJoinLobby, type CreateLobbyApiData } from '@/entities/lfg/api/lfg';
import { useToast } from '@/shared/hooks/use-toast';

export type { LfgLobby };

interface LfgContextType {
  lobbies: LfgLobby[];
  isLoading: boolean;
  addLobby: (data: CreateLobbyApiData) => Promise<boolean>;
  joinLobby: (lobbyId: string) => void;
}

const LfgContext = createContext<LfgContextType | undefined>(undefined);

export const LfgProvider = ({ children }: { children: ReactNode }) => {
    const [lobbies, setLobbies] = useState<LfgLobby[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const loadLobbies = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await fetchLobbies();
            setLobbies(data);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить лобби.' });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        loadLobbies();
    }, [loadLobbies]);

    const addLobby = async (data: CreateLobbyApiData) => {
         const result = await createLobby(data);
         if (result.success) {
            await loadLobbies(); // Refresh data
            return true;
         } else {
            return false;
         }
    };

    const joinLobby = async (lobbyId: string) => {
        const result = await apiJoinLobby(lobbyId);
        if (result.success) {
            toast({
                title: "Вы присоединились к лобби!",
                description: `Вы успешно присоединились к активности.`,
            });
            await loadLobbies(); // Refresh data
        } else {
             toast({ variant: 'destructive', title: 'Ошибка', description: result.error });
        }
    };

    return (
        <LfgContext.Provider value={{ lobbies, isLoading, addLobby, joinLobby }}>
            {children}
        </LfgContext.Provider>
    );
};

export const useLfg = () => {
    const context = useContext(LfgContext);
    if (context === undefined) {
        throw new Error('useLfg must be used within a LfgProvider');
    }
    return context;
};
