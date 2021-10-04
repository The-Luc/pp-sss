import TheHeader from './TheHeader';
import TheDetail from './TheDetail';

import { Transition } from '@/common/models';

import { useActionDigitalSheet } from '@/hooks';

import {
  TRANSITION,
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
    sectionId: {
      type: [Number, String],
      required: true
    },
    isHeaderDisplayed: {
      type: Boolean,
      default: true
    },
    isExpandDefault: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { applyTransition } = useActionDigitalSheet();

    return { applyTransition };
  },
  data() {
    return {
      isExpand: this.isExpandDefault,
      currentTransition: this.transition,
      currentDirection: this.direction,
      currentDuration: this.duration,
      isSettingChanged: false,
      transitionTarget: TRANS_TARGET_DEFAULT.value
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
    },
    isSettingChanged(newValue, oldValue) {
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

      if (
        transition !== TRANSITION.NONE &&
        transition !== TRANSITION.DISSOLVE
      ) {
        this.currentDirection = TRANS_DIRECTION_DEFAULT.value;
      }

      if (transition !== TRANSITION.NONE) {
        this.currentDuration = TRANS_DURATION_DEFAULT;
      }

      this.setChange();
    },
    /**
     * Change direction
     *
     * @param {Number}  direction  selected direction
     */
    onDirectionChange({ direction }) {
      this.currentDirection = direction;

      this.setChange();
    },
    /**
     * Change duration
     *
     * @param {Number}  duration  selected duration
     */
    onDurationChange({ duration }) {
      this.currentDuration = duration;

      this.setChange();
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
        this.sectionId,
        this.transitionIndex
      );

      this.isSettingChanged = false;

      this.triggerAfterSettingChange();
    },
    /**
     * Set change value
     */
    setChange() {
      const isTransitionChanged = this.currentTransition !== this.transition;
      const isDirectionChanged = this.currentDirection !== this.direction;
      const isDurationChanged = this.currentDuration !== this.duration;

      this.isSettingChanged =
        isTransitionChanged || isDirectionChanged || isDurationChanged;

      this.triggerAfterSettingChange();
    },
    /**
     * Fire after setting change
     */
    triggerAfterSettingChange() {
      this.$emit('settingChange', { isChanged: this.isSettingChanged });
    }
  }
};
