import { mapMutations, mapGetters, mapActions } from 'vuex';

import { MUTATES, GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import {
  GETTERS as BOOK_GETTERS,
  MUTATES as BOOK_MUTATES
} from '@/store/modules/book/const';
import {
  ACTIONS as PRINT_ACTIONS,
  MUTATES as PRINT_MUTATES,
  GETTERS as PRINT_GETTERS
} from '@/store/modules/print/const';
import { MODAL_TYPES, TOOL_NAME } from '@/common/constants';
import ToolBar from './ToolBar';
import Header from '@/containers/HeaderEdition/Header';
import FeedbackBar from '@/containers/HeaderEdition/FeedbackBar';
import SidebarSection from './SidebarSection';
import PageEdition from './PageEdition';
import { useLayoutPrompt, usePopoverCreationTool, useInfoBar } from '@/hooks';
import { EDITION } from '@/common/constants';
import { isEmpty } from '@/common/utils';

export default {
  components: {
    ToolBar,
    Header,
    FeedbackBar,
    PageEdition,
    SidebarSection
  },
  setup() {
    const { pageSelected, updateVisited } = useLayoutPrompt(EDITION.PRINT);
    const { setToolNameSelected } = usePopoverCreationTool();
    const { setInfoBar } = useInfoBar();

    return {
      pageSelected,
      setToolNameSelected,
      updateVisited,
      setInfoBar
    };
  },
  async created() {
    this.setBookId({ bookId: this.$route.params.bookId });
    await this.getDataPageEdit();
    if (isEmpty(this.printThemeSelected)) {
      this.openSelectThemeModal();
    }
  },
  computed: {
    ...mapGetters({
      printThemeSelected: PRINT_GETTERS.DEFAULT_THEME_ID,
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES,
      selectedToolName: APP_GETTERS.SELECTED_TOOL_NAME,
      bookId: BOOK_GETTERS.BOOK_ID
    })
  },
  watch: {
    pageSelected: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal?.id !== oldVal?.id && !isEmpty(this.printThemeSelected)) {
          this.setIsPromptLayout(newVal);
        }
      }
    }
  },
  destroyed() {
    this.resetPrintConfigs();
    this.setPropertiesObjectType({ type: '' });
  },
  methods: {
    ...mapActions({
      getDataPageEdit: PRINT_ACTIONS.GET_DATA_EDIT
    }),
    ...mapMutations({
      setBookId: PRINT_MUTATES.SET_BOOK_ID,
      toggleModal: MUTATES.TOGGLE_MODAL,
      resetPrintConfigs: MUTATES.RESET_PRINT_CONFIG,
      savePrintCanvas: BOOK_MUTATES.SAVE_PRINT_CANVAS,
      setPropertiesObjectType: MUTATES.SET_PROPERTIES_OBJECT_TYPE
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
        this.setToolNameSelected(TOOL_NAME.PRINT_LAYOUTS);
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
      this.$router.push(`/book/${this.bookId}/edit/print`);
    },
    /**
     * Fire when zoom is changed
     *
     * @param {Number} zoom  selected zoom value
     */
    onZoom({ zoom }) {
      this.setInfoBar({ zoom });
    }
  }
};
