import { mapMutations, mapGetters, mapActions } from 'vuex';

import { MUTATES, GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import { MUTATES as BOOK_MUTATES } from '@/store/modules/book/const';
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
import {
  useLayoutPrompt,
  usePopoverCreationTool,
  useInfoBar,
  useMutatesSheet
} from '@/hooks';
import { EDITION } from '@/common/constants';
import { isEmpty } from '@/common/utils';

import printService from '@/api/print';

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
    const { setCurrentSheetId } = useMutatesSheet();

    return {
      pageSelected,
      setToolNameSelected,
      updateVisited,
      setInfoBar,
      setCurrentSheetId
    };
  },
  computed: {
    ...mapGetters({
      printThemeSelected: PRINT_GETTERS.DEFAULT_THEME_ID,
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES,
      selectedToolName: APP_GETTERS.SELECTED_TOOL_NAME
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
  beforeRouteEnter(to, _, next) {
    next(async me => {
      me.setBookId({ bookId: to.params.bookId });

      // temporary code, will remove soon
      const info = printService.getGeneralInfo();

      me.setInfo({ ...info, bookId: to.params.bookId });

      await me.getDataPageEdit();

      me.setCurrentSheetId({ id: to.params?.sheetId });

      if (isEmpty(me.printThemeSelected)) {
        me.openSelectThemeModal();
      }
    });
  },
  beforeRouteUpdate(to, _, next) {
    this.setCurrentSheetId({ id: to.params?.sheetId });

    next();
  },
  destroyed() {
    this.resetPrintConfigs();
    this.setPropertiesObjectType({ type: '' });

    this.setCurrentSheetId({ id: '' });
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
      setPropertiesObjectType: MUTATES.SET_PROPERTIES_OBJECT_TYPE,
      setInfo: MUTATES.SET_GENERAL_INFO
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
      /*const canvas = window.printCanvas;
      let objs = canvas.getObjects();
      this.savePrintCanvas({
        data: objs
      });*/
      this.$router.push(`/book/${this.$route.params.bookId}/edit/print`);
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
