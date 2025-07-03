'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import type { StoreItem } from '@/shared/lib/mock-data/store';

export type CartItem = StoreItem & {
    quantity: number;
};

interface CartContextType {
    items: CartItem[];
    addItem: (item: StoreItem, quantity?: number) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    totalPricePD: number;
    totalPriceReal: number;
    totalItems: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addItem = (item: StoreItem, quantity = 1) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id);
            if (existingItem) {
                return prevItems.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
                );
            }
            return [...prevItems, { ...item, quantity }];
        });
    };

    const removeItem = (itemId: string) => {
        setItems(prevItems => prevItems.filter(i => i.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(itemId);
        } else {
            setItems(prevItems =>
                prevItems.map(i => (i.id === itemId ? { ...i, quantity } : i))
            );
        }
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = useMemo(() => {
        return items.reduce((total, item) => total + item.quantity, 0);
    }, [items]);
    
    const totalPricePD = useMemo(() => {
        return items.filter(i => !i.isRealMoney).reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [items]);
    
    const totalPriceReal = useMemo(() => {
        return items.filter(i => i.isRealMoney).reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [items]);

    const value = {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPricePD,
        totalPriceReal,
        isCartOpen,
        setIsCartOpen,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
