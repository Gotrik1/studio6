
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { initialLfgLobbies, type LfgLobby } from '@/shared/lib/mock-data/lfg';
import { useSession } from '@/shared/lib/session/client';

interface LfgContextType {
  lobbies: LfgLobby[];
  addLobby: (data: Omit<LfgLobby, 'id' | 'creator' | 'playersJoined' | 'endTime'> & { duration: number }) => void;
  joinLobby: (lobbyId: string) => void;
}

const LfgContext = createContext<LfgContextType | undefined>(undefined);

export const LfgProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useSession();
    const [lobbies, setLobbies] = useState<LfgLobby[]>(initialLfgLobbies);

    const addLobby = (data: Omit<LfgLobby, 'id' | 'creator' | 'playersJoined' | 'endTime'> & { duration: number }) => {
        if (!user) return;
        
        const endTime = new Date(data.startTime.getTime() + data.duration * 60000);

        const newLobby: LfgLobby = {
            id: `lfg-${Date.now()}`,
            ...data,
            endTime,
            creator: { name: user.name, avatar: user.avatar },
            playersJoined: 1,
        };
        setLobbies(prev => [...prev, newLobby].sort((a,b) => a.startTime.getTime() - b.startTime.getTime()));
    };

    const joinLobby = (lobbyId: string) => {
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
