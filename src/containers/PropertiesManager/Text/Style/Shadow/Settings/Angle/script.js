import PpNumber from '@/components/Number';
import { validateInputOption } from '@/common/utils';
import AnglePicker from '@/components/AnglePicker';

export default {
  components: {
    PpNumber,
    AnglePicker
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
