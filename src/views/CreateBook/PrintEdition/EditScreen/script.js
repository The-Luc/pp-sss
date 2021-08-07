import { mapMutations, mapGetters, mapActions } from 'vuex';

import { MUTATES, GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import { MUTATES as BOOK_MUTATES } from '@/store/modules/book/const';
import {
  ACTIONS as PRINT_ACTIONS,
  MUTATES as PRINT_MUTATES,
  GETTERS as PRINT_GETTERS
} from '@/store/modules/print/const';
import {
  MODAL_TYPES,
  ROLE,
  SAVE_STATUS,
  SAVING_DURATION,
  TOOL_NAME
} from '@/common/constants';
import ToolBar from './ToolBar';
import Header from '@/containers/HeaderEdition/Header';
import FeedbackBar from '@/containers/HeaderEdition/FeedbackBar';
import SidebarSection from './SidebarSection';
import PageEdition from './PageEdition';
import PhotoSidebar from '@/components/PhotoSidebar';
import SheetMedia from '@/components/SheetMedia';
import ModalAddPhotos from '@/containers/Modal/Photos';

import {
  useLayoutPrompt,
  usePopoverCreationTool,
  useInfoBar,
  useMutationPrintSheet,
  useUser,
  useGetterPrintSheet,
  useMenuProperties,
  useProperties,
  useSheet,
  useActionsEditionSheet
} from '@/hooks';
import { EDITION } from '@/common/constants';
import {
  isEmpty,
  isPositiveInteger,
  getEditionListPath,
  activeCanvas
} from '@/common/utils';

import printService from '@/api/print';
import { useSaveData } from './PageEdition/composables';
import { getActivateImages, setImageSrc } from '@/common/fabricObjects';
import { useSavingStatus } from '../../composables';

export default {
  components: {
    ToolBar,
    Header,
    FeedbackBar,
    PageEdition,
    SidebarSection,
    PhotoSidebar,
    SheetMedia,
    ModalAddPhotos
  },
  setup() {
    const { pageSelected, updateVisited } = useLayoutPrompt(EDITION.PRINT);
    const { setToolNameSelected } = usePopoverCreationTool();
    const { setInfoBar } = useInfoBar();
    const { setCurrentSheetId } = useMutationPrintSheet();
    const { currentUser } = useUser();
    const { currentSection } = useGetterPrintSheet();
    const { savePrintEditScreen, getDataEditScreen } = useSaveData();
    const { isOpenMenuProperties } = useMenuProperties();
    const { setPropertyById } = useProperties();
    const { updateSavingStatus } = useSavingStatus();
    const { sheetMedia } = useSheet();
    const { updateSheetMedia, deleteSheetMedia } = useActionsEditionSheet();

    return {
      pageSelected,
      setToolNameSelected,
      updateVisited,
      setInfoBar,
      setCurrentSheetId,
      currentUser,
      currentSection,
      savePrintEditScreen,
      getDataEditScreen,
      isOpenMenuProperties,
      setPropertyById,
      updateSavingStatus,
      sheetMedia,
      updateSheetMedia,
      deleteSheetMedia
    };
  },
  data() {
    return {
      dragItem: () => null,
      isOpenModal: false
    };
  },
  computed: {
    ...mapGetters({
      printThemeSelected: PRINT_GETTERS.DEFAULT_THEME_ID,
      selectedToolName: APP_GETTERS.SELECTED_TOOL_NAME,
      getObjectsAndBackground: PRINT_GETTERS.GET_OBJECTS_AND_BACKGROUNDS
    }),
    isShowAutoflow() {
      return !isEmpty(this.sheetMedia);
    },
    isOpenPhotoSidebar() {
      return this.selectedToolName === TOOL_NAME.PHOTOS;
    }
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
    next(async vm => {
      const bookId = to.params.bookId;

      const editionMainUrl = getEditionListPath(bookId, EDITION.PRINT);

      if (!isPositiveInteger(to.params?.sheetId)) {
        vm.$router.replace(editionMainUrl);

        return;
      }

      vm.setBookId({ bookId });

      // temporary code, will remove soon
      const info = await printService.getGeneralInfo();

      vm.setInfo({ ...info, bookId });

      await vm.getDataPageEdit();

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

      if (isEmpty(vm.printThemeSelected)) {
        vm.openSelectThemeModal();
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
    async onClickSavePrintCanvas() {
      this.updateSavingStatus({ status: SAVE_STATUS.START });
      const data = this.getDataEditScreen(this.pageSelected.id);
      await this.savePrintEditScreen(data);

      this.updateSavingStatus({ status: SAVE_STATUS.END });

      setTimeout(() => {
        this.$router.push(
          getEditionListPath(this.$route.params.bookId, EDITION.PRINT)
        );
      }, SAVING_DURATION);
    },

    /**
     * Fire when zoom is changed
     *
     * @param {Number} zoom  selected zoom value
     */
    onZoom({ zoom }) {
      this.setInfoBar({ zoom });
    },

    /**
     * Handle autoflow
     */
    handleAutoflow() {
      activeCanvas.discardActiveObject();
      const objects = getActivateImages();
      const images = this.sheetMedia || [];
      if (objects.length > images.length) {
        images.forEach((image, index) => {
          setImageSrc(objects[index], image.imageUrl, prop => {
            prop.imageId = image.id;
            this.setPropertyById({ id: objects[index].id, prop });
          });
        });
        return;
      }
      objects.forEach((object, index) => {
        setImageSrc(object, images[index].imageUrl, prop => {
          prop.imageId = images[index].id;
          this.setPropertyById({ id: object.id, prop });
        });
      });
    },
    /**
     * Selected images and save in sheet
     * @param   {Array}  images  selected images
     */
    async handleSelectedImages(images) {
      const reversedImages = images.reverse();
      await this.updateSheetMedia({ images: reversedImages });
    },
    /**
     * Close list photo in sidebar
     */
    closePhotoSidebar() {
      this.setToolNameSelected('');
    },

    /**
     * Handle remove photo from sheet
     * @param {Object} photo photo will be removed
     */
    onRemovePhoto(photo) {
      this.deleteSheetMedia({ id: photo.id });
    },

    /**
     * Handle drag photo from photo sidebar
     * @param {Object} item drag item
     */
    onDrag(item) {
      this.dragItem = item;
    },

    /**
     * Handle drop photo to canvas
     * @param {Object} target fabric object focused
     */
    onDrop({ target }) {
      if (!this.dragItem) return;

      const { imageUrl, id: imageId } = this.dragItem;

      if (target) {
        setImageSrc(target, imageUrl, prop => {
          prop.imageId = imageId;
          this.setPropertyById({ id: target.id, prop });
        });
      }

      this.dragItem = null;
    },
    /**
     * Use to open modal photos
     */
    openModalPhotos() {
      this.isOpenModal = true;
    },
    /**
     * Close modal photos when click cancel button
     */
    onCancel() {
      this.isOpenModal = false;
    }
  }
};
