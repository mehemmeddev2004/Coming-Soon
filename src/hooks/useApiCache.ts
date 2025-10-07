import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCategories, deleteCategory, createCategory } from '@/utils/fetchCategories'

// Query keys for cache management
export const queryKeys = {
  categories: {
    all: ['categories'] as const,
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
