import { mapMutations, mapGetters } from 'vuex';
import { MUTATES } from '@/store/modules/app/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import { MODAL_TYPES } from '@/common/constants';
import ToolBar from './ToolBar';
import Header from '@/components/HeaderEdition/Header';
import FeedbackBar from '@/components/HeaderEdition/FeedbackBar';
import SidebarSection from './SidebarSection';
import PageEdition from './PageEdition';

export default {
  components: {
    ToolBar,
    Header,
    FeedbackBar,
    PageEdition,
    SidebarSection
  },
  computed: {
    ...mapGetters({
      printThemeSelected: BOOK_GETTERS.PRINT_THEME_SELECTED_ID
    })
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL,
      resetPrintConfigs: MUTATES.RESET_PRINT_CONFIG
    })
  },
  created() {
    if (!this.printThemeSelected) {
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.SELECT_THEME
        }
      });
    }
  },
  destroyed() {
    this.resetPrintConfigs();
  }
};
