export default {
  props: {
    layout: {
      type: Object,
      default: () => ({})
    },
    selectedLayoutId: {
      type: Number,
      default: 0
    }
  },
  methods: {
    /**
     * Emit layout selected to parent
     */
    onClick() {
      this.$emit('click', this.layout);
    }
  }
};
