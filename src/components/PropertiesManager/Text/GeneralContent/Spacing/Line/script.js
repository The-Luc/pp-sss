import PpCombobox from '@/components/Combobox';
import { ICON_LOCAL } from '@/common/constants';

export default {
  components: {
    PpCombobox
  },
  data() {
    return {
      prependedIcon: ICON_LOCAL.PREPENDED_LINE,
      appendedIcon: ICON_LOCAL.APPENED_ICON,
      items: [
        {
          label: 'Auto',
          value: 'auto'
        }
      ]
    };
  }
};
