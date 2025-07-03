import { InteractiveVideoOptions, InteractiveVideoInstance, QuizQuestion } from './types';

export class InteractiveVideo implements InteractiveVideoInstance {
  private container: HTMLElement;
  private video!: HTMLVideoElement;
  private overlay!: HTMLElement;
  private options: InteractiveVideoOptions;
  private answeredQuestions = new Set<string>();
  private currentQuestion: QuizQuestion | null = null;
  private isQuizVisible = false;
  private eventHandlers = new Map<string, Function[]>();

  constructor(container: HTMLElement | string, options: InteractiveVideoOptions) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) as HTMLElement 
      : container;
    
    if (!this.container) {
      throw new Error('Container element not found');
    }

    this.options = {
      width: 640,
      height: 360,
      autoplay: false,
      muted: false,
      controls: true,
      className: '',
      ...options
    };

    this.init();
  }

  private init(): void {
    this.createVideoElement();
    this.createOverlay();
    this.setupEventListeners();
    this.applyStyles();
  }

  private createVideoElement(): void {
    this.video = document.createElement('video');
    this.video.src = this.options.src;
    this.video.width = this.options.width!;
    this.video.height = this.options.height!;
    this.video.controls = this.options.controls!;
    this.video.muted = this.options.muted!;
    this.video.autoplay = this.options.autoplay!;
    this.video.preload = 'metadata';
    
    // Video elementinin kaybolmaması için style
    this.video.style.display = 'block';
    this.video.style.width = '100%';
    this.video.style.height = '100%';
    
    if (this.options.className) {
      this.video.className = this.options.className;
    }

    this.container.appendChild(this.video);
  }

  private createOverlay(): void {
    this.overlay = document.createElement('div');
    this.overlay.className = 'interactive-video-quiz-overlay';
    this.overlay.style.display = 'none';
    this.container.appendChild(this.overlay);
  }

  private setupEventListeners(): void {
    this.video.addEventListener('timeupdate', this.handleTimeUpdate.bind(this));
    this.video.addEventListener('ended', this.handleVideoEnd.bind(this));
    this.video.addEventListener('error', this.handleError.bind(this));
  }

  private handleTimeUpdate(): void {
    const currentTime = this.video.currentTime;
    this.checkForQuestions(currentTime);
  }

  private checkForQuestions(currentTime: number): void {
    if (this.isQuizVisible) return;

    const triggerQuestion = this.options.config.questions.find(q => 
      !this.answeredQuestions.has(q.id) && 
      currentTime >= q.triggerTime && 
      currentTime < q.triggerTime + 1
    );

    if (triggerQuestion) {
      this.showQuiz(triggerQuestion);
    }
  }

  private showQuiz(question: QuizQuestion): void {
    this.currentQuestion = question;
    this.isQuizVisible = true;
    this.video.pause();
    
    this.overlay.innerHTML = `
      <div class="quiz-content">
        <h3 class="quiz-question">${question.question}</h3>
        <div class="quiz-options">
          ${question.options.map(option => `
            <button class="quiz-option" data-option-id="${option.id}">
              ${option.text}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    this.overlay.style.display = 'flex';

    // Option click handler - delegated event
    this.overlay.onclick = (event) => this.handleOptionClick(event);
  }

  private handleOptionClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('quiz-option')) return;

    const optionId = target.dataset.optionId!;
    this.handleAnswer(optionId);
  }

  private handleAnswer(optionId: string): void {
    if (!this.currentQuestion) return;

    const selectedOption = this.currentQuestion.options.find(opt => opt.id === optionId);
    if (!selectedOption) return;

    const isCorrect = selectedOption.isCorrect;
    const currentTime = this.video.currentTime;
    const questionData = this.currentQuestion; // Store before clearing
    
    
    // Sadece doğru cevap verildiğinde answered listesine ekle
    if (isCorrect) {
      this.answeredQuestions.add(questionData.id);
    }
    
    // Quiz'i hemen gizle
    this.hideQuiz();
    
    // Callback
    this.options.onQuestionAnswered?.(questionData.id, optionId, isCorrect);
    this.emit('questionAnswered', { questionId: questionData.id, optionId, isCorrect });

    // Video control
    if (isCorrect) {
      this.video.play();
    } else {
      // Video'yu pause et
      this.video.pause();
      
      // Rewind işlemi
      const rewindTo = questionData.rewindTime;
      this.video.currentTime = rewindTo;
      
      // Video'yu tekrar başlat
      setTimeout(() => {
        this.video.play().catch(error => {
          console.warn('Video play failed:', error);
        });
      }, 50);
    }

    this.currentQuestion = null;
  }

  private hideQuiz(): void {
    this.isQuizVisible = false;
    this.overlay.style.display = 'none';
    this.overlay.innerHTML = ''; // Sadece overlay içeriğini temizle
    this.overlay.onclick = null; // Click handler'ı temizle
    
    // Video elementinin DOM'da olup olmadığını kontrol et ve gerekirse geri ekle
    if (!document.contains(this.video)) {
      this.container.appendChild(this.video);
    }
  }

  private handleVideoEnd(): void {
    this.options.onVideoEnd?.();
    this.emit('videoEnd');
  }

  private handleError(event: Event): void {
    const error = new Error('Video playback error');
    this.options.onError?.(error);
    this.emit('error', error);
  }

  private applyStyles(): void {
    // Container styles
    this.container.style.position = 'relative';
    this.container.style.display = 'inline-block';
    this.container.style.overflow = 'hidden';

    // Default overlay styles
    const style = document.createElement('style');
    style.textContent = `
      .interactive-video-quiz-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .quiz-content {
        background-color: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 80%;
        max-height: 80%;
        overflow-y: auto;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .quiz-question {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: #333;
        line-height: 1.4;
      }

      .quiz-options {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .quiz-option {
        padding: 0.75rem 1rem;
        background-color: #f8f9fa;
        border: 2px solid #e9ecef;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s ease;
        text-align: left;
      }

      .quiz-option:hover {
        background-color: #007bff;
        border-color: #007bff;
        color: white;
      }

      .quiz-option:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
      }
    `;

    if (!document.querySelector('#interactive-video-styles')) {
      style.id = 'interactive-video-styles';
      document.head.appendChild(style);
    }
  }

  // Public API methods
  public play(): void {
    this.video.play();
  }

  public pause(): void {
    this.video.pause();
  }

  public currentTime(): number;
  public currentTime(time: number): void;
  public currentTime(time?: number): number | void {
    if (time !== undefined) {
      this.video.currentTime = time;
    } else {
      return this.video.currentTime;
    }
  }

  public destroy(): void {
    this.video.removeEventListener('timeupdate', this.handleTimeUpdate.bind(this));
    this.video.removeEventListener('ended', this.handleVideoEnd.bind(this));
    this.video.removeEventListener('error', this.handleError.bind(this));
    
    this.container.removeChild(this.video);
    this.container.removeChild(this.overlay);
    
    this.eventHandlers.clear();
  }

  public on(event: string, callback: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(callback);
  }

  public off(event: string, callback: Function): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(callback);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
}