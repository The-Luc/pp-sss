import { mapMutations, mapGetters } from 'vuex';

import { MUTATES, GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import {
  GETTERS as BOOK_GETTERS,
  MUTATES as BOOK_MUTATES
} from '@/store/modules/book/const';
import { MODAL_TYPES, TOOL_NAME } from '@/common/constants';
import ToolBar from './ToolBar';
import Header from '@/containers/HeaderEdition/Header';
import FeedbackBar from '@/containers/HeaderEdition/FeedbackBar';
import SidebarSection from './SidebarSection';
import PageEdition from './PageEdition';
import { useLayoutPrompt, usePopoverCreationTool } from '@/hooks';

export default {
  setup() {
    const { pageSelected, updateVisited } = useLayoutPrompt();
    const { setToolNameSelected } = usePopoverCreationTool();
    return {
      pageSelected,
      setToolNameSelected,
      updateVisited
    };
  },
  components: {
    ToolBar,
    Header,
    FeedbackBar,
    PageEdition,
    SidebarSection
  },
  computed: {
    ...mapGetters({
      printThemeSelected: BOOK_GETTERS.PRINT_THEME_SELECTED_ID,
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES,
      selectedToolName: APP_GETTERS.SELECTED_TOOL_NAME
    })
  },
  watch: {
    pageSelected: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal.id !== oldVal.id && this.printThemeSelected) {
          this.setIsPromptLayout(newVal);
        }
      }
    }
  },
  mounted() {
    if (!this.printThemeSelected) {
      this.openSelectThemeModal();
    }
  },
  destroyed() {
    this.resetPrintConfigs();
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL,
      resetPrintConfigs: MUTATES.RESET_PRINT_CONFIG,
      savePrintCanvas: BOOK_MUTATES.SAVE_PRINT_CANVAS
    }),
    /**
     * Trigger mutation to open theme modal
     */
    openSelectThemeModal() {
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.SELECT_THEME
        }
      });
    },
    /**
     * Check current sheet is first time visited or no to open prompt
     * @param  {Number} pageSelected - Curent page(sheet) selected id
     */
    setIsPromptLayout(pageSelected) {
      if (!pageSelected.isVisited) {
        this.setToolNameSelected(TOOL_NAME.LAYOUTS);
        this.updateVisited({
          sheetId: pageSelected?.id
        });
      }
    },
    /**
     * Save print canvas and change view
     */
    onClickSavePrintCanvas() {
      const canvas = window.printCanvas;
      let objs = canvas.getObjects();
      this.savePrintCanvas({
        data: objs
      });
      this.$router.go(-1);
    }
  }
};
