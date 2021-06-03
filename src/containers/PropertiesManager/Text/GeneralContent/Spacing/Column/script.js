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
          label: '1',
          value: 1
        },
        {
          label: '2',
          value: 2
        },
        {
          label: '3',
          value: 3
        },
        {
          label: '4',
          value: 4
        }
      ]
    };
  }
};
