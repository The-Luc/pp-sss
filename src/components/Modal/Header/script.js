export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    showIconClose: {
      type: Boolean,
      default: false
    },
    themeModal: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onCloseModal() {
      this.$emit('onCloseModal');
    }
  }
};
