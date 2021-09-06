export default {
  props: {
    firstFrame: {
      type: Number,
      required: true
    },
    secondFrame: {
      type: Number,
      required: true
    },
    isExpand: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    /**
     * Emit toggle expand to parent
     */
    onToggleExpand() {
      this.$emit('toggleExpand');
    }
  }
};
