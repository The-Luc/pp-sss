export default {
  props: {
    layouts: {
      type: Array,
      require: true
    },
    themeName: {
      type: String,
      default: 'Confetti'
    }
  },
  methods: {
    onClosePreview() {
      this.$emit('onClosePreview');
    }
  },
  created() {
    console.log(this.layouts);
  }
};
