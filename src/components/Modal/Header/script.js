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
    showTopBg: {
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
