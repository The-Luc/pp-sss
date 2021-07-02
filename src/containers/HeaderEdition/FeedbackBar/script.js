import PropertiesManager from '@/containers/PropertiesManager';
import ToolPopoverManager from '@/containers/ToolPopoverManager';
import PpCombobox from '@/components/Selectors/Combobox';

import { ICON_LOCAL } from '@/common/constants';
import { ZOOM_VALUE } from '@/common/constants';

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
  methods: {
    changeZoom(val) {
      console.log(val);
    }
  }
};
