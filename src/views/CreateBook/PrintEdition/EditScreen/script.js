import { mapMutations } from 'vuex';

import ToolBar from '@/components/HeaderEdition/ToolBar';
import Header from '@/components/HeaderEdition/Header';
import FeedbackBar from '@/components/HeaderEdition/FeedbackBar';
import PageEdition from './PageEdition';
import SidebarSection from './SidebarSection';
import { MUTATES } from '@/store/modules/app/const';

export default {
  components: {
    ToolBar,
    Header,
    FeedbackBar,
    PageEdition,
    SidebarSection
  },
  destroyed() {
    this.resetPrintConfigs();
  },
  methods: {
    ...mapMutations({
      resetPrintConfigs: MUTATES.RESET_PRINT_CONFIG
    })
  }
};
