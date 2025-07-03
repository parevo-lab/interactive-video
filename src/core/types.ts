export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  triggerTime: number;
  question: string;
  options: QuizOption[];
  rewindTime: number;
}

export interface InteractiveVideoConfig {
  questions: QuizQuestion[];
}

export interface InteractiveVideoOptions {
  src: string;
  config: InteractiveVideoConfig;
  width?: number;
  height?: number;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
  onQuestionAnswered?: (questionId: string, selectedOptionId: string, isCorrect: boolean) => void;
  onVideoEnd?: () => void;
  onError?: (error: Error) => void;
}

export interface InteractiveVideoInstance {
  play(): void;
  pause(): void;
  currentTime(): number;
  currentTime(time: number): void;
  destroy(): void;
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
}