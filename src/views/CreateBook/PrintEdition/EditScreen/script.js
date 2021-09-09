import PhotoSidebar from '@/components/Modals/PhotoSidebar';
import CropControl from '@/components/CropControl';

import Header from '@/containers/HeaderEdition/Header';
import FeedbackBar from '@/containers/HeaderEdition/FeedbackBar';
import MediaModal from '@/containers/Modals/Media';
import PortraiFlow from '@/containers/Modals/PortraitFlow';
import PortraitFolder from '@/containers/Modals/PortraitFolder';

import ToolBar from './ToolBar';
import SidebarSection from './SidebarSection';
import PageEdition from './PageEdition';

import { mapMutations, mapGetters, mapActions } from 'vuex';

import { MUTATES } from '@/store/modules/app/const';
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
  SHEET_TYPE,
  TOOL_NAME
} from '@/common/constants';
import {
  useLayoutPrompt,
  usePopoverCreationTool,
  useInfoBar,
  useMutationPrintSheet,
  useUser,
  useGetterPrintSection,
  useProperties,
  useSheet,
  useActionsEditionSheet,
  useObjectProperties,
  useToolBar
} from '@/hooks';
import { EDITION } from '@/common/constants';
import {
  isEmpty,
  isPositiveInteger,
  getEditionListPath,
  mergeArrayNonEmpty
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
    MediaModal,
    CropControl,
    PortraiFlow,
    PortraitFolder
  },
  setup() {
    const { pageSelected, updateVisited } = useLayoutPrompt(EDITION.PRINT);
    const { setToolNameSelected } = usePopoverCreationTool();
    const { setInfoBar } = useInfoBar();
    const { setCurrentSheetId } = useMutationPrintSheet();
    const { currentUser } = useUser();
    const { currentSection } = useGetterPrintSection();
    const { savePrintEditScreen, getDataEditScreen } = useSaveData();
    const { setPropertyById, setPropOfMultipleObjects } = useProperties();
    const { updateSavingStatus } = useSavingStatus();
    const { sheetMedia, currentSheet } = useSheet();
    const { updateSheetMedia, deleteSheetMedia } = useActionsEditionSheet();
    const { getBookPrintInfo } = useBookPrintInfo();
    const { listObjects } = useObjectProperties();
    const {
      isMediaSidebarOpen,
      updateMediaSidebarOpen,
      disabledToolbarItems
    } = useToolBar();

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
      setPropertyById,
      updateSavingStatus,
      sheetMedia,
      updateSheetMedia,
      deleteSheetMedia,
      getBookPrintInfo,
      listObjects,
      setPropOfMultipleObjects,
      isMediaSidebarOpen,
      updateMediaSidebarOpen,
      disabledToolbarItems,
      currentSheet
    };
  },
  data() {
    return {
      dragItem: null,
      isOpenMediaModal: false,
      isOpenCropControl: false,
      selectedImage: null,
      modalDisplay: {
        [TOOL_NAME.PORTRAIT]: false,
        portaitFlow: false
      },
      toolNames: TOOL_NAME,
      selectedFolders: []
    };
  },
  computed: {
    ...mapGetters({
      printThemeSelected: PRINT_GETTERS.DEFAULT_THEME_ID
    }),
    isShowAutoflow() {
      return !isEmpty(this.sheetMedia);
    },
    disabledAutoflow() {
      const hasEmptyImage = Object.values(this.listObjects).some(
        obj => obj.type === OBJECT_TYPE.IMAGE && !obj.hasImage
      );

      return !hasEmptyImage;
    },
    disabledItems() {
      const portrait =
        this.currentSheet.type === SHEET_TYPE.COVER ? TOOL_NAME.PORTRAIT : '';

      return mergeArrayNonEmpty(this.disabledToolbarItems, [portrait]);
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
      const canvas = this.$refs.canvasEditor.printCanvas;
      canvas.discardActiveObject();

      const objects = getAvailableImages();
      const images = this.sheetMedia || [];

      const promises = Array.from(
        { length: Math.min(images.length, objects.length) },
        (_, index) => handleChangeMediaSrc(objects[index], images[index])
      );

      const props = await Promise.all(promises);

      canvas.renderAll();
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
      this.updateMediaSidebarOpen({ isOpen: false });
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
      this.$refs.canvasEditor.printCanvas.discardActiveObject();
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
      const pointer = this.$refs.canvasEditor.printCanvas.getPointer(event.e);

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
      prop.originalUrl = imageUrl;

      target.set({ originalUrl: imageUrl, cropInfo: null });

      this.setPropertyById({ id: target.id, prop });
      this.$refs.canvasEditor.getThumbnailUrl();
      this.$refs.canvasEditor.printCanvas.setActiveObject(target);

      setTimeout(() => {
        this.$refs.canvasEditor.printCanvas.renderAll();
      }, 250);
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
    onCancel() {
      this.isOpenMediaModal = false;

      if (!this.isOpenCropControl) return;

      this.isOpenCropControl = false;
      this.selectedImage.set({
        showControl: false
      });

      this.selectedImage.canvas.renderAll();
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
    },

    /**
     * Handle after crop image
     * @param {String} value Result image url after croppeed
     */
    async onCrop(value, cropInfo) {
      const prop = await setImageSrc(this.selectedImage, value);
      prop.cropInfo = cropInfo;
      this.selectedImage.set({ cropInfo });
      this.setPropertyById({ id: this.selectedImage.id, prop });
      this.$refs.canvasEditor.getThumbnailUrl();
      this.onCancel();
    },

    /**
     * Open modal crop control
     */
    openCropControl() {
      const canvas = this.$refs.canvasEditor.printCanvas;
      const activeObject = canvas.getActiveObject();
      this.selectedImage = activeObject;
      this.isOpenCropControl = true;
    },
    onToggleModal({ name, isToggle }) {
      if (isEmpty(name)) {
        Object.values(this.modalDisplay).forEach(m => {
          this.modalDisplay[m] = false;
        });

        return;
      }

      this.modalDisplay[name] = isToggle ? !this.modalDisplay[name] : true;
    },
    /**
     * Close portrait modal
     */
    onClosePortrait() {
      this.modalDisplay[TOOL_NAME.PORTRAIT] = false;
      this.modalDisplay.portaitFlow = false;
      this.setToolNameSelected('');
    },
    /**
     * Apply portrait to page
     */
    onApplyPortrait() {
      console.log('onApplyPortrait');
    },
    /**
     * Selected portrait folders
     * @param {Array}  folders  portrait folders
     */
    onSelectPortraitFolders(folders) {
      this.selectedFolders = folders;
      this.modalDisplay[TOOL_NAME.PORTRAIT] = false;
      this.modalDisplay.portaitFlow = true;
    }
  }
};
