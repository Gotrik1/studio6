
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { TrainingProgram, TrainingLogEntry } from '@/entities/training-program/model/types';
import { getTrainingPrograms } from '@/entities/training-program/api/get-programs';
import { getTrainingLog } from '@/entities/training-program/api/get-training-log';
import { useToast } from '@/shared/hooks/use-toast';
import { useSession } from '@/shared/lib/session/client';


interface TrainingContextType {
  programs: TrainingProgram[];
  currentProgram: TrainingProgram | null;
  selectProgram: (program: TrainingProgram) => void;
  addProgram: (program: TrainingProgram) => void;
  updateProgram: (program: TrainingProgram) => void;
  deleteProgram: (programId: string) => void;
  isLoading: boolean;
  log: TrainingLogEntry[];
  setLog: React.Dispatch<React.SetStateAction<TrainingLogEntry[]>>;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const TrainingProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { user } = useSession();
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [currentProgram, setCurrentProgram] = useState<TrainingProgram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [log, setLog] = useState<TrainingLogEntry[]>([]);

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const initialPrograms = await getTrainingPrograms();
        setPrograms(initialPrograms);
        
        const defaultProgram = initialPrograms.find(p => p.id === 'classic-split-3') || (initialPrograms.length > 0 ? initialPrograms[0] : null);
        setCurrentProgram(defaultProgram);

        if (user) {
            const initialLog = await getTrainingLog();
            setLog(initialLog);
        }

      } catch (error) {
          toast({
              variant: 'destructive',
              title: 'Ошибка загрузки данных',
              description: error instanceof Error ? error.message : 'Не удалось загрузить тренировочные программы или журнал.'
          });
      } finally {
          setIsLoading(false);
      }
    }
    loadInitialData();
  }, [toast, user]);


  const selectProgram = (program: TrainingProgram) => {
    setCurrentProgram(program);
  };

  const addProgram = (program: TrainingProgram) => {
    // In a real app, this would be an API call, and then we'd refetch or update state.
    setPrograms(prev => [program, ...prev]);
  };
  
  const updateProgram = (updatedProgram: TrainingProgram) => {
    // API call here
    setPrograms(prev => prev.map(p => p.id === updatedProgram.id ? updatedProgram : p));
    if (currentProgram?.id === updatedProgram.id) {
        setCurrentProgram(updatedProgram);
    }
  };
  
  const deleteProgram = (programId: string) => {
    // API call here
    setPrograms(prev => prev.filter(p => p.id !== programId));
    if (currentProgram?.id === programId) {
        // Select another program if the current one is deleted
        const remainingPrograms = programs.filter(p => p.id !== programId);
        setCurrentProgram(remainingPrograms.length > 0 ? remainingPrograms[0] : null);
    }
  };

  const value = { programs, currentProgram, selectProgram, addProgram, updateProgram, deleteProgram, isLoading, log, setLog };

  return (
    <TrainingContext.Provider value={value}>
      {children}
    </TrainingContext.Provider>
  );
};

export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (context === undefined) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
};
