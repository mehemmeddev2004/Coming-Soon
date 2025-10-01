"use client";

import React from "react";
import { useCart } from "@/providers/CartProvider";

const BagMenu = () => {
  const { items, total, removeItem, clear } = useCart();

  return (
    <div className="w-[360px] max-h-[420px] bg-white shadow-xl rounded-md z-50 p-4 border border-gray-100">
      <h3 className="text-sm text-center font-semibold mb-3">Your Cart</h3>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 space-y-4">
          <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full">
            <svg
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-gray-400"
            >
              <path
                d="M75.5556 17.7778V80H4.44444V17.7778H75.5556ZM71.1111 21.9259H8.88889V75.8519H71.1111V21.9259ZM40 0C50.7506 0 59.7182 7.63407 61.7775 17.7769L57.218 17.7789C55.2448 10.1106 48.2841 4.44444 40 4.44444C31.7159 4.44444 24.7552 10.1106 22.782 17.7789L18.2225 17.7769C20.2818 7.63407 29.2494 0 40 0Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="text-sm md:text-base font-medium">Your cart is empty.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="divide-y divide-gray-100 max-h-[260px] overflow-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <div className="text-sm font-semibold whitespace-nowrap">
                  {(item.price * item.quantity).toFixed(2)} AZN
                </div>
                <button
                  className="ml-2 text-xs text-gray-400 hover:text-red-600"
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-sm text-gray-600">Total</span>
            <span className="text-base font-semibold">{total.toFixed(2)} AZN</span>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={clear}
              className="flex-1 h-9 border text-sm rounded hover:bg-gray-50"
            >
              Clear
            </button>
            <a
              href="/Basket"
              className="flex-1 h-9 bg-black text-white text-sm rounded flex items-center justify-center hover:bg-gray-900"
            >
              View Cart
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default BagMenu;
