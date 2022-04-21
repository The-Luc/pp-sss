import TheTransition from './TheTransition';
import TheTransitionTarget from './TheTransitionTarget';
import TheTransitionApplication from './TheTransitionApplication';
import ThePreview from './ThePreview';
import TheDirection from './TheDirection';
import TheDuration from './TheDuration';

import { TRANSITION } from '@/common/constants';

export default {
  components: {
    TheTransition,
    TheTransitionTarget,
    TheTransitionApplication,
    ThePreview,
    TheDirection,
    TheDuration
  },
  props: {
    transitionIndex: {
      type: Number
    },
    transition: {
      type: Number
    },
    direction: {
      type: [Number, String]
    },
    duration: {
      type: [Number, String]
    },
    isSettingChanged: {
      type: Boolean
    }
  },
  data() {
    return {
      hasTarget: false
    };
  },
  computed: {
    isDirectionDisabled() {
      return (
        this.transition === TRANSITION.NONE ||
        this.transition === TRANSITION.DISSOLVE
      );
    },
    isDurationDisabled() {
      return this.transition === TRANSITION.NONE;
    }
  },
  watch: {
    isSettingChanged(newValue, oldValue) {
      if (newValue === oldValue || !newValue) return;

      this.hasTarget = false;
    }
  },
  methods: {
    /**
     * Emit change event to parent
     *
     * @param {Number}  transition  selected transition
     */
    onTransitionChange({ transition }) {
      this.$emit('transitionChange', { transition });
    },
    /**
     * Emit change event to parent
     *
     * @param {Number}  direction  selected direction
     */
    onDirectionChange({ direction }) {
      this.$emit('directionChange', { direction });
    },
    /**
     * Emit change event to parent
     *
     * @param {Number}  duration  selected duration
     */
    onDurationChange({ duration }) {
      this.$emit('durationChange', { duration });
    },
    /**
     * Emit change event to parent
     *
     * @param {Object}  target  selected target
     */
    onTargetChange({ target }) {
      this.$emit('targetChange', { target });

      this.hasTarget = true;
    },
    /**
     * Emit click event to parent
     */
    onTransitionApply() {
      this.$emit('transitionApply');
    }
  }
};
