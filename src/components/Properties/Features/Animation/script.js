import Control from './Control';
import {
  BLUR_DELAY_DURATION,
  DELAY_DURATION,
  PLAY_IN_STYLES,
  PLAY_OUT_STYLES,
  CONTROL_TYPE
} from '@/common/constants/animationProperty';

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
  data() {
    return {
      isDisabledPreview: false
    };
  },
  methods: {
    /**
     * Emit animation event to root componenet
     * @param {Object} config configuration for animation
     */
    onPreview(config) {
      const inactiveTime = this.totalAnimationDuration(config);
      this.isDisabledPreview = true;

      this.$emit('preview', config);

      setTimeout(() => {
        this.isDisabledPreview = false;
      }, inactiveTime);
    },

    /**
     * Calc total time to perform animation
     *
     * @param {Object} config animation config
     * @returns  total animation duration
     */
    totalAnimationDuration(config) {
      const STYLE =
        config.controlType === CONTROL_TYPE.PLAY_IN
          ? PLAY_IN_STYLES
          : PLAY_OUT_STYLES;

      const delayDuration =
        config.style === STYLE.BLUR ? BLUR_DELAY_DURATION : DELAY_DURATION;

      return delayDuration * 2 + config.duration;
    },

    /**
     * Handle apply play in animation
     * @param {String} mode apply mode
     * @param {Object} config animation configuration
     */
    applyPlayIn(mode, config) {
      this.$emit('apply', { mode, animationIn: config });
    },

    /**
     * Handle apply play out animation
     * @param {String} mode apply mode
     * @param {Object} config animation configuration
     */
    applyPlayOut(mode, config) {
      this.$emit('apply', { mode, animationOut: config });
    }
  }
};
