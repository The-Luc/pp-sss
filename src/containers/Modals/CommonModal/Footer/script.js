export default {
  props: {
    cancelText: {
      type: String
    },
    acceptText: {
      type: String
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
