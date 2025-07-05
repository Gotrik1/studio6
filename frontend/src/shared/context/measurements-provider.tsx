'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Measurement } from '@/entities/user/model/types';
import { getMeasurements, createMeasurement } from '@/entities/measurement/api/measurements';
import { useToast } from '@/shared/hooks/use-toast';

interface MeasurementsContextType {
  history: Measurement[];
  addMeasurement: (data: Omit<Measurement, 'id' | 'date'>) => void;
  isLoading: boolean;
}

const MeasurementsContext = createContext<MeasurementsContextType | undefined>(undefined);

export const MeasurementsProvider = ({ children }: { children: ReactNode }) => {
    const { toast } = useToast();
    const [history, setHistory] = useState<Measurement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const loadMeasurements = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getMeasurements();
            setHistory(data);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить замеры.' });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);
    
    useEffect(() => {
        loadMeasurements();
    }, [loadMeasurements]);

    const addMeasurement = async (data: Omit<Measurement, 'id' | 'date'>) => {
        const newMeasurementData = {
            date: new Date().toISOString(),
            ...data,
        };
        const result = await createMeasurement(newMeasurementData);
        if (result.success) {
            await loadMeasurements(); // Refetch to get the latest data
        } else {
             toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось сохранить замеры.' });
        }
    };

    const value = { history, addMeasurement, isLoading };

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
