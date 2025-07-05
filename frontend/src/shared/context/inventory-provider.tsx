'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import type { InventoryItem } from '@/entities/inventory/model/types';
import type { StoreItem } from '@/entities/store/model/types';
import { format } from 'date-fns';
import { createInventoryItem, deleteInventoryItem, getInventory } from '@/entities/inventory/api/inventory';
import { useToast } from '@/shared/hooks/use-toast';

interface InventoryContextType {
    items: InventoryItem[];
    isLoading: boolean;
    addManualItem: (itemData: Omit<InventoryItem, 'id' | 'image' | 'imageHint' | 'purchaseDate'> & { purchaseDate: Date }) => Promise<void>;
    addStoreItem: (item: StoreItem) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
    const { toast } = useToast();
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const loadInventory = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getInventory();
            setItems(data);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить инвентарь.' });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);
    
    useEffect(() => {
        loadInventory();
    }, [loadInventory]);
    
    const addManualItem = useCallback(async (itemData: Omit<InventoryItem, 'id' | 'image' | 'imageHint' | 'purchaseDate'> & { purchaseDate: Date }) => {
        const newItemData = {
            ...itemData,
            purchaseDate: format(itemData.purchaseDate, 'yyyy-MM-dd'),
            image: 'https://placehold.co/600x400.png',
            imageHint: 'new item',
        };
        const result = await createInventoryItem(newItemData);
        if (result.success) {
            await loadInventory();
        } else {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось добавить предмет.' });
        }
    }, [loadInventory, toast]);

    const addStoreItem = useCallback(async (item: StoreItem) => {
         const newInventoryItemData = {
            name: item.name,
            category: item.category as InventoryItem['category'],
            type: item.name,
            purchaseDate: format(new Date(), 'yyyy-MM-dd'),
            lifespanMonths: 24,
            image: item.image || 'https://placehold.co/600x400.png',
            imageHint: item.imageHint || 'store item',
        };
        const result = await createInventoryItem(newInventoryItemData);
        if (result.success) {
             await loadInventory();
        } else {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось добавить предмет из магазина.' });
        }
    }, [loadInventory, toast]);

    const deleteItem = useCallback(async (id: string) => {
        const result = await deleteInventoryItem(id);
        if (result.success) {
            await loadInventory();
            toast({ title: 'Предмет удален' });
        } else {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось удалить предмет.' });
        }
    }, [loadInventory, toast]);

    const value = { items, isLoading, addManualItem, addStoreItem, deleteItem };

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (context === undefined) {
        throw new Error('useInventory must be used within a InventoryProvider');
    }
    return context;
};
