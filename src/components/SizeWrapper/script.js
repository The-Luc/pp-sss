export default {
  computed: {},
  methods: {
    getAvailableSize() {
      const el = this.$refs.sizeWp;
      const elWidth = el.clientWidth;
      const elHeight = el.clientHeight;
      const avaiSize = {
        width: elWidth - 10,
        height: elHeight - 10,
        ratio: (elWidth - 10) / (elHeight - 10)
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
