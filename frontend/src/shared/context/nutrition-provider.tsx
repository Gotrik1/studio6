'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import type { FoodLogEntry, FoodItem } from '@/entities/nutrition/model/types';
import { useToast } from '@/shared/hooks/use-toast';
import { getFoodLog, addFoodLog as apiAddFoodLog, deleteFoodLog as apiDeleteFoodLog } from '@/entities/nutrition/api/nutrition';

interface NutritionTargets {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
}

interface NutritionContextType {
  log: FoodLogEntry[];
  isLoading: boolean;
  addFoodLog: (item: FoodItem, grams: number, meal: FoodLogEntry['meal']) => Promise<void>;
  deleteFoodLog: (id: string) => Promise<void>;
  totals: NutritionTargets;
  targets: NutritionTargets;
  setTargets: (targets: NutritionTargets) => void;
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

const defaultTargets: NutritionTargets = {
    calories: 2500,
    protein: 180,
    fat: 70,
    carbs: 300,
};

function transformRawLog(rawLog: any[]): FoodLogEntry[] {
    return rawLog.map(entry => {
        const ratio = entry.grams / 100;
        return {
            id: entry.id,
            meal: entry.meal,
            name: entry.foodItem.name,
            grams: entry.grams,
            calories: Math.round(entry.foodItem.calories * ratio),
            protein: Math.round(entry.foodItem.protein * ratio),
            fat: Math.round(entry.foodItem.fat * ratio),
            carbs: Math.round(entry.foodItem.carbs * ratio),
        };
    });
}

export const NutritionProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [log, setLog] = useState<FoodLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [targets, setTargets] = useState<NutritionTargets>(defaultTargets);

  const fetchLog = useCallback(async () => {
    setIsLoading(true);
    try {
        const rawLog = await getFoodLog();
        setLog(transformRawLog(rawLog));
    } catch (error) {
        toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить дневник питания.' });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchLog();
  }, [fetchLog]);

  const addFoodLog = async (item: FoodItem, grams: number, meal: FoodLogEntry['meal']) => {
    const result = await apiAddFoodLog({ foodItemId: item.id, grams, meal });
    if (result.success) {
      await fetchLog(); // Refetch data
    } else {
      toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось добавить запись.' });
    }
  };

  const deleteFoodLog = async (id: string) => {
    const result = await apiDeleteFoodLog(id);
    if (result.success) {
      await fetchLog(); // Refetch data
    } else {
      toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось удалить запись.' });
    }
  };
  
  const totals = useMemo(() => {
    return log.reduce((acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        fat: acc.fat + item.fat,
        carbs: acc.carbs + item.carbs,
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 });
  }, [log]);

  const value = { log, isLoading, addFoodLog, deleteFoodLog, totals, targets, setTargets };

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
