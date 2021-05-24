import { ICON_LOCAL } from '@/common/constants';
import PpButtonGroup from '@/components/ButtonGroup';

export default {
  data() {
    return {
      item: null,
      upperCase: ICON_LOCAL.TEXT_UPPERCASE,
      lowerCase: ICON_LOCAL.TEXT_LOWERCASE,
      capitalize: ICON_LOCAL.TEXT_CAPITALIZE
    };
  },
  components: {
    PpButtonGroup
  },
  methods: {
    onChange(val) {}
  }
};
