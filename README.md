# @parevo/interactive-video

Framework-agnostic interactive video library with quiz overlays for React, Vue, and vanilla JavaScript.

## Features

🎥 **HTML5 Video Based**: Lightweight, no external video library dependencies  
🎯 **Interactive Quizzes**: Automatic pause and quiz overlay at predefined times  
🔄 **Smart Rewind**: Wrong answers rewind to specified timestamps  
🚀 **Framework Agnostic**: Works with React, Vue, and vanilla JavaScript  
📱 **Universal Compatibility**: SSR-safe, works in all modern environments  
🎨 **Customizable**: Minimal styling, easy to customize  
📊 **Event Tracking**: Comprehensive event system for progress monitoring  

## Installation

```bash
npm install @parevo/interactive-video
```

## Usage Examples

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
    <script type="module">
        import { InteractiveVideo } from '@parevo/interactive-video';
        
        const config = {
            questions: [
                {
                    id: 'q1',
                    triggerTime: 30, // Pause at 30 seconds
                    question: 'What is the main topic?',
                    options: [
                        { id: 'a', text: 'Option A', isCorrect: true },
                        { id: 'b', text: 'Option B', isCorrect: false }
                    ],
                    rewindTime: 15 // Rewind to 15 seconds if wrong
                }
            ]
        };

        const player = new InteractiveVideo('#video-container', {
            src: '/path/to/video.mp4',
            config: config,
            width: 800,
            height: 450,
            onQuestionAnswered: (questionId, optionId, isCorrect) => {
                console.log(`Question ${questionId}: ${isCorrect ? 'Correct' : 'Wrong'}`);
            }
        });
    </script>
</head>
<body>
    <div id="video-container"></div>
</body>
</html>
```

### React

```tsx
import { InteractiveVideo } from '@parevo/interactive-video/react';

function App() {
    const config = {
        questions: [
            {
                id: 'q1',
                triggerTime: 30,
                question: 'What is the main topic?',
                options: [
                    { id: 'a', text: 'Option A', isCorrect: true },
                    { id: 'b', text: 'Option B', isCorrect: false }
                ],
                rewindTime: 15
            }
        ]
    };

    return (
        <InteractiveVideo
            src="/path/to/video.mp4"
            config={config}
            width={800}
            height={450}
            onQuestionAnswered={(questionId, optionId, isCorrect) => {
                console.log(`Question ${questionId}: ${isCorrect ? 'Correct' : 'Wrong'}`);
            }}
        />
    );
}
```

### Vue 3

```vue
<template>
    <InteractiveVideo
        :src="videoSrc"
        :config="config"
        :width="800"
        :height="450"
        @question-answered="handleAnswer"
    />
</template>

<script setup>
import { InteractiveVideo } from '@parevo/interactive-video/vue';

const videoSrc = '/path/to/video.mp4';
const config = {
    questions: [
        {
            id: 'q1',
            triggerTime: 30,
            question: 'What is the main topic?',
            options: [
                { id: 'a', text: 'Option A', isCorrect: true },
                { id: 'b', text: 'Option B', isCorrect: false }
            ],
            rewindTime: 15
        }
    ]
};

const handleAnswer = (data) => {
    console.log(`Question ${data.questionId}: ${data.isCorrect ? 'Correct' : 'Wrong'}`);
};
</script>
```

### Next.js

```tsx
import dynamic from 'next/dynamic';

const InteractiveVideo = dynamic(
    () => import('@parevo/interactive-video/react').then(mod => mod.InteractiveVideo),
    { ssr: false }
);

export default function VideoPage() {
    // ... same as React example
}
```

## API Reference

### Core Options

```typescript
interface InteractiveVideoOptions {
    src: string;                    // Video source URL
    config: InteractiveVideoConfig; // Quiz configuration
    width?: number;                 // Video width (default: 640)
    height?: number;                // Video height (default: 360)
    autoplay?: boolean;             // Auto play video (default: false)
    muted?: boolean;                // Mute video (default: false)
    controls?: boolean;             // Show video controls (default: true)
    className?: string;             // CSS class name
    onQuestionAnswered?: Function;  // Question answered callback
    onVideoEnd?: Function;          // Video ended callback
    onError?: Function;             // Error callback
}
```

### Quiz Configuration

```typescript
interface InteractiveVideoConfig {
    questions: QuizQuestion[];
}

interface QuizQuestion {
    id: string;                     // Unique question ID
    triggerTime: number;            // When to show question (seconds)
    question: string;               // Question text
    options: QuizOption[];          // Answer options
    rewindTime: number;             // Where to rewind on wrong answer (seconds)
}

interface QuizOption {
    id: string;                     // Unique option ID
    text: string;                   // Option text
    isCorrect: boolean;             // Whether this is the correct answer
}
```

### Instance Methods (Vanilla JS)

```typescript
const player = new InteractiveVideo(container, options);

player.play();                     // Play video
player.pause();                    // Pause video
player.currentTime();              // Get current time
player.currentTime(30);            // Set current time to 30 seconds
player.destroy();                  // Clean up and remove

// Event listeners
player.on('questionAnswered', (data) => { /* ... */ });
player.on('videoEnd', () => { /* ... */ });
player.off('questionAnswered', callback);
```

## Development & Testing

### Setup

```bash
git clone <repository-url>
cd interactive-video
npm install
npm run build
```

### Test with React (Vite)

```bash
npm run dev-server
# Open http://localhost:3000
```

### Test with Vanilla JS

```bash
# Serve the examples/vanilla-demo.html file
# Make sure to build first: npm run build
```

## Package Structure

```
@parevo/interactive-video/
├── core        # Vanilla JS core library
├── react       # React wrapper
└── vue         # Vue wrapper
```

## Import Paths

```javascript
// Core library (vanilla JS)
import { InteractiveVideo } from '@parevo/interactive-video';
import { InteractiveVideo } from '@parevo/interactive-video/core';

// React wrapper
import { InteractiveVideo } from '@parevo/interactive-video/react';

// Vue wrapper
import { InteractiveVideo } from '@parevo/interactive-video/vue';
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Use Cases

- **Training Videos**: Corporate training with comprehension checks
- **Educational Content**: E-learning courses with interactive elements
- **Compliance Training**: Ensure understanding before progression
- **Product Demos**: Interactive product walkthroughs

## Styling

The component uses minimal CSS classes that you can customize:

```css
.interactive-video-quiz-overlay { /* Overlay background */ }
.quiz-content { /* Quiz content box */ }
.quiz-question { /* Question text */ }
.quiz-options { /* Options container */ }
.quiz-option { /* Individual option button */ }
```

## Events

### Vanilla JS Events

```javascript
player.on('questionAnswered', ({ questionId, optionId, isCorrect }) => {
    // Handle question answer
});

player.on('videoEnd', () => {
    // Handle video end
});

player.on('error', (error) => {
    // Handle errors
});
```

### React Props

```tsx
<InteractiveVideo
    onQuestionAnswered={(questionId, optionId, isCorrect) => {}}
    onVideoEnd={() => {}}
    onError={(error) => {}}
/>
```

### Vue Events

```vue
<InteractiveVideo
    @question-answered="handleAnswer"
    @video-end="handleEnd"
    @error="handleError"
/>
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request