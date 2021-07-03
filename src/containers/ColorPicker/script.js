import PickerPopup from './PickerPopup';

export default {
  components: { PickerPopup },
  props: {
    color: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: 'Color'
    }
  },
  data() {
    return {
      top: 0,
      left: 0,
      isOpen: false
    };
  },
  methods: {
    /**
     * Triggers open color picker at correct position
     */
    onOpen() {
      const { top, left, height } = this.$refs.boxColor.getBoundingClientRect();
      this.top = top + height / 2;
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
     * Emit event to start pick color
     */
    onOpenEyeDropper() {
      this.$root.$emit('printStartPickColor', color => {
        this.onChange(color);
      });
    }
  }
};
