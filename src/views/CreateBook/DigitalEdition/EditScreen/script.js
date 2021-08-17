import { mapGetters, mapMutations, mapActions } from 'vuex';

import ToolBar from './ToolBar';
import Header from '@/containers/HeaderEdition/Header';
import FeedbackBar from '@/containers/HeaderEdition/FeedbackBar';
import ScreenEdition from './ScreenEdition';
import SidebarSection from './SidebarSection';
import PhotoSidebar from '@/components/PhotoSidebar';
import ModalAddMedia from '@/containers/Modal/Media';

import { GETTERS, MUTATES } from '@/store/modules/app/const';
import {
  ACTIONS as DIGITAL_ACTIONS,
  MUTATES as DIGITAL_MUTATES,
  GETTERS as DIGITAL_GETTERS
} from '@/store/modules/digital/const';
import {
  EDITION,
  MODAL_TYPES,
  TOOL_NAME,
  ROLE,
  SAVE_STATUS,
  SAVING_DURATION
} from '@/common/constants';
import {
  useLayoutPrompt,
  usePopoverCreationTool,
  useMutationDigitalSheet,
  useUser,
  useGetterDigitalSheet,
  useFrame
} from '@/hooks';
import { isEmpty, isPositiveInteger, getEditionListPath } from '@/common/utils';
import { COPY_OBJECT_KEY } from '@/common/constants/config';

import { useSaveData } from './composables';
import { useSavingStatus } from '../../composables';
import { useBookDigitalInfo } from './composables';

export default {
  setup() {
    const { pageSelected, updateVisited } = useLayoutPrompt(EDITION.DIGITAL);
    const { setToolNameSelected } = usePopoverCreationTool();
    const { setCurrentSheetId } = useMutationDigitalSheet();
    const { currentUser } = useUser();
    const { currentSection } = useGetterDigitalSheet();
    const { currentFrameId, updateFrameObjects } = useFrame();
    const { saveEditScreen, getDataEditScreen } = useSaveData();
    const { updateSavingStatus } = useSavingStatus();
    const { getBookDigitalInfo } = useBookDigitalInfo();

    return {
      pageSelected,
      updateVisited,
      setToolNameSelected,
      setCurrentSheetId,
      currentUser,
      currentSection,
      currentFrameId,
      updateFrameObjects,
      saveEditScreen,
      getDataEditScreen,
      updateSavingStatus,
      getBookDigitalInfo
    };
  },
  data() {
    return {
      isOpenModal: false
    };
  },
  components: {
    ToolBar,
    Header,
    FeedbackBar,
    ScreenEdition,
    SidebarSection,
    PhotoSidebar,
    ModalAddMedia
  },
  computed: {
    ...mapGetters({
      isOpenMenuProperties: GETTERS.IS_OPEN_MENU_PROPERTIES,
      selectedToolName: GETTERS.SELECTED_TOOL_NAME,
      defaultThemeId: DIGITAL_GETTERS.DEFAULT_THEME_ID
    }),
    isShowAutoflow() {
      return false;
    },
    isOpenMediaSidebar() {
      return this.selectedToolName === TOOL_NAME.MEDIA;
    }
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
  async beforeRouteEnter(to, _, next) {
    next(async vm => {
      const bookId = to.params.bookId;

      const editionMainUrl = getEditionListPath(bookId, EDITION.DIGITAL);

      if (!isPositiveInteger(to.params?.sheetId)) {
        vm.$router.replace(editionMainUrl);

        return;
      }

      await vm.getBookDigitalInfo(bookId);

      vm.setCurrentSheetId({ id: parseInt(to.params.sheetId) });

      if (isEmpty(vm.currentSection)) {
        vm.$router.replace(editionMainUrl);

        return;
      }

      const isAdmin = vm.currentUser.role === ROLE.ADMIN;
      const isAssigned = vm.currentUser.id === vm.currentSection.assigneeId;

      if (!isAdmin && !isAssigned) {
        vm.$router.replace(editionMainUrl);

        return;
      }

      if (isEmpty(vm.defaultThemeId)) {
        vm.openSelectThemeModal();
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
    async onClickSaveDigitalCanvas() {
      this.updateSavingStatus({ status: SAVE_STATUS.START });

      this.updateFrameObjects({ frameId: this.currentFrameId });
      const data = this.getDataEditScreen(this.pageSelected.id);
      await this.saveEditScreen(data);

      this.updateSavingStatus({ status: SAVE_STATUS.END });

      setTimeout(() => {
        this.$router.push(
          getEditionListPath(this.$route.params.bookId, EDITION.DIGITAL)
        );
      }, SAVING_DURATION);
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
    },
    /**
     * Close list photo in sidebar
     */
    closeMediaSidebar() {
      this.setToolNameSelected('');
    },
    /**
     * Handle autoflow
     */
    handleAutoflow() {
      console.log('handleAutoflow');
    },
    /**
     * Use to open modal media
     */
    openModalMedia() {
      this.isOpenModal = true;
    },
    /**
     * Close modal media when click cancel button
     */
    onCancel() {
      this.isOpenModal = false;
    },
    /**
     * Selected media and save in sheet
     * @param   {Array}  media  selected media
     */
    handleSelectedMedia(media) {
      console.log(media);
    }
  }
};
