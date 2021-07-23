import { mapGetters, mapMutations, mapActions } from 'vuex';

import ToolBar from './ToolBar';
import Header from '@/containers/HeaderEdition/Header';
import FeedbackBar from '@/containers/HeaderEdition/FeedbackBar';
import ScreenEdition from './ScreenEdition';
import SidebarSection from './SidebarSection';
import ModalLayout from './ModalLayout';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
import {
  ACTIONS as DIGITAL_ACTIONS,
  MUTATES as DIGITAL_MUTATES,
  GETTERS as DIGITAL_GETTERS
} from '@/store/modules/digital/const';
import { EDITION, MODAL_TYPES, TOOL_NAME } from '@/common/constants';
import {
  useLayoutPrompt,
  usePopoverCreationTool,
  useMutationDigitalSheet
} from '@/hooks';
import { isEmpty } from '@/common/utils';
import { COPY_OBJECT_KEY } from '@/common/constants/config';
import digitalService from '@/api/digital';

export default {
  setup() {
    const { pageSelected, updateVisited } = useLayoutPrompt(EDITION.DIGITAL);
    const { setToolNameSelected } = usePopoverCreationTool();
    const { setCurrentSheetId } = useMutationDigitalSheet();

    return {
      pageSelected,
      updateVisited,
      setToolNameSelected,
      setCurrentSheetId
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
  beforeRouteEnter(to, _, next) {
    next(async me => {
      me.setBookId({ bookId: to.params.bookId });

      // temporary code, will remove soon
      const info = digitalService.getGeneralInfo();

      me.setInfo({ ...info, bookId: to.params.bookId });

      await me.getDataPageEdit();

      me.setCurrentSheetId({ id: to.params?.sheetId });

      if (isEmpty(me.defaultThemeId)) {
        me.openSelectThemeModal();
      }
    });
  },
  beforeRouteUpdate(to, _, next) {
    this.setCurrentSheetId({ id: to.params?.sheetId });

    next();
  },
  destroyed() {
    this.setPropertiesObjectType({ type: '' });

    this.setCurrentSheetId({ id: '' });

    this.toggleActiveObjects(false);

    sessionStorage.removeItem(COPY_OBJECT_KEY);
  },
  methods: {
    ...mapActions({
      getDataPageEdit: DIGITAL_ACTIONS.GET_DATA_EDIT
    }),
    ...mapMutations({
      setBookId: DIGITAL_MUTATES.SET_BOOK_ID,
      toggleModal: MUTATES.TOGGLE_MODAL,
      setPropertiesObjectType: MUTATES.SET_PROPERTIES_OBJECT_TYPE,
      setInfo: MUTATES.SET_GENERAL_INFO,
      toggleActiveObjects: MUTATES.TOGGLE_ACTIVE_OBJECTS
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
  }
};
