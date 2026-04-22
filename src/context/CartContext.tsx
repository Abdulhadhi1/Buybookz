"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartContextType {
  cartCount: number;
  refreshCartCount: () => Promise<void>;
  addToCart: (book: any, quantity: number, language?: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  const getGuestCart = () => {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('guestCart');
    return cart ? JSON.parse(cart) : [];
  };

  const refreshCartCount = async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        const count = data.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);
      } else {
        // Guest mode
        const guestCart = getGuestCart();
        const count = guestCart.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);
      }
    } catch (err) {
      const guestCart = getGuestCart();
      const count = guestCart.reduce((acc: number, item: any) => acc + item.quantity, 0);
      setCartCount(count);
    }
  };

  const addToCart = async (book: any, quantity: number, language?: string) => {
     try {
       const res = await fetch("/api/cart", {
         method: "POST",
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ bookId: book.id, quantity, language }),
       });
       
       if (res.status === 401) {
         // Handle guest cart
         const guestCart = getGuestCart();
         const existingIndex = guestCart.findIndex((item: any) => item.bookId === book.id && item.language === language);
         
         if (existingIndex > -1) {
           guestCart[existingIndex].quantity += quantity;
         } else {
           guestCart.push({ 
              id: `guest-${Date.now()}`, 
              bookId: book.id, 
              book: book, 
              quantity, 
              language 
           });
         }
         
         localStorage.setItem('guestCart', JSON.stringify(guestCart));
         await refreshCartCount();
       } else if (res.ok) {
         await refreshCartCount();
       }
     } catch (err) {
       console.error("Add to cart failed", err);
     }
  };

  useEffect(() => {
    refreshCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount, addToCart }}>
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
