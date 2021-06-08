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
      componentKey: 0
    };
  },
  methods: {
    /**
     * Check if value within min and max and then emit value to parent else return previous value
     * @param   {String}  value Value user input
     */
    onChangeInput(value) {
      if (+value > this.max || +value < this.min) {
        this.componentKey += 1; // Force render component
      } else {
        this.$emit('change', +value);
      }
    }
  }
};
