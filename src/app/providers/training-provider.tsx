
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { TrainingProgram } from '@/shared/lib/mock-data/training-programs';
import { trainingPrograms } from '@/shared/lib/mock-data/training-programs';

interface TrainingContextType {
  currentProgram: TrainingProgram | null;
  selectProgram: (program: TrainingProgram) => void;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

const defaultProgram = trainingPrograms.find(p => p.id === 'classic-split-3') || null;

export const TrainingProvider = ({ children }: { children: ReactNode }) => {
  const [currentProgram, setCurrentProgram] = useState<TrainingProgram | null>(defaultProgram);

  const selectProgram = (program: TrainingProgram) => {
    setCurrentProgram(program);
  };

  return (
    <TrainingContext.Provider value={{ currentProgram, selectProgram }}>
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
