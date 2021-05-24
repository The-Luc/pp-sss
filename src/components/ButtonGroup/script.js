export default {
  props: {
    item: {
      type: [Number, Array],
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onChange(item) {
      this.$emit('change', item);
    }
  }
};
