"use client";

import React from "react";
import { useCart } from "@/providers/CartProvider";

type Props = {
  id: string;
  name: string;
  price: number | string;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
};

const AddToCartButton: React.FC<Props> = ({ 
  id, 
  name, 
  price, 
  className, 
  children,
  disabled = false 
}) => {
  const { addItem } = useCart();

  const onClick = () => {
    addItem({
      id,
      name,
      price: typeof price === "string" ? parseFloat(price) : price,
      quantity: 1
    });
  };

  return (
    <button 
      onClick={onClick} 
      className={className} 
      type="button"
      disabled={disabled}
    >
      {children ?? <span>Add to Cart</span>}
    </button>
  );
};

export default AddToCartButton;
