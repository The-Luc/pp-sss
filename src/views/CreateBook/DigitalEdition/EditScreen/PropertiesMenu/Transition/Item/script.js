import TheHeader from './TheHeader';
import TheDetail from './TheDetail';

import { Transition } from '@/common/models';

import { useActionDigitalSheet } from '@/hooks';

import {
  TRANSITION_DEFAULT,
  TRANS_DIRECTION_DEFAULT,
  TRANS_DURATION_DEFAULT,
  TRANS_TARGET,
  TRANS_TARGET_DEFAULT
} from '@/common/constants';

export default {
  components: {
    TheHeader,
    TheDetail
  },
  props: {
    transitionIndex: {
      type: Number,
      required: true
    },
    transition: {
      type: Number,
      default: TRANSITION_DEFAULT.value
    },
    direction: {
      type: [Number, String],
      default: TRANS_DIRECTION_DEFAULT.value
    },
    duration: {
      type: [Number, String],
      default: TRANS_DURATION_DEFAULT
    },
    sheetId: {
      type: [Number, String],
      required: true
    },
    isHeaderDisplayed: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const { applyTransition } = useActionDigitalSheet();

    return { applyTransition };
  },
  data() {
    return {
      isExpand: false,
      currentTransition: this.transition,
      currentDirection: this.direction,
      currentDuration: this.duration,
      isTransitionChanged: false,
      transitionTarget: TRANS_TARGET_DEFAULT.value
    };
  },
  watch: {
    transition(value) {
      this.currentTransition = value;

      this.onTransitionChange({ transition: value });
    },
    direction(value) {
      this.currentDirection = value;
    },
    duration(value) {
      this.currentDuration = value;
    },
    isTransitionChanged(newValue, oldValue) {
      if (newValue === oldValue || !newValue) return;

      this.onTargetChange({ target: TRANS_TARGET_DEFAULT.value });
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
      this.transitionTarget = target;
    },
    /**
     * Apply transition
     */
    async onTransitionApply() {
      if (this.transitionTarget === TRANS_TARGET.NONE) return;

      const transition = new Transition({
        transition: this.currentTransition,
        direction: this.currentDirection,
        duration: this.currentDuration
      });

      await this.applyTransition(
        transition,
        this.transitionTarget,
        this.sheetId,
        this.transitionIndex
      );
    }
  }
};
