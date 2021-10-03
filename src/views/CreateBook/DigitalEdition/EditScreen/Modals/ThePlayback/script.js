import ThePreview from '../ThePreview';

export default {
  components: {
    ThePreview
  },
  props: {
    canvasSize: {
      type: Object,
      required: true
    },
    playbackData: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    setTimeout(() => {
      setTimeout(this.onClose, (2 + 0.5) * 1000); // temporary auto close
    }, 1000);
  },
  methods: {
    /**
     * Emit close event to parent
     */
    onClose() {
      this.$emit('close');
    }
  }
};
