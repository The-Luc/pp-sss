export default {
  props: {
    totalPortrait: {
      type: Number,
      default: 0
    },
    totalPages: {
      type: Number,
      default: 0
    },
    containerName: {
      type: String
    }
  },
  methods: {
    /**
     * Open Preview modal
     */
    onShowPreview() {
      this.$emit('showPreview');
    }
  }
};
