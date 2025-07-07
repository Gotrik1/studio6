


'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Measurement } from '@/entities/user/model/types';
import { getMeasurements, createMeasurement } from '@/entities/measurement/api/measurements';
import { useToast } from '@/shared/hooks/use-toast';
import type { FetchResult } from '@/shared/lib/api-client';

interface MeasurementsContextType {
  history: Measurement[];
  addMeasurement: (data: Omit<Measurement, 'id'>) => Promise<FetchResult<Measurement>>;
  isLoading: boolean;
}

const MeasurementsContext = createContext<MeasurementsContextType | undefined>(undefined);

export const MeasurementsProvider = ({ children }: { children: React.ReactNode }) => {
    const { toast } = useToast();
    const [history, setHistory] = useState<Measurement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const loadMeasurements = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getMeasurements();
            setHistory(data);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Не удалось загрузить замеры.';
            toast({ variant: 'destructive', title: 'Ошибка', description: errorMessage });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);
    
    useEffect(() => {
        loadMeasurements();
    }, [loadMeasurements]);

    const addMeasurement = async (data: Omit<Measurement, 'id'>) => {
        const result = await createMeasurement(data);
        if (result.success) {
            await loadMeasurements(); // Refetch to get the latest data
        }
        return result;
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
