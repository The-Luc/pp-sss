import { MOUSE_HOLD_DETECT_TIME } from '@/common/constants';

export default {
  props: {
    isForward: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      iconName: this.isForward ? 'fast_forward' : 'fast_rewind',
      isMouseHold: false,
      isLongPress: false
    };
  },
  methods: {
    /**
     * Fire when clicked
     */
    onClick() {
      this.isMouseHold = false;

      if (this.isLongPress) this.isLongPress = false;
      else this.$emit('click');
    },
    /**
     * Fire when mouse down
     */
    onMouseDown() {
      this.isMouseHold = true;

      setTimeout(() => {
        if (!this.isMouseHold) return;

        this.isLongPress = true;

        this.$emit('mouseDown');
      }, MOUSE_HOLD_DETECT_TIME);
    },
    /**
     * Fire when mouse up
     */
    onMouseUp() {
      if (this.isLongPress) this.$emit('mouseUp');
    }
  }
};
