import { mapMutations, mapGetters } from 'vuex';
import { MUTATES } from '@/store/modules/app/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import { MODAL_TYPES } from '@/common/constants';
import ToolBar from '@/components/HeaderEdition/ToolBar';
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
      isSelectedPrintTheme: BOOK_GETTERS.IS_SELECTED_PRINT_THEME
    })
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL,
      resetPrintConfigs: MUTATES.RESET_PRINT_CONFIG
    })
  },
  created() {
    if (!this.isSelectedPrintTheme) {
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
