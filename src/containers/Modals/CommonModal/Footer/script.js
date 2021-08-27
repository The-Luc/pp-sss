export default {
  props: {
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    acceptText: {
      type: String,
      default: 'Ok'
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
