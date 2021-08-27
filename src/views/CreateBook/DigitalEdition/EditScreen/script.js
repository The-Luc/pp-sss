import PhotoSidebar from '@/components/Modals/PhotoSidebar';
import SheetMedia from '@/components/Modals/PhotoSidebar/SheetMedia';
import CropControl from '@/components/CropControl';

import Header from '@/containers/HeaderEdition/Header';
import FeedbackBar from '@/containers/HeaderEdition/FeedbackBar';
import MediaModal from '@/containers/Modals/Media';

import ToolBar from './ToolBar';
import ScreenEdition from './ScreenEdition';
import SidebarSection from './SidebarSection';

import { mapGetters, mapMutations, mapActions } from 'vuex';

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
  SAVING_DURATION,
  OBJECT_TYPE,
  DEFAULT_VIDEO
} from '@/common/constants';
import {
  useLayoutPrompt,
  usePopoverCreationTool,
  useMutationDigitalSheet,
  useUser,
  useGetterDigitalSheet,
  useFrame,
  useInfoBar,
  useActionsEditionSheet,
  useSheet,
  useProperties,
  useObjectProperties,
  useToolBar
} from '@/hooks';
import { isEmpty, isPositiveInteger, getEditionListPath } from '@/common/utils';
import { COPY_OBJECT_KEY } from '@/common/constants/config';

import { useSaveData } from './composables';
import { useSavingStatus } from '../../composables';
import { useBookDigitalInfo } from './composables';

import {
  handleChangeMediaSrc,
  getAvailableImages,
  setImageSrc,
  setVideoSrc
} from '@/common/fabricObjects';

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
    const { setInfoBar } = useInfoBar();
    const { updateSheetMedia } = useActionsEditionSheet();
    const { sheetMedia } = useSheet();
    const { setPropertyById, setPropOfMultipleObjects } = useProperties();
    const { listObjects } = useObjectProperties();
    const { isMediaSidebarOpen, updateMediaSidebarOpen } = useToolBar();

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
      getBookDigitalInfo,
      setInfoBar,
      updateSheetMedia,
      sheetMedia,
      setPropertyById,
      setPropOfMultipleObjects,
      listObjects,
      isMediaSidebarOpen,
      updateMediaSidebarOpen
    };
  },
  data() {
    return {
      isOpenModal: false,
      isOpenCropControl: false,
      dragItem: null,
      selectedImage: null
    };
  },
  components: {
    ToolBar,
    Header,
    FeedbackBar,
    ScreenEdition,
    SidebarSection,
    PhotoSidebar,
    MediaModal,
    SheetMedia,
    CropControl
  },
  computed: {
    ...mapGetters({
      isOpenMenuProperties: GETTERS.IS_OPEN_MENU_PROPERTIES,
      selectedToolName: GETTERS.SELECTED_TOOL_NAME,
      defaultThemeId: DIGITAL_GETTERS.DEFAULT_THEME_ID
    }),
    isShowAutoflow() {
      return !isEmpty(this.sheetMedia);
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
      this.updateMediaSidebarOpen({ isOpen: false });
    },
    /**
     * Handle autoflow
     */
    async handleAutoflow() {
      const canvas = this.$refs.canvasEditor.digitalCanvas;
      canvas.discardActiveObject();

      const objects = getAvailableImages();
      const media = this.sheetMedia || [];

      const promises = Array.from(
        { length: Math.min(media.length, objects.length) },
        (_, index) =>
          handleChangeMediaSrc(
            objects[index],
            media[index],
            this.$refs.canvasEditor.videoStop
          )
      );

      const props = await Promise.all(promises);

      canvas.renderAll();

      this.$refs.canvasEditor.getThumbnailUrl();

      this.setPropOfMultipleObjects({ data: props });
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

      if (this.isOpenCropControl) {
        this.isOpenCropControl = false;
        this.selectedImage.set({
          showControl: false
        });

        this.selectedImage.canvas.renderAll();
      }
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
     * Selected media and save in sheet
     * @param   {Array}  media  selected media
     */
    async handleSelectedMedia(media) {
      const reversedMedia = media.reverse();
      await this.updateSheetMedia({ media: reversedMedia });
    },
    /**
     * Switching tool on Creation Tool by emit
     *
     * @param {String}  toolName  name of tool
     */
    onToolSwitch(toolName) {
      this.$refs.canvasEditor.onSwitchTool(toolName);
    },
    /**
     * Stop instruction by emit
     */
    onInstructionEnd() {
      this.$refs.canvasEditor.endInstruction();
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
     * Handle remove photo from sheet
     * @param {Object} photo photo will be removed
     */
    onRemovePhoto(photo) {
      console.log('remove photo', photo);
    },

    /**
     * Handle drag photo from photo sidebar
     * @param {Object} item drag item
     */
    onDrag(item) {
      this.dragItem = item;
      this.$refs.canvasEditor.digitalCanvas.discardActiveObject();
    },

    /**
     * Handle drop photo to canvas
     * @param {Object} event - Event drop to canvas
     */
    async onDrop(event) {
      if (!this.dragItem) return;

      const {
        imageUrl,
        id: imageId,
        originalWidth,
        originalHeight,
        offsetX,
        offsetY,
        mediaUrl,
        thumbUrl,
        type
      } = this.dragItem;

      const target = event.target;
      const pointer = this.$refs.canvasEditor.digitalCanvas.getPointer(event.e);

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
            src: mediaUrl || imageUrl,
            type,
            thumbUrl
          }
        );

        return;
      }

      const prop = mediaUrl
        ? await setVideoSrc(
            target,
            mediaUrl,
            thumbUrl,
            this.$refs.canvasEditor.videoToggleStatus
          )
        : await setImageSrc(target, imageUrl);

      prop.imageId = imageId;
      prop.originalUrl = imageUrl;

      target.set({ originalUrl: imageUrl, cropInfo: null });

      if (mediaUrl) prop.volume = DEFAULT_VIDEO.VOLUME;

      this.setPropertyById({ id: target.id, prop });

      this.$refs.canvasEditor.getThumbnailUrl();

      this.$refs.canvasEditor.digitalCanvas.setActiveObject(target);

      setTimeout(() => {
        this.$refs.canvasEditor.digitalCanvas.renderAll();
      }, 250);
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
      const canvas = this.$refs.canvasEditor.digitalCanvas;
      const activeObject = canvas.getActiveObject();
      this.selectedImage = activeObject;
      this.isOpenCropControl = true;
    }
  }
};
