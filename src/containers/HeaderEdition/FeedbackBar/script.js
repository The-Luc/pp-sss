import PropertiesManager from '@/containers/PropertiesManager';
import ToolPopoverManager from '@/containers/ToolPopoverManager';
import PpCombobox from '@/components/Selectors/Combobox';

import { ICON_LOCAL } from '@/common/constants';
import { ZOOM_VALUE } from '@/common/constants';

import { useInfoBar } from '@/hooks';
import { isEmpty, splitNumberByDecimal } from '@/common/utils';

export default {
  components: {
    PropertiesManager,
    ToolPopoverManager,
    PpCombobox
  },
  data() {
    return {
      appendedIcon: ICON_LOCAL.APPENED_ICON_ZOOM,
      items: ZOOM_VALUE
    };
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
  },
  methods: {
    changeZoom(val) {
      console.log(val);
    }
  }
};
