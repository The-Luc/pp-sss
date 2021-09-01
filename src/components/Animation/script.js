import { EVENT_TYPE } from '@/common/constants';
import Control from './Control';

export default {
  components: {
    Control
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    playInConfig: {
      type: Object,
      default: () => ({})
    },
    playOutConfig: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    changePlayIn(val) {
      this.$emit('change', { animationIn: val });
    },

    changePlayOut(val) {
      this.$emit('change', { animationOut: val });
    },
    /**
     * Emit animation event to root componenet
     * @param {Object} config configuration for animation
     */
    onPreview(config) {
      this.$root.$emit(EVENT_TYPE.PREVIEW_ANIMATION, config);
    }
  }
};
