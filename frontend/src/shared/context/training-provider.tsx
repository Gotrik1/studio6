


'use client';

import React, { createContext, useContext, useState, type ReactNode, useEffect, useCallback } from 'react';
import type { TrainingProgram, TrainingLogEntry } from '@/entities/training-program/model/types';
import { getTrainingPrograms } from '@/entities/training-program/api/get-programs';
import { getTrainingLog } from '@/entities/training-program/api/get-training-log';
import { useToast } from '@/shared/hooks/use-toast';
import { useSession } from '@/shared/lib/session/client';
import { createTrainingProgram, updateTrainingProgram as apiUpdateProgram, deleteTrainingProgram, type ProgramFormValues } from '@/entities/training-program/api/programs';


interface TrainingContextType {
  programs: TrainingProgram[];
  currentProgram: TrainingProgram | null;
  selectProgram: (program: TrainingProgram) => void;
  addProgram: (data: ProgramFormValues) => Promise<boolean>;
  updateProgram: (id: string, data: ProgramFormValues) => Promise<boolean>;
  deleteProgram: (programId: string) => Promise<boolean>;
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

  const fetchPrograms = useCallback(async () => {
    setIsLoading(true);
    try {
      const initialPrograms = await getTrainingPrograms();
      setPrograms(initialPrograms);
      if (!currentProgram) {
         const defaultProgram = initialPrograms.find(p => p.id === 'classic-split-3') || (initialPrograms.length > 0 ? initialPrograms[0] : null);
         setCurrentProgram(defaultProgram);
      }
    } catch (error) {
       toast({
            variant: 'destructive',
            title: 'Ошибка загрузки программ',
            description: error instanceof Error ? error.message : 'Не удалось загрузить тренировочные программы.'
        });
    } finally {
        setIsLoading(false);
    }
  }, [currentProgram, toast]);
  
  const fetchLog = useCallback(async () => {
       if (user) {
            const initialLog = await getTrainingLog();
            setLog(initialLog);
        }
  }, [user]);

  useEffect(() => {
    fetchPrograms();
    fetchLog();
  }, [fetchPrograms, fetchLog]);


  const selectProgram = (program: TrainingProgram) => {
    setCurrentProgram(program);
  };

  const addProgram = async (data: ProgramFormValues) => {
    const result = await createTrainingProgram(data);

    if (result.success) {
        await fetchPrograms();
        return true;
    }
    toast({ variant: 'destructive', title: 'Ошибка', description: result.error });
    return false;
  };
  
  const updateProgram = async (id: string, data: ProgramFormValues) => {
    const result = await apiUpdateProgram(id, data);
    
    if (result.success) {
        await fetchPrograms();
        if (currentProgram?.id === id) {
            const updatedPrograms = await getTrainingPrograms();
            const newlyUpdated = updatedPrograms.find(p => p.id === id);
            if(newlyUpdated) setCurrentProgram(newlyUpdated);
        }
        return true;
    }
    toast({ variant: 'destructive', title: 'Ошибка', description: result.error });
    return false;
  };
  
  const deleteProgram = async (programId: string) => {
    const result = await deleteTrainingProgram(programId);
    if(result.success) {
        const updatedPrograms = programs.filter(p => p.id !== programId);
        setPrograms(updatedPrograms);
        if (currentProgram?.id === programId) {
             setCurrentProgram(updatedPrograms.length > 0 ? updatedPrograms[0] : null);
        }
        return true;
    }
    toast({ variant: 'destructive', title: 'Ошибка', description: result.error });
    return false;
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
