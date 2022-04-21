export default {
  mounted() {
    this.$emit('mounted', this.getAvailableSize());
    window.addEventListener('resize', this.onResized);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResized);
  },
  methods: {
    /**
     * Computed dimenssion of current wrapper
     * @returns {Object} { width, height, ratio}
     * @property {Number} width Width after subtract offset
     * @property {Number} height Height after subtract offset
     * @property {Number} ratio Ratio view base on width and height after computed
     */
    getAvailableSize() {
      const { clientWidth, clientHeight } = this.$refs.sizeWrapper;

      const offset = 0;
      const width = clientWidth - offset;
      const height = clientHeight - offset;

      return {
        width,
        height,
        ratio: width / height
      };
    },
    /**
     * Callback function emit size to parent
     */
    onResized() {
      this.$emit('updated', this.getAvailableSize());
    }
  }
};
