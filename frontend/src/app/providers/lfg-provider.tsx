'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { LfgLobby } from '@/entities/lfg/model/types';
import { useSession } from '@/shared/lib/session/client';
import { fetchWithAuth } from '@/shared/lib/api-client';

export type { LfgLobby };

interface LfgContextType {
  lobbies: LfgLobby[];
  addLobby: (data: Omit<LfgLobby, 'id' | 'creator' | 'playersJoined' | 'endTime'> & { duration: number }) => void;
  joinLobby: (lobbyId: string) => void;
}

const LfgContext = createContext<LfgContextType | undefined>(undefined);

export const LfgProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useSession();
    const [lobbies, setLobbies] = useState<LfgLobby[]>([]);

    useEffect(() => {
        // In a real app, you would fetch initial lobbies here.
        // For now, it starts empty.
    }, []);

    const addLobby = (data: Omit<LfgLobby, 'id' | 'creator' | 'playersJoined' | 'endTime'> & { duration: number }) => {
        if (!user) return;
        
        // This is a client-side mock of adding a lobby. A real implementation would post to the backend.
        const endTime = new Date(data.startTime.getTime() + data.duration * 60000);

        const newLobby: LfgLobby = {
            id: `lfg-${Date.now()}`,
            ...data,
            endTime,
            creator: { name: user.name, avatar: user.avatar },
            playersJoined: 1,
        };
        setLobbies(prev => [...prev, newLobby].sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()));
    };

    const joinLobby = (lobbyId: string) => {
        // Client-side mock of joining.
        setLobbies(prevLobbies => prevLobbies.map(lobby => {
            if (lobby.id === lobbyId && lobby.playersJoined < lobby.playersNeeded) {
                return { ...lobby, playersJoined: lobby.playersJoined + 1 };
            }
            return lobby;
        }));
    };

    return (
        <LfgContext.Provider value={{ lobbies, addLobby, joinLobby }}>
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
