
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { TrainingProgram } from '@/entities/training-program/model/types';
import { trainingPrograms as initialTrainingPrograms } from '@/shared/lib/mock-data/training-programs';

interface TrainingContextType {
  programs: TrainingProgram[];
  currentProgram: TrainingProgram | null;
  selectProgram: (program: TrainingProgram) => void;
  addProgram: (program: TrainingProgram) => void;
  updateProgram: (program: TrainingProgram) => void;
  deleteProgram: (programId: string) => void;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

const defaultProgram = initialTrainingPrograms.find(p => p.id === 'classic-split-3') || null;

export const TrainingProvider = ({ children }: { children: ReactNode }) => {
  const [programs, setPrograms] = useState<TrainingProgram[]>(initialTrainingPrograms);
  const [currentProgram, setCurrentProgram] = useState<TrainingProgram | null>(defaultProgram);

  const selectProgram = (program: TrainingProgram) => {
    setCurrentProgram(program);
  };

  const addProgram = (program: TrainingProgram) => {
    setPrograms(prev => [program, ...prev]);
  };
  
  const updateProgram = (updatedProgram: TrainingProgram) => {
    setPrograms(prev => prev.map(p => p.id === updatedProgram.id ? updatedProgram : p));
    if (currentProgram?.id === updatedProgram.id) {
        setCurrentProgram(updatedProgram);
    }
  };
  
  const deleteProgram = (programId: string) => {
    setPrograms(prev => prev.filter(p => p.id !== programId));
    if (currentProgram?.id === programId) {
        setCurrentProgram(null);
    }
  };

  return (
    <TrainingContext.Provider value={{ programs, currentProgram, selectProgram, addProgram, updateProgram, deleteProgram }}>
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
