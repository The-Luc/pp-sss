export default {
  props: {
    titleName: {
      type: String,
      default: ''
    },
    titleValue: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      componentKey: true
    };
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
     * return previous value when user press Escape
     */
    onEsc(event) {
      event.target.value = this.titleValue;
      this.forceRenderComponent();
    },
    /**
     * Trigger render component by changing component key
     */
    forceRenderComponent() {
      this.componentKey = !this.componentKey;
    }
  }
};
