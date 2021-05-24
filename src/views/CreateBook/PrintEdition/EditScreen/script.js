import { mapMutations, mapGetters } from 'vuex';
import { MUTATES } from '@/store/modules/app/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import { MODAL_TYPES } from '@/common/constants';
import ToolBar from './ToolBar';
import Header from './Header';
import FeedbackBar from './FeedbackBar';
import PageEdition from './PageEdition';
import SidebarSection from './SidebarSection';

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
      toggleModal: MUTATES.TOGGLE_MODAL
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
  }
};
