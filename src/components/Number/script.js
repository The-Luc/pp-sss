export default {
  props: {
    suffix: {
      type: String,
      default: '%'
    },
    value: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      componentKey: 0,
      valueLength: String(this.value).length
    };
  },
  watch: {
    value(value) {
      this.onNumberChange(String(value));
    }
  },
  computed: {
    roundVal() {
      return Math.round(this.value);
    }
  },
  methods: {
    /**
     * Catch event user change on input
     * @param   {String}  value Value user input
     */
    onNumberChange(value) {
      this.valueLength = String(Math.round(value)).length;
    },
    /**
     * Check if value within min and max and then emit value to parent else return previous value by force render component
     * @param   {String}  value Value user input
     */
    onChangeInput(value) {
      if (+value > this.max || +value < this.min || !value) {
        this.forceRenderComponent();
      } else {
        this.$emit('change', +value);
      }
    },
    /**
     * Catch event user click ESCAPE from keyboard to return previous value by force render component
     */
    onEsc() {
      this.forceRenderComponent();
    },
    /**
     * Trigger render component by increase component key
     */
    forceRenderComponent() {
      this.valueLength = String(this.value).length;
      this.componentKey += 1;
    }
  }
};
