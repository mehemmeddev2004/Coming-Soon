import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  apiCallCount: number
  cacheHitRate: number
}

// Hook for monitoring component performance
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef<number>(Date.now())
  const apiCalls = useRef<number>(0)
  const cacheHits = useRef<number>(0)

  useEffect(() => {
    const loadTime = Date.now() - startTime.current
    console.log(`${componentName} loaded in ${loadTime}ms`)

    return () => {
      const totalTime = Date.now() - startTime.current
      const cacheHitRate = apiCalls.current > 0 ? (cacheHits.current / apiCalls.current) * 100 : 0
      
      console.log(`${componentName} Performance Metrics:`, {
        totalTime: `${totalTime}ms`,
        apiCalls: apiCalls.current,
        cacheHitRate: `${cacheHitRate.toFixed(1)}%`
      })
    }
  }, [componentName])

  const trackApiCall = (fromCache = false) => {
    apiCalls.current++
    if (fromCache) cacheHits.current++
  }

  return { trackApiCall }
}

// Hook for measuring API response times
export const useApiPerformance = () => {
  const measurements = useRef<Map<string, number>>(new Map())

  const startMeasurement = (key: string) => {
    measurements.current.set(key, Date.now())
  }

  const endMeasurement = (key: string) => {
    const startTime = measurements.current.get(key)
    if (startTime) {
      const duration = Date.now() - startTime
      console.log(`API ${key} took ${duration}ms`)
      measurements.current.delete(key)
      return duration
    }
    return 0
  }

  return { startMeasurement, endMeasurement }
}

// Hook for detecting slow renders
export const useRenderPerformance = (threshold = 16) => {
  const renderStart = useRef<number>(0)

  useEffect(() => {
    renderStart.current = performance.now()
  })

  useEffect(() => {
    const renderTime = performance.now() - renderStart.current
    if (renderTime > threshold) {
      console.warn(`Slow render detected: ${renderTime.toFixed(2)}ms (threshold: ${threshold}ms)`)
    }
  })
}
