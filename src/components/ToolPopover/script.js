export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    actionText: {
      type: String,
      default: 'Select'
    }
  },
  methods: {
    onCancel() {
      this.$emit('cancel');
    },
    onAction() {
      this.$emit('change');
    }
  }
};
