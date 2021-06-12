export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },
  methods: {
    /**
     * Emit event change input
     * @param   {Object}   event event change change of input
     */
    change(event) {
      this.$emit('change', event);
    }
  }
};
