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
    }
  },

  data() {
    return {
      opacity: 0
    };
  },

  watch: {
    value(val) {
      this.refreshOpacity(val);
    }
  },

  mounted() {
    this.refreshOpacity(this.value);
  },

  methods: {
    refreshOpacity(value) {
      this.opacity = +(value || 0) * 100;
    },
    onChange(val) {
      const { isValid, value } = validateInputOption(val, 0, 100, 0);
      this.$emit('change', (isValid ? value : this.value) / 100);
    }
  }
};
