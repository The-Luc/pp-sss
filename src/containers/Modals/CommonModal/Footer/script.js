export default {
  props: {
    cancelText: {
      type: String
    },
    acceptText: {
      type: String
    },
    isDisableAccept: {
      type: Boolean
    }
  },
  methods: {
    /**
     * Fire cancel event to parent
     */
    onCancel() {
      this.$emit('cancel');
    },
    /**
     * Fire accept event to parent
     */
    onAccept() {
      this.$emit('accept');
    }
  }
};
