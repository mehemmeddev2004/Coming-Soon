"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Sadə Product tipimiz (yalnız lazım olan hissələr)
type Product = {
  id: string;
  name: string;
  price: number | string;
  img?: string;
};

// CartItem tipi
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

// Context tipi
type CartContextType = {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

// Context yarat
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider komponent
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // LocalStorage-dan yüklə
  useEffect(() => {
    const saved = localStorage.getItem("cart_items");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  // LocalStorage-a saxla
  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(items));
  }, [items]);

  // Cart-a item əlavə et
  const addItem = (product: Product) => {
    const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;

    setItems((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price, quantity: 1, imageUrl: product.img }];
    });
  };

  // Cart-dan item sil
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Cart-i təmizlə
  const clear = () => setItems([]);

  // Ümumi count və total
  const count = items.reduce((acc, item) => acc + item.quantity, 0);
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, total, addItem, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
};

// Context-i istifadə etmək üçün hook
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};