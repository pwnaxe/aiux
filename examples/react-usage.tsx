"use client"

import { useEffect } from "react"
import { useUserBehaviorTracker } from "../src"

function UserBehaviorAnalytics() {
  const { result, isTracking, start, stop, addCustomInteraction } = useUserBehaviorTracker({
    debug: true,
    autoSuggest: true,
    // Start manually instead of automatically
    autoStart: false,
    // Custom prompt template
    promptTemplate: `
      Analyze this user behavior in detail:
      {{summary}}
      
      Classify the sentiment as precisely as possible.
    `,
  })

  // Start tracking when component mounts
  useEffect(() => {
    start()

    // Stop tracking when component unmounts
    return () => {
      stop()
    }
  }, [start, stop])

  // Log the result whenever it changes
  useEffect(() => {
    if (result) {
      console.log("User sentiment analysis:", result)

      // Example: Show help for frustrated users
      if (result.sentiment === "frustrated" && result.score > 0.7) {
        showHelpUI()
      }
    }
  }, [result])

  // Example function to track form submissions
  const handleFormSubmit = (formData: any) => {
    // Track the form submission as a custom interaction
    addCustomInteraction("form_submission", {
      formId: "contact",
      formData,
      timestamp: new Date().toISOString(),
    })

    // Process form submission normally
    submitForm(formData)
  }

  // Example function to show help UI
  const showHelpUI = () => {
    // Implementation of help UI
    console.log("Showing help UI for frustrated user")
  }

  // Example function to submit a form
  const submitForm = (data: any) => {
    // Implementation of form submission
    console.log("Submitting form:", data)
  }

  return (
    <div>
      <h1>User Behavior Analytics Example</h1>

      {/* Display current tracking status */}
      <div>Tracking Status: {isTracking ? "Active" : "Inactive"}</div>

      {/* Display current sentiment if available */}
      {result && (
        <div>
          Current Sentiment: {result.sentiment} (Score: {result.score.toFixed(2)})
        </div>
      )}

      {/* Example form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const data = Object.fromEntries(formData.entries())
          handleFormSubmit(data)
        }}
      >
        <input type="text" name="name" placeholder="Your name" />
        <input type="email" name="email" placeholder="Your email" />
        <textarea name="message" placeholder="Your message"></textarea>
        <button type="submit">Submit</button>
      </form>

      {/* Controls for tracking */}
      <div>
        <button onClick={start} disabled={isTracking}>
          Start Tracking
        </button>
        <button onClick={stop} disabled={!isTracking}>
          Stop Tracking
        </button>
      </div>
    </div>
  )
}

export default UserBehaviorAnalytics
