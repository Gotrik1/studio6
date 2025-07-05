'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Measurement } from '@/entities/user/model/types';

interface MeasurementsContextType {
  history: Measurement[];
  addMeasurement: (data: Omit<Measurement, 'id' | 'date'>) => void;
}

const MeasurementsContext = createContext<MeasurementsContextType | undefined>(undefined);

const initialHistory: Measurement[] = []; // In a real app, this would be fetched from the backend.

export const MeasurementsProvider = ({ children }: { children: ReactNode }) => {
    const [history, setHistory] = useState<Measurement[]>(initialHistory);

    const addMeasurement = (data: Omit<Measurement, 'id' | 'date'>) => {
        const newMeasurement: Measurement = {
            id: `m-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            ...data,
        };
        setHistory(prev => [newMeasurement, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    const value = { history, addMeasurement };

    return (
        <MeasurementsContext.Provider value={value}>
            {children}
        </MeasurementsContext.Provider>
    );
};

export const useMeasurements = () => {
    const context = useContext(MeasurementsContext);
    if (context === undefined) {
        throw new Error('useMeasurements must be used within a MeasurementsProvider');
    }
    return context;
};
