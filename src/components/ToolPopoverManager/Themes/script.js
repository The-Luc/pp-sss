import PpToolPopover from '@/components/ToolPopover';
import PpSelect from '@/components/Select';
import { THEMES_LIST } from '@/mock/themesList';

export default {
  components: {
    PpToolPopover,
    PpSelect
  },
  data() {
    return {
      items: THEMES_LIST
    };
  }
};
