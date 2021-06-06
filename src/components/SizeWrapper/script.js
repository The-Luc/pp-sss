export default {
  computed: {},
  methods: {
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
    onResized() {
      this.$emit('updated', this.getAvailableSize());
    }
  },
  mounted() {
    this.$emit('mounted', this.getAvailableSize());
    window.addEventListener('resize', this.onResized);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResized);
  }
};
