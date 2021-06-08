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
          name: '1',
          value: 1
        },
        {
          name: '2',
          value: 2
        },
        {
          name: '3',
          value: 3
        },
        {
          name: '4',
          value: 4
        }
      ]
    };
  }
};
