import type { ClassificationResult } from "./types"

export async function classifyText(text: string): Promise<ClassificationResult> {
  try {
    // Access the Chrome TextClassifier API
    const textClassifier = (navigator as any).textClassifier

    if (!textClassifier) {
      throw new Error("TextClassifier API not available")
    }

    // Define classification options
    const options = {
      categories: [
        { name: "frustrated", description: "User is showing signs of frustration or annoyance" },
        { name: "satisfied", description: "User appears to be satisfied with their experience" },
        { name: "confused", description: "User seems confused or lost" },
        { name: "engaged", description: "User is actively engaged with the content" },
        { name: "disinterested", description: "User shows little interest in the content" },
      ],
    }

    // Classify the text
    const result = await textClassifier.classify(text, options)

    if (!result || !result.categories || result.categories.length === 0) {
      throw new Error("No classification results returned")
    }

    // Find the highest scoring category
    const topCategory = result.categories.reduce((prev, current) => (current.score > prev.score ? current : prev), {
      name: "unknown",
      score: 0,
    })

    return {
      sentiment: topCategory.name as any,
      score: topCategory.score,
      rawResponse: result,
    }
  } catch (error) {
    console.error("Classification error:", error)
    return {
      sentiment: "unknown",
      score: 0,
      rawResponse: { error: String(error) },
    }
  }
}
