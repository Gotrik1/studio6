
'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { pdHistory as initialPdHistory } from '@/shared/config/gamification';

type PdTransaction = {
    id: string;
    timestamp: string;
    source: string;
    value: number;
};

interface PDEconomyContextType {
    history: PdTransaction[];
    balance: number;
    addTransaction: (source: string, value: number) => void;
}

const PDEconomyContext = createContext<PDEconomyContextType | undefined>(undefined);

export const PDEconomyProvider = ({ children }: { children: ReactNode }) => {
    const [history, setHistory] = useState<PdTransaction[]>(initialPdHistory);

    const balance = useMemo(() => {
        return history.reduce((acc, item) => acc + item.value, 0);
    }, [history]);

    const addTransaction = (source: string, value: number) => {
        const newTransaction: PdTransaction = {
            id: `tx-${Date.now()}`,
            timestamp: new Date().toISOString(),
            source,
            value,
        };
        setHistory(prevHistory => [newTransaction, ...prevHistory].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    };

    const value = { history, balance, addTransaction };

    return (
        <PDEconomyContext.Provider value={value}>
            {children}
        </PDEconomyContext.Provider>
    );
};

export const usePDEconomy = () => {
    const context = useContext(PDEconomyContext);
    if (context === undefined) {
        throw new Error('usePDEconomy must be used within a PDEconomyProvider');
    }
    return context;
};
