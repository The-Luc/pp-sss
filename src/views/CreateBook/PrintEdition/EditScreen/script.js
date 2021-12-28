import PhotoSidebar from '@/components/Modals/PhotoSidebar';
import CropControl from '@/components/CropControl';

import EditorHeader from '@/containers/HeaderEdition/Header';
import FeedbackBar from '@/containers/HeaderEdition/FeedbackBar';
import MediaModal from '@/containers/Modals/Media';
import PortraitFlow from '@/containers/Modals/PortraitFlow/PrintFlow';
import PortraitFolder from '@/containers/Modals/PortraitFolder';

import ToolBar from './ToolBar';
import SidebarSection from './SidebarSection';
import PageEdition from './PageEdition';

import { mapMutations, mapGetters } from 'vuex';

import { MUTATES } from '@/store/modules/app/const';
import { MUTATES as BOOK_MUTATES } from '@/store/modules/book/const';
import {
  MUTATES as PRINT_MUTATES,
  GETTERS as PRINT_GETTERS
} from '@/store/modules/print/const';
import {
  MODAL_TYPES,
  OBJECT_TYPE,
  SAVE_STATUS,
  SAVING_DURATION,
  SHEET_TYPE,
  TOOL_NAME,
  EDITION,
  ROLE
} from '@/common/constants';
import {
  useLayoutPrompt,
  usePopoverCreationTool,
  useInfoBar,
  useMutationPrintSheet,
  useUser,
  useProperties,
  useSheet,
  useActionsEditionSheet,
  useObjectProperties,
  useToolBar,
  useObjects,
  useBackgroundProperties,
  usePortrait,
  useAppCommon
} from '@/hooks';
import {
  isEmpty,
  getEditionListPath,
  mergeArrayNonEmpty,
  resetObjects,
  isOk,
  seperateSheetObjectsIntoPages,
  mergeArray
} from '@/common/utils';

import { useSaveData } from './PageEdition/composables';
import {
  handleChangeMediaSrc,
  getAvailableImages,
  setImageSrc
} from '@/common/fabricObjects';
import { useSavingStatus } from '../../composables';
import { useBookPrintInfo } from './composables';
import { getPageObjects } from '@/common/utils/portrait';

