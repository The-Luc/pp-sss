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
  data() {
    return {
      // when ESC is pressed, both onEsc and onChange are called
      // we need the following variable to prevent onChange triggered when ESC pressed
      isAllowToChange: true
    };
  },
  methods: {
    /**
     * Emit event change input
     * @param   {Object}   event event change change of input
     */
    onChange(event) {
      if (!this.isAllowToChange) return;

      this.$emit('change', event.target.value);
    },
    /**
     * Emit event user press Escape
     */
    onEsc() {
      this.isAllowToChange = false;

      this.$emit('change', this.value);
    }
  },
  updated() {
    this.isAllowToChange = true;
  }
};
