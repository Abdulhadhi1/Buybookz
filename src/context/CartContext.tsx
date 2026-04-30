"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  bookId: string;
  quantity: number;
  language?: string;
  book: {
    id: string;
    title: string;
    author: string;
    price: number;
    image?: string | null;
  };
}

interface CartContextType {
  cartCount: number;
  cartItems: CartItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  refreshCart: () => Promise<void>;
  addToCart: (book: any, quantity: number, language?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getGuestCart = () => {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('guestCart');
    return cart ? JSON.parse(cart) : [];
  };

  const refreshCart = async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
        const count = data.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);
      } else {
        const guestCart = getGuestCart();
        setCartItems(guestCart);
        const count = guestCart.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);
      }
    } catch (err) {
      const guestCart = getGuestCart();
      setCartItems(guestCart);
      const count = guestCart.reduce((acc: number, item: any) => acc + item.quantity, 0);
      setCartCount(count);
    }
  };

  const addToCart = async (book: any, quantity: number, language?: string) => {
     // Optimistic Update for instant feedback
     const newItem: CartItem = {
         id: `temp-${Date.now()}`,
         bookId: book.id,
         quantity,
         language,
         book: {
             id: book.id,
             title: book.title,
             author: book.author,
             price: book.price,
             image: book.image
         }
     };
     
     setCartItems(prev => {
         const existing = prev.find(i => i.bookId === book.id && i.language === language);
         if (existing) {
             return prev.map(i => i === existing ? { ...i, quantity: i.quantity + quantity } : i);
         }
         return [...prev, newItem];
     });
     setCartCount(prev => prev + quantity);
     setIsDrawerOpen(true);

     try {
       const res = await fetch("/api/cart", {
         method: "POST",
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ bookId: book.id, quantity, language }),
       });
       
       if (res.status === 401) {
         const guestCart = getGuestCart();
         const existingIndex = guestCart.findIndex((item: any) => item.bookId === book.id && item.language === language);
         
         if (existingIndex > -1) {
           guestCart[existingIndex].quantity += quantity;
         } else {
           guestCart.push(newItem);
         }
         localStorage.setItem('guestCart', JSON.stringify(guestCart));
       }
       await refreshCart(); // Sync with server after response
     } catch (err) {
       console.error("Add to cart failed", err);
       await refreshCart(); // Revert or sync on error
     }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
    
    try {
        await fetch(`/api/cart/${itemId}`, {
            method: "PATCH",
            body: JSON.stringify({ quantity })
        });
        await refreshCart();
    } catch (err) {
        console.error(err);
    }
  };

  const removeItem = async (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    try {
        await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
        await refreshCart();
    } catch (err) {
        console.error(err);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ 
        cartCount, 
        cartItems, 
        isDrawerOpen, 
        openDrawer: () => setIsDrawerOpen(true), 
        closeDrawer: () => setIsDrawerOpen(false), 
        refreshCart, 
        addToCart,
        updateQuantity,
        removeItem
    }}>
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
