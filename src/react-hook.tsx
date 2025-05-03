"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { UserBehaviorTracker } from "./tracker"
import type { UserBehaviorOptions, ClassificationResult } from "./types"

export interface UseUserBehaviorTrackerOptions extends UserBehaviorOptions {
  /**
   * Whether to automatically start tracking on component mount
   * @default true
   */
  autoStart?: boolean
}

export interface UseUserBehaviorTrackerResult {
  /** The current classification result */
  result: ClassificationResult | null
  /** Whether the tracker is currently active */
  isTracking: boolean
  /** Start the behavior tracker */
  start: () => void
  /** Stop the behavior tracker */
  stop: () => void
  /** Add a custom interaction to the tracker */
  addCustomInteraction: (type: string, data: any) => void
}

/**
 * React hook for tracking user behavior with @aiux/tracker
 */
export function useUserBehaviorTracker(options: UseUserBehaviorTrackerOptions = {}): UseUserBehaviorTrackerResult {
  const { autoStart = true, ...trackerOptions } = options
  const trackerRef = useRef<UserBehaviorTracker | null>(null)
  const [result, setResult] = useState<ClassificationResult | null>(null)
  const [isTracking, setIsTracking] = useState(false)

  // Initialize the tracker on first render
  useEffect(() => {
    trackerRef.current = new UserBehaviorTracker(trackerOptions)

    return () => {
      // Clean up on unmount
      if (trackerRef.current && isTracking) {
        trackerRef.current.stop()
      }
    }
  }, []) // Empty dependency array ensures this only runs once

  // Start tracking if autoStart is true
  useEffect(() => {
    if (autoStart && trackerRef.current && !isTracking) {
      start()
    }
  }, [autoStart])

  // Start tracking function
  const start = useCallback(() => {
    if (!trackerRef.current) return

    trackerRef.current.start((classificationResult) => {
      setResult(classificationResult)
    })

    setIsTracking(true)
  }, [])

  // Stop tracking function
  const stop = useCallback(() => {
    if (!trackerRef.current) return

    trackerRef.current.stop()
    setIsTracking(false)
  }, [])

  // Add custom interaction function
  const addCustomInteraction = useCallback((type: string, data: any) => {
    if (!trackerRef.current) return

    trackerRef.current.addCustomInteraction(type, data)
  }, [])

  return {
    result,
    isTracking,
    start,
    stop,
    addCustomInteraction,
  }
}
