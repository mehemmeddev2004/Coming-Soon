"use client"
import React from 'react';

export interface PriceFilterProps {
  minPrice: number | "";
  maxPrice: number | "";
  onChangeMin: (val: number | "") => void;
  onChangeMax: (val: number | "") => void;
  onApply: () => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  minPrice,
  maxPrice,
  onChangeMin,
  onChangeMax,
  onApply,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex gap-3 items-center">
        <div className="flex-1">
          <label className="block text-xs text-gray-600 mb-1">Min Price</label>
          <input
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={(e) => {
              const v = e.target.value;
              onChangeMin(v === '' ? '' : Number(v));
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none "
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-600 mb-1">Max Price</label>
          <input
            type="number"
            placeholder="1000"
            value={maxPrice}
            onChange={(e) => {
              const v = e.target.value;
              onChangeMax(v === '' ? '' : Number(v));
            }}
            className="w-full border border-gray-300 outline-none rounded-lg px-3 py-2 text-sm "
          />
        </div>
      </div>
      <button
        onClick={onApply}
        className="w-full bg-black text-white py-2 px-4 rounded-lg text-sm font-medium"
      >
        Apply Price Filter
      </button>
    </div>
  );
};

export default PriceFilter;
