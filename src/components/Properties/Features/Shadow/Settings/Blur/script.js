import Slider from '@/components/Slider/Slider';

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

  methods: {
    onChange(val) {
      const { isValid, value } = validateInputOption(val, 0, 100, 0);
      this.$emit('change', { shadowBlur: isValid ? value : this.value });
    }
  }
};
