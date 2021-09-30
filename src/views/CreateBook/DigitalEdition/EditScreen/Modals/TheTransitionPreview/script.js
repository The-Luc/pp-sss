import ThePreview from '../ThePreview';

import TheContent from './TheContent';

import { isEmpty } from '@/common/utils';

import { TRANSITION, TRANS_DIRECTION } from '@/common/constants';

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
    },
    canvasSize: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      imageUrl: this.firstImageUrl,
      maskUrl: this.firstImageUrl,
      backgroundPosition: this.getPosition(),
      transitionCss: isEmpty(this.duration) ? '' : `all ${this.duration}s`,
      transitionType: `transition-${this.transition}-${this.direction}`,
      imageKey: false,
      isWipeTransition: this.transition === TRANSITION.WIPE
    };
  },
  mounted() {
    setTimeout(() => {
      this.imageUrl = this.secondImageUrl;
      this.imageKey = !this.imageKey;

      setTimeout(this.onClose, (this.duration + 0.5) * 1000);
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
     * Get background position
     *
     * @returns {String}  position of background
     */
    getPosition() {
      if (this.transition !== TRANSITION.WIPE) return 'center';

      const direction = {
        [TRANS_DIRECTION.TOP_BOTTOM]: 'bottom',
        [TRANS_DIRECTION.BOTTOM_TOP]: 'top',
        [TRANS_DIRECTION.LEFT_RIGHT]: 'right',
        [TRANS_DIRECTION.RIGHT_LEFT]: 'left'
      };

      return direction[this.direction];
    }
  }
};
