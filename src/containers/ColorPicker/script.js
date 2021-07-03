import { uniqueId } from 'lodash';

import PickerPopup from './PickerPopup';
import EyeDropper from '@/components/EyeDropper';
import { useEyeDropper } from '@/hooks';

export default {
  setup() {
    const { toggleEyeDropper, eyeDropper } = useEyeDropper();
    return {
      toggleEyeDropper,
      eyeDropper
    };
  },
  components: { PickerPopup, EyeDropper },
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
      isOpen: false,
      eventName: `event-${uniqueId()}`
    };
  },
  mounted() {
    this.$root.$on(this.eventName, this.onChange);
  },
  beforeDestroy() {
    this.$root.$off(this.eventName, this.onChange);
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
     * Mutate to start pick color
     */
    onOpenEyeDropper() {
      this.toggleEyeDropper({ isOpen: true, eventName: this.eventName });
    }
  }
};
