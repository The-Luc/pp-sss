import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/app/const';
import { MODAL_TYPES } from '@/common/constants';

// Modal component
import HelpModal from '@/views/CreateBook/HeadControl/BookInformation/Help/Modal';
import DeleteSheetModal from '@/views/CreateBook/Manager/SectionList/SectionItems/Section/SectionDetails/Modal';
import DeleteSectionModal from '@/views/CreateBook/Manager/SectionList/SectionItems/Section/SectionHeader/SectionProcess/Modal';
import GanttChartModal from '@/views/CreateBook/Manager/Summary/SummaryInfo/Progress/GanttChartModal';

// Don't allow close when click outside
import EmptySection from '@/containers/ModalEmptySection';
import SelectTheme from '@/views/CreateBook/PrintEdition/EditScreen/Modal';
import ModalSelectPage from '@/views/CreateBook/PrintEdition/EditScreen/PageEdition/ModalSelectPage';
import ModalBackgroundSelectPage from '@/containers/ToolPopoverManager/PrintEdition/Backgrounds/ModalSelectPage';
import SelectThemeDigital from '@/views/CreateBook/DigitalEdition/EditScreen/ModalTheme';
import AddDigitalFrame from '@/views/CreateBook/DigitalEdition/EditScreen/ModalLayout';
import OverrideLayout from '@/views/CreateBook/DigitalEdition/EditScreen/OverrideLayoutModal';
import ModalResetLayout from '@/views/CreateBook/PrintEdition/EditScreen/PageEdition/ModalResetLayout';

const {
  HELP,
  DELETE_SHEET,
  DELETE_SECTION,
  EMPTY_SECTION,
  SELECT_THEME,
  GANTT_CHART,
  SELECT_PAGE,
  BACKGROUND_SELECT_PAGE,
  SELECT_THEME_DIGITAL,
  ADD_DIGITAL_FRAME,
  OVERRIDE_LAYOUT,
  RESET_LAYOUT
} = MODAL_TYPES;

const ModalList = {
  [HELP]: HELP,
  [DELETE_SHEET]: DELETE_SHEET,
  [DELETE_SECTION]: DELETE_SECTION,
  [EMPTY_SECTION]: EMPTY_SECTION,
  [SELECT_THEME]: SELECT_THEME,
  [GANTT_CHART]: GANTT_CHART,
  [SELECT_PAGE]: SELECT_PAGE,
  [BACKGROUND_SELECT_PAGE]: BACKGROUND_SELECT_PAGE,
  [SELECT_THEME_DIGITAL]: SELECT_THEME_DIGITAL,
  [ADD_DIGITAL_FRAME]: ADD_DIGITAL_FRAME,
  [OVERRIDE_LAYOUT]: OVERRIDE_LAYOUT,
  [RESET_LAYOUT]: RESET_LAYOUT
};

export default {
  data() {
    return {
      renderModal: ''
    };
  },
  components: {
    [MODAL_TYPES.HELP]: HelpModal,
    [MODAL_TYPES.DELETE_SHEET]: DeleteSheetModal,
    [MODAL_TYPES.DELETE_SECTION]: DeleteSectionModal,
    [MODAL_TYPES.EMPTY_SECTION]: EmptySection,
    [MODAL_TYPES.SELECT_THEME]: SelectTheme,
    [MODAL_TYPES.GANTT_CHART]: GanttChartModal,
    [MODAL_TYPES.SELECT_PAGE]: ModalSelectPage,
    [MODAL_TYPES.BACKGROUND_SELECT_PAGE]: ModalBackgroundSelectPage,
    [MODAL_TYPES.SELECT_THEME_DIGITAL]: SelectThemeDigital,
    [MODAL_TYPES.ADD_DIGITAL_FRAME]: AddDigitalFrame,
    [MODAL_TYPES.OVERRIDE_LAYOUT]: OverrideLayout,
    [MODAL_TYPES.RESET_LAYOUT]: ModalResetLayout
  },
  computed: {
    ...mapGetters({
      isOpenModal: GETTERS.IS_OPEN_MODAL,
      modalData: GETTERS.MODAL_DATA
    })
  },
  watch: {
    isOpenModal: {
      deep: true,
      handler(value) {
        if (value) {
          this.setModal();
        } else {
          this.renderModal = '';
        }
      }
    }
  },
  methods: {
    setModal() {
      const { type } = this.modalData;
      const ModalComponent = ModalList[type];
      if (ModalComponent) {
        this.renderModal = ModalComponent;
      }
    }
  }
};
