import PpNumber from '@/components/Input/InputProperty';
import AnglePicker from '@/components/Properties/Features/AnglePicker';

import { validateInputOption } from '@/common/utils';
import { SHADOW_VALUE } from '@/common/constants/shadow';

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
  data() {
    return {
      min: SHADOW_VALUE.MIN_ANGLE,
      max: SHADOW_VALUE.MAX_ANGLE
    };
  },
  methods: {
    onChange(val) {
      const { isValid, value } = validateInputOption(
        val,
        SHADOW_VALUE.MIN_ANGLE,
        SHADOW_VALUE.MAX_ANGLE,
        0
      );
      this.$emit('change', { shadowAngle: isValid ? value : this.value });
    }
  }
};
