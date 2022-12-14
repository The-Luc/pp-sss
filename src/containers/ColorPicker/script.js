import PickerPopup from './PickerPopup';
import EyeDropper from './EyeDropper';

export default {
  components: { PickerPopup, EyeDropper },
  props: {
    color: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: 'Color'
    },
    showEyeDropper: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      top: 0,
      left: 0,
      isOpen: false,
      openEyeDropper: false,
      height: 0
    };
  },
  methods: {
    /**
     * Triggers open color picker at correct position
     */
    onOpen() {
      const { top, left, height } = this.$refs.boxColor.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const popupHeight = top + 195;
      if (popupHeight > windowHeight) {
        this.height = popupHeight - windowHeight;
        this.top = top + height / 2 - this.height;
      } else {
        this.height = 0;
        this.top = top + height / 2;
      }

      this.left = left;
      this.isOpen = true;
    },
    /**
     * Triggers close color picker
     */
    onClose() {
      this.isOpen = false;
    },
    /**
     * Handle color change
     */
    onChange(color) {
      this.$emit('change', color);
    },
    /**
     * Mutate to start pick color
     */
    onOpenEyeDropper() {
      this.openEyeDropper = true;
    },
    /**
     * Callback function catch event user click on overlay to pick color and mutate to stop eye dropper event
     */
    onEyeDropperOverlayClick(color) {
      this.onChange(color);
      this.closeEyeDropper();
    },
    /**
     * Close eye dropper actions
     */
    closeEyeDropper() {
      this.openEyeDropper = false;
    }
  }
};
