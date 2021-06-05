export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      require: true
    },
    label: {
      type: String,
      require: true
    },
    style: {
      type: Object,
      default: {}
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
