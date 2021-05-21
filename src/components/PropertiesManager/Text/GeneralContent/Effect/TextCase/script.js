import { ICON_LOCAL } from '@/common/constants';
import PpButtonGroup from '@/components/ButtonGroup';

export default {
  data() {
    return {
      currentItem: 0,
      upperCase: ICON_LOCAL.TEXT_UPPERCASE,
      lowerCase: ICON_LOCAL.TEXT_LOWERCASE,
      capitalize: ICON_LOCAL.TEXT_CAPITALIZE
    };
  },
  components: {
    PpButtonGroup
  }
};
