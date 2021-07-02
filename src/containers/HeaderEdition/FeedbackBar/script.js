import PropertiesManager from '@/containers/PropertiesManager';
import ToolPopoverManager from '@/containers/ToolPopoverManager';

import { useInfoBar } from '@/hooks';
import { isEmpty, splitNumberByDecimal } from '@/common/utils';

export default {
  components: {
    PropertiesManager,
    ToolPopoverManager
  },
  props: {
    isOpenMenuProperties: {
      type: Boolean,
      default: false
    },
    selectedToolName: {
      type: String,
      default: ''
    }
  },
  setup() {
    const { infoBar } = useInfoBar();

    return { infoBar };
  },
  computed: {
    size() {
      const w = this.infoBar.w;
      const h = this.infoBar.h;

      return {
        width: isEmpty(w) || w === 0 ? '- - -' : splitNumberByDecimal(w),
        height: isEmpty(h) || h === 0 ? '- - -' : splitNumberByDecimal(h)
      };
    }
  }
};
