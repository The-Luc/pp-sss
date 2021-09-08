export default {
  props: {
    transitionIndex: {
      type: Number
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
