import TheHeader from './TheHeader';

import TheDetail from './TheDetail';
import {
  TRANSITION_DEFAULT,
  TRANS_DIRECTION_DEFAULT,
  TRANS_DURATION_DEFAULT
} from '@/common/constants';

export default {
  components: {
    TheHeader,
    TheDetail
  },
  props: {
    firstFrame: {
      type: Number,
      required: true
    },
    secondFrame: {
      type: Number,
      required: true
    },
    transition: {
      type: Number,
      default: TRANSITION_DEFAULT.value
    },
    direction: {
      type: Number,
      default: TRANS_DIRECTION_DEFAULT.value
    },
    duration: {
      type: Number,
      default: TRANS_DURATION_DEFAULT
    },
    isHeaderDisplayed: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isExpand: true,
      currentTransition: this.transition,
      currentDirection: this.direction,
      currentDuration: this.duration,
      isTransitionChanged: false
    };
  },
  watch: {
    transition(value) {
      this.currentTransition = value;
    },
    direction(value) {
      this.currentDirection = value;
    },
    duration(value) {
      this.currentDuration = value;
    }
  },
  methods: {
    /**
     * Toggle expand detail
     */
    onToggleExpand() {
      this.isExpand = !this.isExpand;
    },
    /**
     * Change transition
     *
     * @param {Number}  transition  selected transition
     */
    onTransitionChange({ transition }) {
      this.currentTransition = transition;

      this.isTransitionChanged = this.currentTransition !== this.transition;

      this.$emit('transitionChange', { isChanged: this.isTransitionChanged });
    },
    /**
     * Change direction
     *
     * @param {Number}  direction  selected direction
     */
    onDirectionChange({ direction }) {
      this.currentDirection = direction;
    },
    /**
     * Change duration
     *
     * @param {Number}  duration  selected duration
     */
    onDurationChange({ duration }) {
      this.currentDuration = duration;
    },
    /**
     * Change transtition target
     *
     * @param {Object}  target  selected target
     */
    onTargetChange({ target }) {
      target; // TODO
    },
    /**
     * Emit click event to parent
     */
    onTransitionApply() {
      // TODO
    }
  }
};
