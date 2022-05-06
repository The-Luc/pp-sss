export default {
  props: {
    images: {
      type: Array,
      default: () => []
    },
    isDigital: {
      type: Boolean,
      default: false
    },
    isSingleLayout: {
      type: Boolean,
      default: false
    },
    idOfActiveImage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      componentKey: 0
    };
  },
  watch: {
    images: {
      deep: true,
      immediate: true,
      handler() {
        // to force component to rerender
        this.componentKey += 1;
      }
    }
  },
  methods: {
    onChangeActiveImage(id) {
      this.$emit('change', id);
    }
  }
};
