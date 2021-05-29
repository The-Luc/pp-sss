import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/app/const';
import { MODAL_TYPES } from '@/common/constants';

// Modal component
import HelpModal from '@/views/CreateBook/HeadControl/BookInformation/Help/Modal';
import DeleteSheetModal from '@/views/CreateBook/Manager/SectionList/SectionItems/Section/SectionDetails/Modal';
import DeleteSectionModal from '@/views/CreateBook/Manager/SectionList/SectionItems/Section/SectionHeader/SectionProcess/Modal';
import GanttChartModal from '@/views/CreateBook/Manager/Summary/SummaryInfo/Progress/GanttChartModal';

// Don't allow close when click outside
import EmptySection from '@/components/ModalEmptySection';
import SelectTheme from '@/views/CreateBook/PrintEdition/EditScreen/Modal';

const {
  HELP,
  DELETE_SHEET,
  DELETE_SECTION,
  EMPTY_SECTION,
  SELECT_THEME,
  GANTT_CHART
} = MODAL_TYPES;

const ModalList = {
  [HELP]: HELP,
  [DELETE_SHEET]: DELETE_SHEET,
  [DELETE_SECTION]: DELETE_SECTION,
  [EMPTY_SECTION]: EMPTY_SECTION,
  [SELECT_THEME]: SELECT_THEME,
  [GANTT_CHART]: GANTT_CHART
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
    [MODAL_TYPES.GANTT_CHART]: GanttChartModal
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
