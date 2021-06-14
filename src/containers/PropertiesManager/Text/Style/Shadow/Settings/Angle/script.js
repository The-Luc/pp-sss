import PpNumber from '@/components/Number';
import { validateInputOption } from '@/common/utils';
export default {
  components: {
    PpNumber
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  methods: {
    onChange(val) {
      const { isValid, value } = validateInputOption(val, 0, 360, 0);
      this.$emit('change', isValid ? value : this.value);
    }
  }
};
