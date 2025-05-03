# @aiux/tracker

A TypeScript SDK for tracking and analyzing user behavior on websites using Chrome's Built-in AI TextClassifier API.

---

## Features

* 📊 Tracks user interactions (clicks, scrolls, inputs, errors)
* 📝 Generates text summaries of user behavior
* 🧠 Uses Chrome's Built-in AI TextClassifier API for local analysis
* 🔄 Provides sentiment classification results (frustrated, satisfied, confused, etc.)
* 🔞 Debug mode for development
* 💡 Auto-suggest mode for UX improvement recommendations
* ⚛️ React hook for easy integration with React applications

---

## Installation

```bash
npm install @aiux/tracker
```

---

## Basic Usage

```typescript
import { UserBehaviorTracker } from '@aiux/tracker';

// Initialize the tracker
const tracker = new UserBehaviorTracker({
  debug: true,
  autoSuggest: true
});

// Start tracking with a callback
tracker.start((result) => {
  console.log('User sentiment analysis:', result);

  if (result.sentiment === 'frustrated' && result.score > 0.7) {
    // Show a help message or offer assistance
  }
});

// Stop tracking when needed
tracker.stop();
```

---

## React Hook

For React applications, you can use the provided hook:

```tsx
import { useUserBehaviorTracker } from '@aiux/tracker';

function MyComponent() {
  const { result, isTracking, start, stop, addCustomInteraction } = useUserBehaviorTracker({
    debug: true,
    autoSuggest: true,
    // Start automatically on component mount (default: true)
    autoStart: true
  });

  // The result will update whenever a new classification is available
  React.useEffect(() => {
    if (result) {
      console.log('User sentiment:', result.sentiment, 'Score:', result.score);

      if (result.sentiment === 'frustrated' && result.score > 0.7) {
        // Show help UI
      }
    }
  }, [result]);

  // Track custom events
  const handleImportantAction = () => {
    addCustomInteraction('important_action', {
      actionId: 'checkout',
      timestamp: Date.now()
    });

    // Rest of your code...
  };

  return (
    <div>
      {/* Your component JSX */}
      <button onClick={handleImportantAction}>Important Action</button>

      {/* Optional controls for tracking */}
      <div>
        <button onClick={start} disabled={isTracking}>Start Tracking</button>
        <button onClick={stop} disabled={!isTracking}>Stop Tracking</button>
      </div>
    </div>
  );
}
```

---

## Configuration Options

```typescript
const tracker = new UserBehaviorTracker({
  // Enable debug mode to log events to console
  debug: true,

  // Automatically suggest improvements based on user behavior
  autoSuggest: true,

  // Minimum number of interactions before triggering classification
  minInteractions: 5,

  // Maximum time (ms) to collect interactions before triggering classification
  maxCollectionTime: 30000, // 30 seconds

  // Custom prompt template for classification
  promptTemplate: 'Analyze this user behavior and classify the sentiment: {{summary}}'
});
```

---

## Browser Compatibility

This SDK relies on Chrome's Built-in AI TextClassifier API, which is currently available in:

* Chrome Dev/Canary with the appropriate flags enabled
* Future versions of Chrome (when the API becomes generally available)

The SDK will still collect user behavior data on unsupported browsers, but classification will not work.

---

## Custom Interactions

You can add custom interactions to the tracker:

```typescript
tracker.addCustomInteraction('form_submission', {
  formId: 'checkout',
  success: true,
  timeToComplete: 45000
});
```

---

## Publishing

If you're contributing to this package, you can publish it to npm using:

```bash
# First build the package
npm run build

# Then publish
npm publish --access public
```

---

## License

MIT
