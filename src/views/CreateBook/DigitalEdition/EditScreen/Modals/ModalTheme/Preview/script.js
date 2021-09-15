export default {
  props: {
    layouts: {
      type: Array,
      require: true
    },
    themeName: {
      type: String,
      default: ''
    }
  },
  methods: {
    /**
     * Set preview theme's id empty and emit
     */
    onClosePreview() {
      this.$emit('onClosePreview');
    }
  }
};
