import type { UserBehaviorOptions, UserInteraction, TrackerCallback } from "../types"
import { generateSummary } from "../summary-generator"
import { classifyText } from "./classifier"

export class UserBehaviorTracker {
  private options: Required<UserBehaviorOptions>
  private interactions: UserInteraction[] = []
  private startTime: number
  private timeoutId: number | null = null
  private callback: TrackerCallback | null = null
  private isSupported = false

  constructor(options: UserBehaviorOptions = {}) {
    this.options = {
      debug: options.debug ?? false,
      autoSuggest: options.autoSuggest ?? false,
      minInteractions: options.minInteractions ?? 5,
      maxCollectionTime: options.maxCollectionTime ?? 30000, // 30 seconds
      promptTemplate: options.promptTemplate ?? "Analyze this user behavior and classify the sentiment: {{summary}}",
    }

    this.startTime = Date.now()
    this.checkSupport()
  }

  private async checkSupport(): Promise<void> {
    try {
      // Check if TextClassifier API is available
      this.isSupported =
        "textClassifier" in navigator && typeof (navigator as any).textClassifier?.classify === "function"

      if (this.options.debug) {
        console.log(`TextClassifier API ${this.isSupported ? "is" : "is not"} supported`)
      }
    } catch (error) {
      this.isSupported = false
      if (this.options.debug) {
        console.error("Error checking TextClassifier support:", error)
      }
    }
  }

  public start(callback: TrackerCallback): void {
    if (!this.isSupported) {
      console.warn(
        "TextClassifier API is not supported in this browser. SDK will collect data but classification will not work.",
      )
    }

    this.callback = callback
    this.attachEventListeners()

    // Set timeout for max collection time
    this.timeoutId = window.setTimeout(() => {
      this.processInteractions()
    }, this.options.maxCollectionTime)

    if (this.options.debug) {
      console.log("UserBehaviorTracker started")
    }
  }

  public stop(): void {
    this.detachEventListeners()

    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId)
      this.timeoutId = null
    }

    if (this.options.debug) {
      console.log("UserBehaviorTracker stopped")
    }
  }

  private attachEventListeners(): void {
    // Click events
    document.addEventListener("click", this.handleClick)

    // Scroll events
    window.addEventListener("scroll", this.handleScroll)

    // Input events
    document.addEventListener("input", this.handleInput)

    // Error events
    window.addEventListener("error", this.handleError)
  }

  private detachEventListeners(): void {
    document.removeEventListener("click", this.handleClick)
    window.removeEventListener("scroll", this.handleScroll)
    document.removeEventListener("input", this.handleInput)
    window.removeEventListener("error", this.handleError)
  }

  private handleClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement
    const targetInfo = this.getElementInfo(target)

    this.recordInteraction({
      type: "click",
      target: targetInfo,
      timestamp: Date.now(),
      metadata: {
        x: event.clientX,
        y: event.clientY,
        path: this.getElementPath(target),
      },
    })
  }

  private handleScroll = (): void => {
    // Throttle scroll events
    if (!this.lastScrollTime || Date.now() - this.lastScrollTime > 1000) {
      this.lastScrollTime = Date.now()

      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
      )

      this.recordInteraction({
        type: "scroll",
        value: `${scrollPercentage}%`,
        timestamp: Date.now(),
        metadata: {
          scrollY: window.scrollY,
          viewportHeight: window.innerHeight,
          documentHeight: document.documentElement.scrollHeight,
        },
      })
    }
  }
  private lastScrollTime: number | null = null

  private handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement
    const targetInfo = this.getElementInfo(target)

    // Don't record actual input values for privacy, just the fact that input occurred
    this.recordInteraction({
      type: "input",
      target: targetInfo,
      timestamp: Date.now(),
      metadata: {
        inputType: target.type || "text",
        hasValue: !!target.value,
        path: this.getElementPath(target),
      },
    })
  }

  private handleError = (event: ErrorEvent): void => {
    this.recordInteraction({
      type: "error",
      value: event.message,
      timestamp: Date.now(),
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    })
  }

  private getElementInfo(element: HTMLElement): string {
    // Try to get the most descriptive identifier for the element
    const id = element.id ? `#${element.id}` : ""
    const classes =
      element.className && typeof element.className === "string" ? `.${element.className.split(" ").join(".")}` : ""
    const tagName = element.tagName.toLowerCase()
    const text = element.textContent?.trim().substring(0, 20)

    return (
      id ||
      (element.getAttribute("data-testid") ? `[data-testid="${element.getAttribute("data-testid")}"]` : "") ||
      (text ? `${tagName}:contains("${text}")` : tagName + classes)
    )
  }

  private getElementPath(element: HTMLElement, maxDepth = 3): string {
    const path = []
    let current: HTMLElement | null = element
    let depth = 0

    while (current && depth < maxDepth) {
      path.unshift(this.getElementInfo(current))
      current = current.parentElement
      depth++
    }

    return path.join(" > ")
  }

  private recordInteraction(interaction: UserInteraction): void {
    this.interactions.push(interaction)

    if (this.options.debug) {
      console.log("Recorded interaction:", interaction)
    }

    // Check if we've reached the minimum number of interactions
    if (this.interactions.length >= this.options.minInteractions) {
      this.processInteractions()
    }
  }

  private async processInteractions(): void {
    if (this.interactions.length === 0) return

    // Generate summary text
    const summary = generateSummary(this.interactions, this.startTime)

    if (this.options.debug) {
      console.log("Generated summary:", summary)
    }

    // Only attempt classification if the API is supported
    if (this.isSupported) {
      try {
        // Apply prompt template
        const prompt = this.options.promptTemplate.replace("{{summary}}", summary)

        // Classify the text
        const result = await classifyText(prompt)

        if (this.callback) {
          this.callback(result)
        }

        if (this.options.debug) {
          console.log("Classification result:", result)
        }

        if (this.options.autoSuggest && result.score > 0.7 && result.sentiment === "frustrated") {
          console.warn("User appears frustrated. Consider improving the UX in this area.")
        }
      } catch (error) {
        if (this.options.debug) {
          console.error("Classification error:", error)
        }
      }
    } else if (this.callback) {
      // If not supported, return a default result
      this.callback({
        sentiment: "unknown",
        score: 0,
        rawResponse: { error: "TextClassifier API not supported" },
      })
    }

    // Reset interactions
    this.interactions = []
    this.startTime = Date.now()

    // Reset timeout
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId)
      this.timeoutId = window.setTimeout(() => {
        this.processInteractions()
      }, this.options.maxCollectionTime)
    }
  }

  public addCustomInteraction(type: string, data: any): void {
    this.recordInteraction({
      type: type as any,
      value: JSON.stringify(data),
      timestamp: Date.now(),
      metadata: { custom: true, data },
    })
  }
}
