import { mapGetters, mapMutations, mapActions } from 'vuex';

import ToolBar from './ToolBar';
import Header from '@/containers/HeaderEdition/Header';
import FeedbackBar from '@/containers/HeaderEdition/FeedbackBar';
import ScreenEdition from './ScreenEdition';
import SidebarSection from './SidebarSection';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import {
  ACTIONS as DIGITAL_ACTIONS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';
import { EDITION, MODAL_TYPES, TOOL_NAME } from '@/common/constants';
import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';
import { useLayoutPrompt, usePopoverCreationTool } from '@/hooks';

export default {
  setup() {
    const { pageSelected, updateVisited } = useLayoutPrompt(EDITION.DIGITAL);
    const { setToolNameSelected } = usePopoverCreationTool();

    return {
      pageSelected,
      updateVisited,
      setToolNameSelected
    };
  },
  components: {
    ToolBar,
    Header,
    FeedbackBar,
    ScreenEdition,
    SidebarSection
  },
  computed: {
    ...mapGetters({
      isOpenMenuProperties: GETTERS.IS_OPEN_MENU_PROPERTIES,
      selectedToolName: GETTERS.SELECTED_TOOL_NAME,
      bookId: BOOK_GETTERS.BOOK_ID,
      defaultThemeId: DIGITAL_GETTERS.SET_DEFAULT_THEME_ID
    })
  },
  watch: {
    pageSelected: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal?.id !== oldVal?.id && this.defaultThemeId) {
          this.setIsPromptLayout(newVal);
        }
      }
    }
  },
  methods: {
    ...mapActions({
      getDataPageEdit: DIGITAL_ACTIONS.GET_DATA_EDIT
    }),
    ...mapMutations({
      setBookId: DIGITAL_MUTATES.SET_BOOK_ID,
      toggleModal: MUTATES.TOGGLE_MODAL
    }),
    /**
     * Check current sheet is first time visited or no to open prompt
     * @param  {Number} pageSelected - Curent page(sheet) selected id
     */
    setIsPromptLayout(pageSelected) {
      if (!pageSelected.isVisited) {
        this.setToolNameSelected(TOOL_NAME.DIGITAL_LAYOUTS);
        this.updateVisited({
          sheetId: pageSelected?.id
        });
      }
    },
    /**
     * Save digital canvas and change view
     */
    onClickSaveDigitalCanvas() {
      this.$router.push(`/book/${this.bookId}/edit/digital`);
    },
    /**
     * Trigger mutation to open theme modal
     */
    openSelectThemeModal() {
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.SELECT_THEME_DIGITAL
        }
      });
    }
  },
  mounted() {
    if (!this.defaultThemeId) {
      this.openSelectThemeModal();
    }
  },
  created() {
    this.setBookId({ bookId: this.$route.params.bookId });

    this.getDataPageEdit();
  }
};
