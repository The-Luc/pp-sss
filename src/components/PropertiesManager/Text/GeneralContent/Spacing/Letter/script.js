import PpCombobox from '@/components/Combobox';
import { ICON_LOCAL } from '@/common/constants';
import { LETTER_SPACING } from '@/mock/letterSpacing';

export default {
  components: {
    PpCombobox
  },
  data() {
    return {
      prependedIcon: ICON_LOCAL.PREPENDED_LETTER,
      appendedIcon: ICON_LOCAL.APPENED_ICON,
      items: LETTER_SPACING
    };
  }
};
