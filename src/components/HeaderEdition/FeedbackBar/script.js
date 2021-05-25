import { mapGetters } from 'vuex';

import PropertiesManager from '@/components/PropertiesManager';
import ToolPopoverManager from '@/components/ToolPopoverManager';
import { GETTERS } from '@/store/modules/app/const';

export default {
  components: {
    PropertiesManager,
    ToolPopoverManager
  },
  computed: {
    ...mapGetters({
      isOpenMenuProperties: GETTERS.IS_OPEN_MENU_PROPERTIES,
      selectedToolName: GETTERS.SELECTED_TOOL_NAME
    })
  }
};
