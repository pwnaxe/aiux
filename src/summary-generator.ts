import type { UserInteraction } from "../types"

export function generateSummary(interactions: UserInteraction[], startTime: number): string {
  if (interactions.length === 0) {
    return "No user interactions recorded."
  }

  const duration = Math.round((Date.now() - startTime) / 1000)
  const clickCount = interactions.filter((i) => i.type === "click").length
  const scrollCount = interactions.filter((i) => i.type === "scroll").length
  const inputCount = interactions.filter((i) => i.type === "input").length
  const errorCount = interactions.filter((i) => i.type === "error").length

  // Group clicks by target
  const clickTargets = interactions
    .filter((i) => i.type === "click")
    .reduce(
      (acc, curr) => {
        const target = curr.target || "unknown"
        acc[target] = (acc[target] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

  // Get max scroll percentage
  const maxScroll = interactions
    .filter((i) => i.type === "scroll" && i.value)
    .reduce((max, curr) => {
      const percentage = Number.parseInt(curr.value?.replace("%", "") || "0")
      return Math.max(max, percentage)
    }, 0)

  // Check for rapid interactions (potential frustration indicator)
  const interactionTimes = interactions.map((i) => i.timestamp)
  let rapidInteractions = 0

  for (let i = 1; i < interactionTimes.length; i++) {
    if (interactionTimes[i] - interactionTimes[i - 1] < 300) {
      // Less than 300ms between interactions
      rapidInteractions++
    }
  }

  // Check for repeated clicks on the same element (potential frustration indicator)
  const repeatedClicks = Object.values(clickTargets).filter((count) => count > 2).length

  // Generate summary text
  let summary = `User session lasted ${duration} seconds with ${interactions.length} total interactions: `
  summary += `${clickCount} clicks, ${scrollCount} scroll events, ${inputCount} input events, and ${errorCount} errors. `

  if (clickCount > 0) {
    const clickTargetsList = Object.entries(clickTargets)
      .map(([target, count]) => `${target} (${count}x)`)
      .join(", ")

    summary += `User clicked on: ${clickTargetsList}. `
  }

  if (scrollCount > 0) {
    summary += `User scrolled to ${maxScroll}% of the page. `
  }

  if (rapidInteractions > 3) {
    summary += `User had ${rapidInteractions} rapid interactions, which may indicate frustration. `
  }

  if (repeatedClicks > 0) {
    summary += `User repeatedly clicked on ${repeatedClicks} element(s), which may indicate frustration or confusion. `
  }

  if (errorCount > 0) {
    summary += `User encountered ${errorCount} errors, which may have affected their experience. `
  }

  // Analyze the interaction pattern
  const firstInteraction = interactions[0]
  const lastInteraction = interactions[interactions.length - 1]

  if (firstInteraction && lastInteraction) {
    const sessionDuration = lastInteraction.timestamp - firstInteraction.timestamp

    if (sessionDuration < 10000 && interactions.length > 5) {
      summary += "User had a short but intense interaction session. "
    } else if (sessionDuration > 60000) {
      summary += "User had a prolonged interaction session. "
    }
  }

  return summary
}
