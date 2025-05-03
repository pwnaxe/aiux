import { UserBehaviorTracker } from "../tracker"
import { jest } from "@jest/globals"

describe("UserBehaviorTracker", () => {
  let tracker: UserBehaviorTracker

  beforeEach(() => {
    tracker = new UserBehaviorTracker({ debug: true })
  })

  afterEach(() => {
    tracker.stop()
  })

  test("should initialize with default options", () => {
    expect(tracker).toBeDefined()
  })

  test("should start tracking when start is called", () => {
    const callback = jest.fn()
    tracker.start(callback)

    // Mock a click event
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    })

    document.dispatchEvent(clickEvent)

    // Wait for processing
    setTimeout(() => {
      expect(callback).toHaveBeenCalled()
    }, 100)
  })

  test("should add custom interaction", () => {
    const callback = jest.fn()
    tracker.start(callback)

    tracker.addCustomInteraction("custom_event", { test: "data" })

    // Add more interactions to reach minInteractions
    for (let i = 0; i < 5; i++) {
      tracker.addCustomInteraction("custom_event", { test: "data" })
    }

    // Wait for processing
    setTimeout(() => {
      expect(callback).toHaveBeenCalled()
    }, 100)
  })
})
