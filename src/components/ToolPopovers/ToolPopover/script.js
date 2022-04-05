export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    actionText: {
      type: String,
      default: 'Select'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isFooterHidden: {
      type: Boolean,
      default: false
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
