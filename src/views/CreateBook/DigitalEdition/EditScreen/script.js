import { mapGetters } from 'vuex';

import ToolBar from './ToolBar';
import Header from '@/containers/HeaderEdition/Header';
import FeedbackBar from '@/containers/HeaderEdition/FeedbackBar';
import PageEdition from './PageEdition';
import SidebarSection from './SidebarSection';
import { GETTERS } from '@/store/modules/app/const';

export default {
  components: {
    ToolBar,
    Header,
    FeedbackBar,
    PageEdition,
    SidebarSection
  },
  methods: {
    /**
     * Save digital canvas and change view
     */
    onClickSaveDigitalCanvas() {
      this.$router.go(-1);
    }
  },
  computed: {
    ...mapGetters({
      isOpenMenuProperties: GETTERS.IS_OPEN_MENU_PROPERTIES,
      selectedToolName: GETTERS.SELECTED_TOOL_NAME
    })
  }
};
