import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllSeasons, getSeasonsByProduct, createSeason, deleteSeason } from '@/utils/fetchSeasons'
import { fetchCategories, deleteCategory, createCategory } from '@/utils/fetchCategories'
import { Season, CreateSeasonData } from '@/types/season'

// Query keys for cache management
export const queryKeys = {
  seasons: {
    all: ['seasons'] as const,
    byProduct: (productId: number) => ['seasons', 'product', productId] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
}

// Seasons hooks with caching
export const useSeasons = () => {
  return useQuery({
    queryKey: queryKeys.seasons.all,
    queryFn: getAllSeasons,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export const useSeasonsByProduct = (productId: number) => {
  return useQuery({
    queryKey: queryKeys.seasons.byProduct(productId),
    queryFn: () => getSeasonsByProduct(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  })
}

export const useCreateSeason = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ productId, seasonData }: { productId: number; seasonData: CreateSeasonData }) =>
      createSeason(productId, seasonData),
    onSuccess: (data: Season | null, variables: { productId: number; seasonData: CreateSeasonData }) => {
      // Invalidate and refetch seasons
      queryClient.invalidateQueries({ queryKey: queryKeys.seasons.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.seasons.byProduct(variables.productId) })
    },
    retry: 2,
  })
}

export const useDeleteSeason = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (seasonId: string | number) => deleteSeason(seasonId),
    onSuccess: () => {
      // Invalidate all seasons queries
      queryClient.invalidateQueries({ queryKey: queryKeys.seasons.all })
      queryClient.invalidateQueries({ 
        predicate: (query: any) => query.queryKey[0] === 'seasons' 
      })
    },
    retry: 1,
  })
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