export default {
  components: {
    ToolBar,
    EditorHeader,
    FeedbackBar,
    PageEdition,
    SidebarSection,
    PhotoSidebar,
    MediaModal,
    CropControl,
    PortraitFlow,
    PortraitFolder
  },
  setup() {
    const { setLoadingState, generalInfo } = useAppCommon();

    const { pageSelected, updateVisited } = useLayoutPrompt(EDITION.PRINT);
    const { setToolNameSelected } = usePopoverCreationTool();
    const { setInfoBar } = useInfoBar();
    const { setCurrentSheetId } = useMutationPrintSheet();
    const { currentUser, authenticate } = useUser();
    const {
      savePrintEditScreen,
      getDataEditScreen,
      savePortraitObjects
    } = useSaveData();
    const { setPropertyById, setPropOfMultipleObjects } = useProperties();
    const { updateSavingStatus } = useSavingStatus();
    const { currentSheet, getSheets } = useSheet();
    const { updateSheetMedia, getMedia } = useActionsEditionSheet();
    const { getBookPrintInfo } = useBookPrintInfo();
    const { listObjects } = useObjectProperties();
    const {
      isMediaSidebarOpen,
      updateMediaSidebarOpen,
      disabledToolbarItems
    } = useToolBar();

    const { addObjecs, deleteObjects } = useObjects();

    const { backgroundsProps } = useBackgroundProperties();

    const { saveSelectedPortraitFolders } = usePortrait();

    return {
      pageSelected,
      setToolNameSelected,
      updateVisited,
      setInfoBar,
      setCurrentSheetId,
      currentUser,
      authenticate,
      savePrintEditScreen,
      getDataEditScreen,
      setPropertyById,
      updateSavingStatus,
      updateSheetMedia,
      getBookPrintInfo,
      listObjects,
      setPropOfMultipleObjects,
      isMediaSidebarOpen,
      updateMediaSidebarOpen,
      disabledToolbarItems,
      currentSheet,
      getSheets,
      savePortraitObjects,
      addObjecs,
      deleteObjects,
      backgroundsProps,
      saveSelectedPortraitFolders,
      setLoadingState,
      getMedia,
      generalInfo
    };
  },
  data() {
    return {
      dragItem: null,
      isOpenMediaModal: false,
      isOpenCropControl: false,
      selectedImage: null,
      sheetMedia: [],
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
        obj => obj?.type === OBJECT_TYPE.IMAGE && !obj.hasImage
      );

      return !hasEmptyImage;
    },
    isAdmin() {
      return this.currentUser.role === ROLE.ADMIN;
    },
    disabledItems() {
      const portrait =
        this.currentSheet.type === SHEET_TYPE.COVER || !this.isAdmin
          ? TOOL_NAME.PORTRAIT
          : '';

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
    },
    isMediaSidebarOpen: {
      async handler(val) {
        if (val) this.sheetMedia = await this.getMedia();
      }
    }
  },
  beforeRouteEnter(to, _, next) {
    next(async vm => {
      const bookId = to.params?.bookId;
      const sheetId = to.params?.sheetId;

      const authenticateResult = await vm.authenticate(bookId, sheetId);

      const editionMainUrl = getEditionListPath(bookId, EDITION.PRINT);

      if (!isOk(authenticateResult)) {
        vm.$router.replace(editionMainUrl);

        return;
      }

      await vm.getBookPrintInfo(bookId);

      vm.setCurrentSheetId({ id: parseInt(sheetId) });

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
          getEditionListPath(this.generalInfo.bookId, EDITION.PRINT)
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
      const newImages = mergeArray([...images].reverse(), this.sheetMedia);

      const { media, isSuccess } = await this.updateSheetMedia(newImages);

      if (isSuccess) this.sheetMedia = media;
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
    async onRemovePhoto(photo) {
      const newImages = this.sheetMedia.filter(m => m.id !== photo.id);

      const { media, isSuccess } = await this.updateSheetMedia(newImages);
      if (isSuccess) this.sheetMedia = media;
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
     * Handle drop media to canvas
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

      const { height, width, zoom } = this.$refs.canvasEditor.canvasSize;

      const canvasHeight = height / zoom;
      const canvasWidth = width / zoom;

      const ratio = Math.max(
        originalHeight / canvasHeight,
        originalWidth / canvasWidth,
        1
      );

      // set media dimension to fix in the canvas
      const imgHeight = originalHeight / ratio;
      const imgWidth = originalWidth / ratio;

      const pointer = this.$refs.canvasEditor.printCanvas.getPointer(event.e);

      this.dragItem = null;

      const isImage = target?.objectType === OBJECT_TYPE.IMAGE;
      const isVideo = target?.objectType === OBJECT_TYPE.VIDEO;

      if (!target || (!isImage && !isVideo)) {
        const x = pointer.x - offsetX * 3;
        const y = pointer.y - offsetY * 3;

        this.$refs.canvasEditor.addImageBox(x, y, imgWidth, imgHeight, {
          src: imageUrl
        });

        return;
      }

      this.setLoadingState({ value: true });

      const prop = await setImageSrc(target, imageUrl);

      prop.imageId = imageId;
      prop.originalUrl = imageUrl;

      target.set({
        originalUrl: imageUrl,
        cropInfo: null,
        fromPortrait: false
      });

      this.setPropertyById({ id: target.id, prop });
      this.$refs.canvasEditor.getThumbnailUrl();
      this.$refs.canvasEditor.printCanvas.setActiveObject(target);

      setTimeout(() => {
        this.$refs.canvasEditor.printCanvas.renderAll();

        this.setLoadingState({ value: false });
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
      prop.fromPortrait = false;
      this.selectedImage.set({ cropInfo, fromPortrait: false });
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
     * @param {Object} settings config for portrait
     * @param {Array} requiredPages pages to apply portraits
     */
    async onApplyPortrait(settings, requiredPages) {
      const pages = getPageObjects(settings, requiredPages);

      const saveQueue = [];

      this.setLoadingState({ value: true });

      Object.values(this.getSheets).forEach(sheet => {
        const leftPageNumber = +sheet?.pageLeftName;
        const rightPageNumber = +sheet?.pageRightName;

        const leftObjects = pages[leftPageNumber] || [];
        const rightObjects = pages[rightPageNumber] || [];

        const objects = [...leftObjects, ...rightObjects];

        if (isEmpty(objects)) return;

        this.updateVisited({ sheetId: sheet.id });

        const appliedPage = {
          isLeft: !isEmpty(leftObjects),
          isRight: !isEmpty(rightObjects)
        };
        const saveObjetcs = this.savePortraitObjects(
          sheet.id,
          objects,
          appliedPage
        );

        saveQueue.push(saveObjetcs);

        if (sheet.id !== this.pageSelected.id) return;

        const canvas = this.$refs.canvasEditor.printCanvas;
        const sheetObjectArray = Object.values(this.listObjects);

        const {
          leftPageObjects: storeObjectLeft,
          rightPageObjects: storeObjectRight
        } = seperateSheetObjectsIntoPages(sheetObjectArray);

        const removeObject = [
          ...(appliedPage.isLeft ? storeObjectLeft : []),
          ...(appliedPage.isRight ? storeObjectRight : [])
        ];

        const ids = removeObject.map(o => o.id);

        resetObjects(canvas);

        this.deleteObjects({ ids });

        this.addObjecs({
          objects: objects.map(obj => ({ id: obj.id, newObject: obj }))
        });

        this.$refs.canvasEditor.drawLayout();
      });

      await Promise.all(saveQueue);

      this.setLoadingState({ value: false });

      const selectedFolderIds = this.selectedFolders.map(item => item.id);

      this.saveSelectedPortraitFolders(
        this.generalInfo.bookId,
        selectedFolderIds
      );
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
