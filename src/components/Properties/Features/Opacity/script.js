import Slider from '@/components/Slider';
import { validateInputOption } from '@/common/utils';

export default {
  components: {
    Slider
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      opacity: 0
    };
  },
  watch: {
    /**
     * Listen to outside data change to refresh inner data
     * @param {Number} val - the new value from outside
     */
    value(val) {
      this.refreshOpacity(val);
    }
  },
  mounted() {
    this.refreshOpacity(this.value);
  },
  methods: {
    /**
     * To convert number like 0.5 to percentage number like 50 (%)
     * @param {Number} value - the value that need to be converted to %
     */
    refreshOpacity(value) {
      this.opacity = +(value || 0) * 100;
    },
    /**
     * Handle change value
     * @param {Number} val - the value returned from user input
     */
    onChange(val) {
      const { isValid, value } = validateInputOption(val, 0, 100, 0);
      this.$emit('change', (isValid ? value : this.value) / 100);
    }
  }
};
