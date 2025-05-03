export interface UserInteraction {
  type: "click" | "scroll" | "input" | "error"
  target?: string
  value?: string
  timestamp: number
  metadata?: Record<string, any>
}

export type SentimentType = "frustrated" | "satisfied" | "confused" | "engaged" | "disinterested" | "unknown"

export interface ClassificationResult {
  sentiment: SentimentType
  score: number
  rawResponse?: any
}

export type TrackerCallback = (result: ClassificationResult) => void

export interface UserBehaviorOptions {
  /** Enable debug mode to log events to console */
  debug?: boolean

  /** Automatically suggest improvements based on user behavior */
  autoSuggest?: boolean

  /** Minimum number of interactions before triggering classification */
  minInteractions?: number

  /** Maximum time (ms) to collect interactions before triggering classification */
  maxCollectionTime?: number

  /** Custom prompt template for classification */
  promptTemplate?: string
}

// React hook types
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
