'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import type { FoodLogEntry } from '@/entities/nutrition/model/types';
import type { FoodItem } from '@/entities/nutrition/model/types';

interface NutritionTargets {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
}

interface NutritionContextType {
  log: FoodLogEntry[];
  addFoodLog: (item: FoodItem, grams: number, meal: FoodLogEntry['meal']) => void;
  deleteFoodLog: (id: string) => void;
  totals: NutritionTargets;
  targets: NutritionTargets;
  setTargets: (targets: NutritionTargets) => void;
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

// Default targets for a user before they generate a plan
const defaultTargets: NutritionTargets = {
    calories: 2500,
    protein: 180,
    fat: 70,
    carbs: 300,
};


export const NutritionProvider = ({ children }: { children: ReactNode }) => {
  const [log, setLog] = useState<FoodLogEntry[]>([]); // Initial log is empty, would be fetched
  const [targets, setTargets] = useState<NutritionTargets>(defaultTargets);

  const addFoodLog = (item: FoodItem, grams: number, meal: FoodLogEntry['meal']) => {
    const ratio = grams / 100; // Assuming base stats are per 100g
    const newEntry: FoodLogEntry = {
      id: `food-${Date.now()}`,
      meal,
      name: item.name,
      grams,
      calories: Math.round(item.calories * ratio),
      protein: Math.round(item.protein * ratio),
      fat: Math.round(item.fat * ratio),
      carbs: Math.round(item.carbs * ratio),
    };
    setLog(prevLog => [newEntry, ...prevLog]);
  };

  const deleteFoodLog = (id: string) => {
    setLog(prevLog => prevLog.filter(entry => entry.id !== id));
  };
  
  const totals = useMemo(() => {
    return log.reduce((acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        fat: acc.fat + item.fat,
        carbs: acc.carbs + item.carbs,
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 });
  }, [log]);

  const value = { log, addFoodLog, deleteFoodLog, totals, targets, setTargets };

  return (
    <NutritionContext.Provider value={value}>
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (context === undefined) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};
