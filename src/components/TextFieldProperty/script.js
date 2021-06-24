export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * Emit event change input
     * @param   {Object}   event event change change of input
     */
    onChange(event) {
      this.$emit('change', event.target.value);
    },
    /**
     * Emit event user press Escape
     */
    onEsc() {
      this.$emit('change', this.value);
    }
  }
};
