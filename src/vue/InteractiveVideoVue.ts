// @ts-nocheck
import { ref, onMounted, onUnmounted, watch, h } from 'vue';
import { InteractiveVideo } from '../core';

export default {
  name: 'InteractiveVideoVue',
  props: {
    src: {
      type: String,
      required: true
    },
    config: {
      type: Object,
      required: true
    },
    width: {
      type: Number,
      default: 640
    },
    height: {
      type: Number,
      default: 360
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    muted: {
      type: Boolean,
      default: false
    },
    controls: {
      type: Boolean,
      default: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  emits: ['questionAnswered', 'videoEnd', 'error'],
  setup(props, { emit }) {
    const containerRef = ref();
    const instanceRef = ref(null);

    const createInstance = () => {
      if (!containerRef.value) return;

      const options = {
        src: props.src,
        config: props.config,
        width: props.width,
        height: props.height,
        autoplay: props.autoplay,
        muted: props.muted,
        controls: props.controls,
        className: props.className,
        onQuestionAnswered: (questionId: string, selectedOptionId: string, isCorrect: boolean) => {
          emit('questionAnswered', { questionId, selectedOptionId, isCorrect });
        },
        onVideoEnd: () => {
          emit('videoEnd');
        },
        onError: (error: Error) => {
          emit('error', error);
        }
      };

      instanceRef.value = new InteractiveVideo(containerRef.value, options);
    };

    const destroyInstance = () => {
      if (instanceRef.value) {
        instanceRef.value.destroy();
        instanceRef.value = null;
      }
    };

    onMounted(() => {
      createInstance();
    });

    onUnmounted(() => {
      destroyInstance();
    });

    // Watch for prop changes and recreate instance
    watch(
      () => [props.src, props.config, props.width, props.height, props.autoplay, props.muted, props.controls],
      () => {
        destroyInstance();
        createInstance();
      },
      { deep: true }
    );

    // Expose instance methods
    const play = () => instanceRef.value?.play();
    const pause = () => instanceRef.value?.pause();
    const getCurrentTime = () => instanceRef.value?.currentTime();
    const setCurrentTime = (time: number) => instanceRef.value?.currentTime(time);

    return {
      containerRef,
      play,
      pause,
      getCurrentTime,
      setCurrentTime
    };
  },
  render() {
    return h('div', {
      ref: 'containerRef',
      class: this.className,
      style: {
        width: this.width + 'px',
        height: this.height + 'px'
      }
    });
  }
};