export default {
  props: {
    item: {
      type: [Number, String, Array],
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    ppActiveClass: {
      type: String,
      default: 'active-class'
    },
    mandatory: {
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
