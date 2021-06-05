export default {
  computed: {},
  methods: {
    getAvailableSize() {
      const el = this.$refs.sizeWp;
      const elWidth = el.clientWidth;
      const elHeight = el.clientHeight;
      const offset = 0;
      const avaiSize = {
        width: elWidth - offset,
        height: elHeight - offset,
        ratio: (elWidth - offset) / (elHeight - offset)
      };
      return avaiSize;
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
