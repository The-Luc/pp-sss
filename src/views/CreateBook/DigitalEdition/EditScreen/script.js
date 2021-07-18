import { mapGetters, mapMutations, mapActions } from 'vuex';

import ToolBar from './ToolBar';
import Header from '@/containers/HeaderEdition/Header';
import FeedbackBar from '@/containers/HeaderEdition/FeedbackBar';
import ScreenEdition from './ScreenEdition';
import SidebarSection from './SidebarSection';
import ModalLayout from './ModalLayout';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import {
  ACTIONS as DIGITAL_ACTIONS,
  MUTATES as DIGITAL_MUTATES,
  GETTERS as DIGITAL_GETTERS
} from '@/store/modules/digital/const';
import { EDITION, MODAL_TYPES, TOOL_NAME } from '@/common/constants';
import { useLayoutPrompt, usePopoverCreationTool } from '@/hooks';
import { isEmpty } from '@/common/utils';

import digitalService from '@/api/digital';

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
    SidebarSection,
    ModalLayout
  },
  computed: {
    ...mapGetters({
      isOpenMenuProperties: GETTERS.IS_OPEN_MENU_PROPERTIES,
      selectedToolName: GETTERS.SELECTED_TOOL_NAME,
      bookId: BOOK_GETTERS.BOOK_ID,
      defaultThemeId: DIGITAL_GETTERS.DEFAULT_THEME_ID
    })
  },
  watch: {
    pageSelected: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal?.id !== oldVal?.id && !isEmpty(this.defaultThemeId)) {
          this.setIsPromptLayout(newVal);
        }
      }
    }
  },
  destroyed() {
    this.setPropertiesObjectType({ type: '' });
  },
  methods: {
    ...mapActions({
      getDataPageEdit: DIGITAL_ACTIONS.GET_DATA_EDIT
    }),
    ...mapMutations({
      setBookId: DIGITAL_MUTATES.SET_BOOK_ID,
      toggleModal: MUTATES.TOGGLE_MODAL,
      setPropertiesObjectType: MUTATES.SET_PROPERTIES_OBJECT_TYPE,
      setInfo: MUTATES.SET_GENERAL_INFO
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
      this.$router.push(`/book/${this.$route.params.bookId}/edit/digital`);
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
  async created() {
    this.setBookId({ bookId: this.$route.params.bookId });

    // temporary code, will remove soon
    const info = digitalService.getGeneralInfo();

    this.setInfo({ ...info, bookId: this.$route.params.bookId });

    await this.getDataPageEdit();
    if (isEmpty(this.defaultThemeId)) {
      this.openSelectThemeModal();
    }
  }
};
