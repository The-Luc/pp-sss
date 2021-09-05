export default {
  props: {
    firstName: {
      type: String,
      required: true
    },
    secondName: {
      type: String,
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
