export default {
  props: {
    ppValue: {
      type: String,
      default: '100'
    },
    label: {
      type: String,
      default: '%'
    }
  },
  data() {
    return {
      value: this.ppValue
    };
  },
  methods: {
    /**
     * Emit value slider and input when change input
     */
    change() {
      this.$emit('change', this.value);
    }
  }
};
