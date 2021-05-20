import { mapMutations, mapGetters } from 'vuex';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
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
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL
    })
  },
  created() {
    this.toggleModal({
      isOpenModal: true,
      modalData: {
        type: MODAL_TYPES.SELECT_THEME
      }
    });
  }
};
