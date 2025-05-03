import { UserBehaviorTracker } from "../src"

// Initialize the tracker
const tracker = new UserBehaviorTracker({
  debug: true,
  autoSuggest: true,
  minInteractions: 5,
  maxCollectionTime: 60000, // 1 minute
})

// Start tracking with a callback
tracker.start((result) => {
  console.log("User sentiment analysis:", result)

  if (result.sentiment === "frustrated" && result.score > 0.7) {
    // Show a help message or offer assistance
    showHelpMessage()
  } else if (result.sentiment === "confused" && result.score > 0.6) {
    // Show a tutorial or guide
    showGuidedTour()
  }
})

// Example function to show a help message
function showHelpMessage() {
  const helpDiv = document.createElement("div")
  helpDiv.style.position = "fixed"
  helpDiv.style.bottom = "20px"
  helpDiv.style.right = "20px"
  helpDiv.style.padding = "15px"
  helpDiv.style.backgroundColor = "#f8f9fa"
  helpDiv.style.border = "1px solid #dee2e6"
  helpDiv.style.borderRadius = "4px"
  helpDiv.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)"
  helpDiv.style.zIndex = "9999"

  helpDiv.innerHTML = `
    <h4 style="margin-top: 0;">Need help?</h4>
    <p>It seems you might be having trouble. Would you like assistance?</p>
    <button id="help-yes" style="margin-right: 10px; padding: 5px 10px;">Yes, please</button>
    <button id="help-no" style="padding: 5px 10px;">No, thanks</button>
  `

  document.body.appendChild(helpDiv)

  document.getElementById("help-yes")?.addEventListener("click", () => {
    // Show more detailed help
    helpDiv.innerHTML = `
      <h4 style="margin-top: 0;">How can we help?</h4>
      <ul>
        <li><a href="#">View tutorial</a></li>
        <li><a href="#">Contact support</a></li>
        <li><a href="#">Report an issue</a></li>
      </ul>
      <button id="help-close" style="padding: 5px 10px;">Close</button>
    `

    document.getElementById("help-close")?.addEventListener("click", () => {
      document.body.removeChild(helpDiv)
    })
  })

  document.getElementById("help-no")?.addEventListener("click", () => {
    document.body.removeChild(helpDiv)
  })
}

// Example function to show a guided tour
function showGuidedTour() {
  console.log("Showing guided tour...")
  // Implementation of a guided tour would go here
}

// Stop tracking when the user leaves the page
window.addEventListener("beforeunload", () => {
  tracker.stop()
})
