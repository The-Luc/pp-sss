import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/app/const';
import { MODAL_TYPES } from '@/common/constants';

// Modal component
import HelpModal from '@/views/CreateBook/HeadControl/BookInformation/Help/Modal';
import DeleteSheetModal from '@/views/CreateBook/Manager/SectionList/SectionItems/Section/SectionDetails/Modal';
import DeleteSectionModal from '@/views/CreateBook/Manager/SectionList/SectionItems/Section/SectionHeader/SectionProcess/Modal';
import GanttChartModal from '@/views/CreateBook/Manager/Summary/SummaryInfo/Progress/GanttChartModal';

// Don't allow close when click outside
import EmptySection from '@/containers/Modals/EmptySection';
import ModalSaveStyle from '@/containers/Modals/SaveStyle/SaveStyleModal';
import ModalStyleSaved from '@/containers/Modals/SaveStyle/SavedModal';
import LayoutMapping from '@/containers/Modals/LayoutMapping';

import ModalBackgroundSelectPage from '@/containers/ToolPopoverManager/Backgrounds/PrintBackgrounds/ModalSelectPage';

import SelectTheme from '@/views/CreateBook/PrintEdition/EditScreen/Modals/ThemesModal';
import GeneratePDF from '@/views/CreateBook/PrintEdition/EditScreen/Modals/GeneratePdf';
import ModalSaveLayout from '@/views/CreateBook/PrintEdition/EditScreen/Modals/ModalSaveLayout/ModalSaveLayout';
import ModalSelectPageOfLayout from '@/views/CreateBook/PrintEdition/EditScreen/Modals/ModalSaveLayout/ModalSelectPageOfLayout';
import ModalSaveLayoutSuccess from '@/views/CreateBook/PrintEdition/EditScreen/Modals/ModalSaveLayout/ModalSaveLayoutSuccess';

import SelectThemeDigital from '@/views/CreateBook/DigitalEdition/EditScreen/Modals/ModalTheme';
import AddDigitalFrame from '@/views/CreateBook/DigitalEdition/EditScreen/Modals/ModalLayout';
import OverrideLayout from '@/views/CreateBook/DigitalEdition/EditScreen/Modals/OverrideLayoutModal';
import DeleteFrame from '@/views/CreateBook/DigitalEdition/EditScreen/Modals/ModalConfirmDelete';
import SaveDigitalLayout from '@/views/CreateBook/DigitalEdition/EditScreen/Modals/ModalSaveLayout';

import ApplyLayout from '@/views/CreateBook/PrintEdition/EditScreen/Modals/ApplyLayout';
import ContentMappingOverview from '@/containers/Modals/ContentMappingOverview';
import ContentMappingModal from '@/containers/Modals/ContentMappingModal';

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
  DELETE_FRAME,
  RESET_LAYOUT,
  SAVE_LAYOUT,
  SELECT_PAGE_OF_LAYOUT,
  SAVE_DIGITAL_LAYOUT,
  SAVE_STYLE,
  SAVE_STYLE_SUCCESS,
  SAVE_LAYOUT_SUCCESS,
  GENERATE_PDF,
  MAP_LAYOUT,
  APPLY_LAYOUT,
  CONTENT_MAPPING_OVERVIEW,
  CONTENT_MAPPING
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
  [DELETE_FRAME]: DELETE_FRAME,
  [RESET_LAYOUT]: RESET_LAYOUT,
  [SAVE_LAYOUT]: SAVE_LAYOUT,
  [SELECT_PAGE_OF_LAYOUT]: SELECT_PAGE_OF_LAYOUT,
  [SAVE_DIGITAL_LAYOUT]: SAVE_DIGITAL_LAYOUT,
  [SAVE_STYLE]: SAVE_STYLE,
  [SAVE_STYLE_SUCCESS]: SAVE_STYLE_SUCCESS,
  [SAVE_LAYOUT_SUCCESS]: SAVE_LAYOUT_SUCCESS,
  [GENERATE_PDF]: GENERATE_PDF,
  [MAP_LAYOUT]: MAP_LAYOUT,
  [APPLY_LAYOUT]: APPLY_LAYOUT,
  [CONTENT_MAPPING_OVERVIEW]: CONTENT_MAPPING_OVERVIEW,
  [CONTENT_MAPPING]: CONTENT_MAPPING
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
    [MODAL_TYPES.BACKGROUND_SELECT_PAGE]: ModalBackgroundSelectPage,
    [MODAL_TYPES.SELECT_THEME_DIGITAL]: SelectThemeDigital,
    [MODAL_TYPES.ADD_DIGITAL_FRAME]: AddDigitalFrame,
    [MODAL_TYPES.OVERRIDE_LAYOUT]: OverrideLayout,
    [MODAL_TYPES.DELETE_FRAME]: DeleteFrame,
    [MODAL_TYPES.SAVE_LAYOUT]: ModalSaveLayout,
    [MODAL_TYPES.SELECT_PAGE_OF_LAYOUT]: ModalSelectPageOfLayout,
    [MODAL_TYPES.SAVE_DIGITAL_LAYOUT]: SaveDigitalLayout,
    [MODAL_TYPES.SAVE_STYLE]: ModalSaveStyle,
    [MODAL_TYPES.SAVE_STYLE_SUCCESS]: ModalStyleSaved,
    [MODAL_TYPES.SAVE_LAYOUT_SUCCESS]: ModalSaveLayoutSuccess,
    [MODAL_TYPES.GENERATE_PDF]: GeneratePDF,
    [MODAL_TYPES.APPLY_LAYOUT]: ApplyLayout,
    [MODAL_TYPES.MAP_LAYOUT]: LayoutMapping,
    [CONTENT_MAPPING_OVERVIEW]: ContentMappingOverview,
    [CONTENT_MAPPING]: ContentMappingModal
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
