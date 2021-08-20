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
  OBJECT_TYPE,
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
import MediaModal from '@/containers/Modal/Media';

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
  useActionsEditionSheet,
  useObjectProperties
} from '@/hooks';
import { EDITION } from '@/common/constants';
import {
  isEmpty,
  isPositiveInteger,
  getEditionListPath,
  activeCanvas
} from '@/common/utils';

import { useSaveData } from './PageEdition/composables';
import {
  handleChangeMediaSrc,
  getAvailableImages,
  setImageSrc
} from '@/common/fabricObjects';
import { useSavingStatus } from '../../composables';
import { useBookPrintInfo } from './composables';

export default {
  components: {
    ToolBar,
    Header,
    FeedbackBar,
    PageEdition,
    SidebarSection,
    PhotoSidebar,
    SheetMedia,
    MediaModal
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
    const { setPropertyById, setPropOfMultipleObjects } = useProperties();
    const { updateSavingStatus } = useSavingStatus();
    const { sheetMedia } = useSheet();
    const { updateSheetMedia, deleteSheetMedia } = useActionsEditionSheet();
    const { getBookPrintInfo } = useBookPrintInfo();
    const { listObjects } = useObjectProperties();

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
      deleteSheetMedia,
      getBookPrintInfo,
      listObjects,
      setPropOfMultipleObjects
    };
  },
  data() {
    return {
      dragItem: () => null,
      isOpenMediaModal: false
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
    },
    disabledAutoflow() {
      const hasEmptyImage = Object.values(this.listObjects).some(
        obj => obj.type === OBJECT_TYPE.IMAGE && !obj.hasImage
      );

      return !hasEmptyImage;
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

      await vm.getBookPrintInfo(bookId);

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
      toggleModal: MUTATES.TOGGLE_MODAL,
      resetPrintConfigs: MUTATES.RESET_PRINT_CONFIG,
      savePrintCanvas: BOOK_MUTATES.SAVE_PRINT_CANVAS,
      setPropertiesObjectType: MUTATES.SET_PROPERTIES_OBJECT_TYPE,
      setThumbnail: PRINT_MUTATES.UPDATE_SHEET_THUMBNAIL
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
    async handleAutoflow() {
      activeCanvas.discardActiveObject();

      const objects = getAvailableImages();
      const images = this.sheetMedia || [];

      const promises = Array.from(
        { length: Math.min(images.length, objects.length) },
        (_, index) => handleChangeMediaSrc(objects[index], images[index])
      );

      const props = await Promise.all(promises);

      activeCanvas.renderAll();
      this.$refs.canvasEditor.getThumbnailUrl();

      this.setPropOfMultipleObjects({ data: props });
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
      activeCanvas.discardActiveObject();
    },

    /**
     * Handle drop photo to canvas
     * @param {Object} event fabric object focused
     */
    async onDrop(event) {
      if (!this.dragItem) return;

      const {
        imageUrl,
        id: imageId,
        originalWidth,
        originalHeight,
        offsetX,
        offsetY
      } = this.dragItem;

      const target = event.target;
      const pointer = activeCanvas.getPointer(event.e);

      this.dragItem = null;

      const isImage = target?.objectType === OBJECT_TYPE.IMAGE;
      const isVideo = target?.objectType === OBJECT_TYPE.VIDEO;

      if (!target || (!isImage && !isVideo)) {
        const x = pointer.x - offsetX * 3;
        const y = pointer.y - offsetY * 3;

        this.$refs.canvasEditor.addImageBox(
          x,
          y,
          originalWidth,
          originalHeight,
          {
            src: imageUrl
          }
        );

        return;
      }

      const prop = await setImageSrc(target, imageUrl);
      prop.imageId = imageId;
      this.setPropertyById({ id: target.id, prop });
      this.$refs.canvasEditor.getThumbnailUrl();

      activeCanvas.setActiveObject(target);
      activeCanvas.renderAll();
    },
    /**
     * Undo user action
     */
    onUndo() {
      this.$refs.canvasEditor.undo();
    },
    /**
     * Redo user action
     */
    onRedo() {
      this.$refs.canvasEditor.redo();
    },
    /**
     * Use to open modal photos
     */
    openModalPhotos() {
      this.isOpenMediaModal = true;
    },
    /**
     * Close modal photos when click cancel button
     */
    onCancelMediaModal() {
      this.isOpenMediaModal = false;
    },
    /**
     * Switching tool on Creation Tool by emit
     *
     * @param {String}  toolName  name of tool
     */
    onToolSwitch(toolName) {
      this.$refs.canvasEditor.switchTool(toolName);
    },
    /**
     * Stop instruction by emit
     */
    onInstructionEnd() {
      this.$refs.canvasEditor.endInstruction();
    }
  }
};
