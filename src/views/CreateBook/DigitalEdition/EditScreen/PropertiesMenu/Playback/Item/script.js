export default {
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    frameId: {
      type: [String, Number],
      default: null
    }
  },
  methods: {
    /**
     * Emit click to parent
     */
    onClick() {
      this.$emit('click', { value: this.value, frameId: this.frameId });
    }
  }
};
