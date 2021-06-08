import { ICON_LOCAL, THINKNESS_OPTIONS } from '@/common/constants';
import PpCombobox from '@/components/Combobox';

export default {
  components: {
    PpCombobox
  },
  data() {
    return {
      appendedIcon: ICON_LOCAL.APPENED_ICON,
      items: THINKNESS_OPTIONS,
      selectedThickness: THINKNESS_OPTIONS.find(opt => opt.value === 1)
    };
  },
  methods: {
    onChange(value) {
      //TODO later
      console.log('value', value);
    }
  }
};
