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
      const { isValid, value } = validateInputOption(val, 0, 270, 0);
      this.$emit('changeAngle', isValid ? value : this.value);
    }
  }
};
