export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    onCloseModal() {
      this.$emit('onCloseModal');
    }
  }
};
