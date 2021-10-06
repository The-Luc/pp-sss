import CommonModal from '@/components/Modals/CommonModal';

import { DIGITAL_CANVAS_SIZE } from '@/common/constants';

export default {
  components: {
    CommonModal
  },
  props: {
    canCloseOutside: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isVertical: false
    };
  },
  async mounted() {
    window.addEventListener('resize', this.onResized);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResized);
  },
  methods: {
    /**
     * Emit close event to parent
     */
    onClose() {
      this.$emit('close');
    },
    /**
     * Fire when resize
     */
    onResized() {
      const ratio = window.innerWidth / window.innerHeight;

      this.isVertical = ratio > DIGITAL_CANVAS_SIZE.RATIO;
    }
  }
};
