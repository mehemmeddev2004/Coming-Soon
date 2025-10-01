"use client";

import React from "react";
import { useCart } from "@/providers/CartProvider";

type Props = {
  id: string;
  name: string;
  price: number | string;
  imageUrl?: string;
  className?: string;
  children?: React.ReactNode;
};

const AddToCartButton: React.FC<Props> = ({ id, name, price, imageUrl, className, children }) => {
  const { addItem } = useCart();

  const onClick = () => {
    addItem({ id, name, price, img: imageUrl });
  };

  return (
    <button onClick={onClick} className={className} type="button">
      {children ?? <span>Add to Cart</span>}
    </button>
  );
};

export default AddToCartButton;
