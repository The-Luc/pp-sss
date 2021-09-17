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
    },
    playInOrder: {
      type: Number,
      default: 1
    },
    playOutOrder: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isPlayInOrderDisabled: {
      type: Boolean,
      default: false
    },
    isPlayOutOrderDisabled: {
      type: Boolean,
      default: false
    },
    applyOptions: {
      type: Array,
      default: () => []
    },
    orderOptions: {
      type: Array,
      default: () => [{ name: 1, value: 1 }]
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
    applyPlayIn(storeType, config) {
      this.$emit('apply', { storeType, animationIn: config });
    },

    /**
     * Handle apply play out animation
     * @param {String} mode apply mode
     * @param {Object} config animation configuration
     */
    applyPlayOut(storeType, config) {
      this.$emit('apply', { storeType, animationOut: config });
    },

    onPlayInOrderChange(playInOrder) {
      this.$emit('changeOrder', { playInOrder });
    },

    onPlayOutOrderChange(playOutOrder) {
      this.$emit('changeOrder', { playOutOrder });
    }
  }
};
