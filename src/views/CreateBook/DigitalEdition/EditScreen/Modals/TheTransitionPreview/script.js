import ThePreview from '../ThePreview';

import TheContent from './TheContent';

import { isEmpty } from '@/common/utils';

import { TRANSITION } from '@/common/constants';

export default {
  components: {
    ThePreview,
    TheContent
  },
  props: {
    transition: {
      type: Number,
      required: true
    },
    direction: {
      type: [Number, String],
      required: true
    },
    duration: {
      type: [Number, String],
      default: ''
    },
    firstImageUrl: {
      type: String,
      required: true
    },
    secondImageUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      imageUrl: this.firstImageUrl,
      maskUrl: this.firstImageUrl,
      transitionCss: isEmpty(this.duration) ? '' : `all ${this.duration}s`,
      transitionType: `transition-${this.transition}-${this.getDirection()}`,
      imageKey: false,
      isWipeTransition: this.transition === TRANSITION.WIPE
    };
  },
  mounted() {
    setTimeout(() => {
      this.imageUrl = this.secondImageUrl;
      this.imageKey = !this.imageKey;

      const duration = this.transition === TRANSITION.NONE ? 0 : this.duration;

      setTimeout(this.onClose, (duration + 0.5) * 1000);
    }, 1000);
  },
  methods: {
    /**
     * Emit close event to parent
     */
    onClose() {
      this.$emit('close');
    },
    /**
     * Get direction
     *
     * @returns {String}  direction
     */
    getDirection() {
      return this.transition === TRANSITION.NONE ||
        this.transition === TRANSITION.DISSOLVE
        ? ''
        : this.direction;
    }
  }
};
