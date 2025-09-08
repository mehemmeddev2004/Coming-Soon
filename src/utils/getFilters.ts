// utils/getFilters.ts
import { Product } from "@/types/product";

export const getFiltersFromProducts = (products: Product[]) => {
  const brands = Array.from(new Set(products.map((p) => p.brand)));
  const colors = Array.from(
    new Set(products.flatMap((p) => p.colors))
  );
  const sizes = Array.from(
    new Set(products.flatMap((p) => p.sizes))
  );

  return [
    { name: "brand", label: "Marka", options: brands },
    { name: "color", label: "Rəng", options: colors },
    { name: "size", label: "Ölçü", options: sizes },
  ];
};
