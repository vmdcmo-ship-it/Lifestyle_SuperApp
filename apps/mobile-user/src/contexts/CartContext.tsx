import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Cart Item Types ──────────────────────────────────────────────────────────

export type CartItemType = 'food' | 'product' | 'service' | 'reward';

export interface CartItem {
  id: string;
  type: CartItemType;
  merchantId?: string;
  merchantName?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  note?: string;
  // Food specific
  menuItemId?: string;
  // Product specific
  productId?: string;
  unit?: string;
  // Service specific
  serviceDate?: string;
  serviceTime?: string;
}

export interface CartMerchant {
  merchantId: string;
  merchantName: string;
  type: CartItemType;
  items: CartItem[];
  subtotal: number;
  deliveryFee?: number;
  minOrder?: number;
}

// ─── Cart Context ─────────────────────────────────────────────────────────────

interface CartContextType {
  items: CartItem[];
  merchants: CartMerchant[];
  totalItems: number;
  totalAmount: number;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateNote: (itemId: string, note: string) => void;
  clearCart: () => void;
  clearMerchant: (merchantId: string) => void;
  getItemQuantity: (itemId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = '@lifestyle_cart';

// ─── Cart Provider ────────────────────────────────────────────────────────────

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from storage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    saveCart();
  }, [items]);

  const loadCart = async () => {
    try {
      const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  // ─── Computed Values ────────────────────────────────────────────────────────

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Group items by merchant
  const merchants: CartMerchant[] = items.reduce((acc, item) => {
    if (!item.merchantId) return acc;

    const existing = acc.find((m) => m.merchantId === item.merchantId);
    if (existing) {
      existing.items.push(item);
      existing.subtotal += item.price * item.quantity;
    } else {
      acc.push({
        merchantId: item.merchantId,
        merchantName: item.merchantName || 'Unknown',
        type: item.type,
        items: [item],
        subtotal: item.price * item.quantity,
      });
    }
    return acc;
  }, [] as CartMerchant[]);

  // ─── Actions ────────────────────────────────────────────────────────────────

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      // Check if item already exists
      const existingIndex = prev.findIndex((item) => item.id === newItem.id);

      if (existingIndex >= 0) {
        // Update quantity
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity,
        };
        return updated;
      } else {
        // Add new item
        return [...prev, newItem];
      }
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const updateNote = (itemId: string, note: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, note } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const clearMerchant = (merchantId: string) => {
    setItems((prev) => prev.filter((item) => item.merchantId !== merchantId));
  };

  const getItemQuantity = (itemId: string): number => {
    const item = items.find((i) => i.id === itemId);
    return item?.quantity || 0;
  };

  // ─── Context Value ──────────────────────────────────────────────────────────

  const value: CartContextType = {
    items,
    merchants,
    totalItems,
    totalAmount,
    addItem,
    removeItem,
    updateQuantity,
    updateNote,
    clearCart,
    clearMerchant,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// ─── useCart Hook ─────────────────────────────────────────────────────────────

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

export const formatCartItemId = (type: CartItemType, id: string, merchantId?: string): string => {
  return `${type}_${merchantId || 'none'}_${id}`;
};

export const createFoodCartItem = (params: {
  menuItemId: string;
  name: string;
  price: number;
  merchantId: string;
  merchantName: string;
  image?: string;
  quantity?: number;
}): CartItem => ({
  id: formatCartItemId('food', params.menuItemId, params.merchantId),
  type: 'food',
  merchantId: params.merchantId,
  merchantName: params.merchantName,
  menuItemId: params.menuItemId,
  name: params.name,
  price: params.price,
  quantity: params.quantity || 1,
  image: params.image,
});

export const createProductCartItem = (params: {
  productId: string;
  name: string;
  price: number;
  merchantId: string;
  merchantName: string;
  image?: string;
  unit?: string;
  quantity?: number;
}): CartItem => ({
  id: formatCartItemId('product', params.productId, params.merchantId),
  type: 'product',
  merchantId: params.merchantId,
  merchantName: params.merchantName,
  productId: params.productId,
  name: params.name,
  price: params.price,
  quantity: params.quantity || 1,
  image: params.image,
  unit: params.unit,
});
