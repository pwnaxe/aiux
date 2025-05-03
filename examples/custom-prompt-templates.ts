import { UserBehaviorTracker } from "../src"

// Example 1: Detailed sentiment analysis
const detailedSentimentTracker = new UserBehaviorTracker({
  promptTemplate: `
    Analyze the following user behavior and classify their sentiment:
    
    {{summary}}
    
    Consider the following aspects:
    1. Frustration level (high/medium/low)
    2. Engagement level (high/medium/low)
    3. Confusion level (high/medium/low)
    
    Classify as one of: frustrated, satisfied, confused, engaged, disinterested
  `,
})

// Example 2: UX improvement focus
const uxImprovementTracker = new UserBehaviorTracker({
  promptTemplate: `
    Review this user behavior and identify potential UX issues:
    
    {{summary}}
    
    Focus on:
    - Navigation problems
    - Form completion issues
    - Content comprehension
    - Technical errors
    
    Classify the overall sentiment as: frustrated, satisfied, confused, engaged, disinterested
  `,
})

// Example 3: Conversion optimization
const conversionTracker = new UserBehaviorTracker({
  promptTemplate: `
    Analyze this user behavior in terms of conversion potential:
    
    {{summary}}
    
    Consider:
    - Progress through conversion funnel
    - Hesitation points
    - Abandonment signals
    
    Classify the user's likelihood to convert as: frustrated (unlikely), satisfied (likely), 
    confused (needs help), engaged (very likely), disinterested (very unlikely)
  `,
})

// Example 4: Accessibility focus
const accessibilityTracker = new UserBehaviorTracker({
  promptTemplate: `
    Analyze this user behavior for potential accessibility issues:
    
    {{summary}}
    
    Look for patterns that might indicate:
    - Screen reader usage
    - Keyboard-only navigation
    - Motor control difficulties
    - Vision impairments
    
    Classify the user's experience as: frustrated (facing barriers), satisfied (no issues), 
    confused (minor difficulties), engaged (successful despite challenges), disinterested (gave up)
  `,
})

// Example 5: Technical issue detection
const technicalIssueTracker = new UserBehaviorTracker({
  promptTemplate: `
    Analyze this user behavior for signs of technical problems:
    
    {{summary}}
    
    Look for:
    - Error patterns
    - Repeated actions without progress
    - Unusual timing between interactions
    - Abandoned processes
    
    Classify the technical experience as: frustrated (facing technical issues), 
    satisfied (no technical issues), confused (minor technical hiccups), 
    engaged (working around issues), disinterested (abandoned due to technical problems)
  `,
})
