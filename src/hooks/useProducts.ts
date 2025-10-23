import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/utils/fetchProducts";
import type { Product } from "@/types/product";

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000, // 5 dəqiqə cache
    gcTime: 10 * 60 * 1000, // 10 dəqiqə garbage collection
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
