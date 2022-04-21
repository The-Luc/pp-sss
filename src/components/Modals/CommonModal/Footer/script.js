export default {
  props: {
    cancelText: {
      type: String
    },
    acceptText: {
      type: String
    },
    isAcceptButtonDisabled: {
      type: Boolean
    },
    isCancelButtonDisplayed: {
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
