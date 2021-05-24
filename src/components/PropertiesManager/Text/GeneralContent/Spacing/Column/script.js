import PpCombobox from '@/components/Combobox';
import { ICON_LOCAL } from '@/common/constants';

export default {
  components: {
    PpCombobox
  },
  data() {
    return {
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
