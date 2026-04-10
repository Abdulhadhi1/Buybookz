"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartContextType {
  cartCount: number;
  refreshCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        const count = data.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);
      }
    } catch (err) {
      console.error("Failed to refresh cart count", err);
    }
  };

  useEffect(() => {
    refreshCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount }}>
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
