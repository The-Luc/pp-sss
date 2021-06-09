import PpCombobox from '@/components/Combobox';
import { ICON_LOCAL } from '@/common/constants';

export default {
  components: {
    PpCombobox
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      prependedIcon: ICON_LOCAL.PREPENDED_LINE,
      appendedIcon: ICON_LOCAL.APPENED_ICON
    };
  }
};
