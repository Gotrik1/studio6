
'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import type { FoodLogEntry } from '@/shared/lib/mock-data/nutrition-diary';
import { nutritionDiaryData } from '@/shared/lib/mock-data/nutrition-diary';
import type { FoodItem } from '@/shared/lib/mock-data/nutrition';

interface NutritionContextType {
  log: FoodLogEntry[];
  addFoodLog: (item: FoodItem, grams: number, meal: FoodLogEntry['meal']) => void;
  deleteFoodLog: (id: string) => void;
  totals: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const NutritionProvider = ({ children }: { children: ReactNode }) => {
  const [log, setLog] = useState<FoodLogEntry[]>(nutritionDiaryData);

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

  const value = { log, addFoodLog, deleteFoodLog, totals };

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
