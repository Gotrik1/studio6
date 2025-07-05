'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { InventoryItem } from '@/entities/inventory/model/types';
import type { StoreItem } from '@/entities/store/model/types';
import { format } from 'date-fns';

interface InventoryContextType {
    items: InventoryItem[];
    addManualItem: (itemData: Omit<InventoryItem, 'id' | 'image' | 'imageHint'>) => void;
    addStoreItem: (item: StoreItem) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<InventoryItem[]>([]);

    const addManualItem = useCallback((itemData: Omit<InventoryItem, 'id' | 'image' | 'imageHint'>) => {
        const newItem: InventoryItem = {
            id: `item-${Date.now()}`,
            image: 'https://placehold.co/600x400.png',
            imageHint: 'new item',
            ...itemData,
        };
        setItems(prev => [newItem, ...prev]);
    }, []);

    const addStoreItem = useCallback((item: StoreItem) => {
         const newInventoryItem: InventoryItem = {
            id: `inv-item-${item.id}-${Date.now()}`,
            name: item.name,
            category: item.category as InventoryItem['category'], // Assuming categories match or need mapping
            type: item.name, // Use item name as type for simplicity
            purchaseDate: format(new Date(), 'yyyy-MM-dd'),
            lifespanMonths: 24, // Default lifespan for store items
            image: item.image || 'https://placehold.co/600x400.png',
            imageHint: item.imageHint || 'store item',
        };
        setItems(prev => [newInventoryItem, ...prev]);
    }, []);

    const value = { items, addManualItem, addStoreItem };

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
