export default {
  props: {
    item: {
      type: [Number, Array],
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    ppActiveClass: {
      type: String,
      default: 'active-class'
    }
  },
  methods: {
    onChange(item) {
      this.$emit('change', item);
    }
  }
};
