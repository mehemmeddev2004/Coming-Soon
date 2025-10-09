import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCategories, deleteCategory, createCategory } from '@/utils/fetchCategories'
import { getProducts, getProductById, createProduct } from '@/utils/fetchProducts'

// Query keys for cache management
export const queryKeys = {
  categories: {
    all: ['categories'] as const,
  },
  products: {
    all: ['products'] as const,
    byId: (id: string | number) => ['products', id] as const,
  },
}


// Categories hooks with caching
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes (categories change less frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string | number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
    },
    retry: 1,
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (categoryData: any) => createCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
    },
    retry: 2,
  })
}

// Products hooks with caching
export const useProducts = () => {
  return useQuery({
    queryKey: queryKeys.products.all,
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes (products change more frequently)
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export const useProduct = (id: string | number) => {
  return useQuery({
    queryKey: queryKeys.products.byId(id),
    queryFn: () => getProductById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!id, // Only run if id is provided
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (productData: any) => createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
    retry: 2,
  })
}
