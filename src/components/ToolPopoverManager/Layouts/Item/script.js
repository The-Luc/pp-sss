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
    onClick() {
      this.$emit('click', this.layout);
    }
  }
};
