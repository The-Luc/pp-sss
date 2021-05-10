export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    showIconClose: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onCloseModal() {
      this.$emit('onCloseModal');
    }
  }
};
