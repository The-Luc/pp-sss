import PhotoSidebar from '@/components/Modals/PhotoSidebar';
import CropControl from '@/components/CropControl';

import EditorHeader from '@/containers/HeaderEdition/Header';
import FeedbackBar from '@/containers/HeaderEdition/FeedbackBar';
import MediaModal from '@/containers/Modals/Media';
import PortraitFolder from '@/containers/Modals/PortraitFolder';
import PortraitFlow from '@/containers/Modals/PortraitFlow/DigitalFlow';

import ToolBar from './ToolBar';
import ScreenEdition from './ScreenEdition';
import SidebarSection from './SidebarSection';
import ThePreviewModal from './Modals/ThePreviewModal';

import { mapGetters, mapMutations, mapActions } from 'vuex';

import { MUTATES } from '@/store/modules/app/const';
import {
  ACTIONS as DIGITAL_ACTIONS,
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
  DEFAULT_VIDEO,
  SHEET_TYPE,
  PROPERTIES_TOOLS,
  EVENT_TYPE
} from '@/common/constants';
import {
  useLayoutPrompt,
  usePopoverCreationTool,
  useMutationDigitalSheet,
  useUser,
  useGetterDigitalSection,
  useFrame,
  useInfoBar,
  useActionsEditionSheet,
  useSheet,
  useProperties,
  useObjectProperties,
  useToolBar,
  useBook,
  useAnimation,
  useObjects,
  useBackgroundProperties
} from '@/hooks';
import {
  isEmpty,
  isPositiveInteger,
  getEditionListPath,
  mergeArrayNonEmpty,
  getPageObjects,
  resetObjects,
  getUniqueId
} from '@/common/utils';
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
import { cloneDeep } from 'lodash';

export default {
  components: {
    ToolBar,
    EditorHeader,
    FeedbackBar,
    ScreenEdition,
    SidebarSection,
    PhotoSidebar,
    MediaModal,
    CropControl,
    PortraitFolder,
    ThePreviewModal,
    PortraitFlow
  },
  setup() {
    const { pageSelected, updateVisited } = useLayoutPrompt(EDITION.DIGITAL);
    const { setToolNameSelected } = usePopoverCreationTool();
    const { setCurrentSheetId } = useMutationDigitalSheet();
    const { currentUser } = useUser();
    const { currentSection } = useGetterDigitalSection();
    const {
      currentFrameId,
      updateFrameObjects,
      setFrames,
      setCurrentFrameId
    } = useFrame();
    const {
      saveEditScreen,
      getDataEditScreen,
      saveAnimationConfig,
      saveSheetFrames
    } = useSaveData();
    const { updateSavingStatus } = useSavingStatus();
    const { getBookDigitalInfo } = useBookDigitalInfo();
    const { setInfoBar } = useInfoBar();
    const { updateSheetMedia, deleteSheetMedia } = useActionsEditionSheet();
    const { sheetMedia, currentSheet, getSheets } = useSheet();
    const { setPropertyById, setPropOfMultipleObjects } = useProperties();
    const { listObjects } = useObjectProperties();
    const {
      isMediaSidebarOpen,
      updateMediaSidebarOpen,
      disabledToolbarItems
    } = useToolBar();
    const { frames } = useFrame();

    const { setBookId } = useBook();

    const { storeAnimationProp } = useAnimation();

    const { addObjecs, deleteObjects } = useObjects();

    const { backgroundsProps } = useBackgroundProperties();

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
      deleteSheetMedia,
      sheetMedia,
      setPropertyById,
      setPropOfMultipleObjects,
      listObjects,
      isMediaSidebarOpen,
      updateMediaSidebarOpen,
      disabledToolbarItems,
      currentSheet,
      frames,
      setBookId,
      storeAnimationProp,
      saveAnimationConfig,
      addObjecs,
      deleteObjects,
      setFrames,
      setCurrentFrameId,
      getSheets,
      saveSheetFrames,
      backgroundsProps
    };
  },
  data() {
    return {
      isOpenModal: false,
      isOpenCropControl: false,
      dragItem: null,
      selectedImage: null,
      toolNames: TOOL_NAME,
      modalType: MODAL_TYPES,
      modal: {
        [MODAL_TYPES.TRANSITION_PREVIEW]: {
          isOpen: false,
          data: {}
        },
        [TOOL_NAME.PORTRAIT]: {
          isOpen: false
        },
        [MODAL_TYPES.PORTRAIT_FLOW]: {
          isOpen: false,
          data: {}
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      defaultThemeId: DIGITAL_GETTERS.DEFAULT_THEME_ID
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
    disabledItems() {
      const transition =
        this.frames.length > 1 ? '' : PROPERTIES_TOOLS.TRANSITION.name;
      const portrait =
        this.currentSheet.type === SHEET_TYPE.COVER ? TOOL_NAME.PORTRAIT : '';

      return mergeArrayNonEmpty(this.disabledToolbarItems, [
        transition,
        portrait
      ]);
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

      vm.setBookId({ bookId });

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
  mounted() {
    this.handleEventListeners();
  },
  destroyed() {
    this.handleEventListeners(false);

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
      await this.saveAnimationConfig(this.storeAnimationProp);

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
    onRemovePhoto(media) {
      this.deleteSheetMedia({ id: media.id });
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

      target.set({
        originalUrl: imageUrl,
        cropInfo: null,
        fromPortrait: false
      });

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
      const canvas = this.$refs.canvasEditor.digitalCanvas;
      const activeObject = canvas.getActiveObject();
      this.selectedImage = activeObject;
      this.isOpenCropControl = true;
    },
    /**
     * Close portrait modal
     */
    onClosePortrait() {
      this.onToggleModal({ modal: TOOL_NAME.PORTRAIT });
      this.setToolNameSelected('');
    },
    /**
     * Selected portrait folders
     *
     * @param {Array}  folders  portrait folders
     */
    onSelectPortraitFolders(folders) {
      this.onClosePortrait();

      this.modal[MODAL_TYPES.PORTRAIT_FLOW].data = { folders };

      this.onToggleModal({ modal: MODAL_TYPES.PORTRAIT_FLOW });
    },
    /**
     * Handle adding & removing events
     * @param {Boolean} isOn if need to set event
     */
    handleEventListeners(isOn = true) {
      const modalEvents = [
        {
          name: EVENT_TYPE.TRANSITION_PREVIEW,
          handler: this.previewTransition
        }
      ];

      const events = [...modalEvents];

      events.forEach(event => {
        this.$root.$off(event.name, event.handler);

        if (isOn) this.$root.$on(event.name, event.handler);
      });
    },
    /**
     * Open Preview Transition modal with data
     *
     * @param {Number}          transition  selected transition type
     * @param {Number | String} direction   selected direction type
     * @param {Number | String} duration    selected duration type
     * @param {String}          previewUrl1 url of 1st preview image
     * @param {String}          previewUrl2 url of 2nd preview image
     */
    previewTransition({
      transition,
      direction,
      duration,
      previewUrl1,
      previewUrl2
    }) {
      this.modal[MODAL_TYPES.TRANSITION_PREVIEW].data = {
        transition,
        direction,
        duration,
        previewUrl1,
        previewUrl2
      };

      this.onToggleModal({ modal: MODAL_TYPES.TRANSITION_PREVIEW });
    },
    /**
     * Toggle modal
     *
     * @param {String}  modal     name of modal
     * @param {Boolean} isToggle  is toggle modal or not
     * @param {Boolean} isOpen    if not toggle, open or hide modal
     */
    onToggleModal({ modal, isToggle = true, isOpen = true }) {
      Object.keys(this.modal).forEach(k => {
        if (k !== modal) this.modal[k].isOpen = false;
      });

      if (isEmpty(modal)) return;

      this.modal[modal].isOpen = isToggle ? !this.modal[modal].isOpen : isOpen;
    },

    /**
     * Apply portrait to page
     * @param {Object} settings config for portrait
     * @param {Object} requiredPages pages to apply portraits
     */
    async onApplyPortrait(settings, requiredPages) {
      const sheets = Object.values(this.getSheets).reduce((obj, sheet) => {
        const key = Number(sheet.pageName);
        obj[key] = sheet;
        return obj;
      }, {});

      const requiredScreens = requiredPages.reduce((obj, { screen, frame }) => {
        const key = sheets[screen].id;
        if (!obj[key]) obj[key] = [];
        obj[key].push(frame);
        return obj;
      }, {});

      Object.keys(requiredScreens).forEach(screenId => {
        const requiredFrames = requiredScreens[screenId];

        if (isEmpty(requiredFrames)) return;

        const pages = getPageObjects(settings, requiredFrames, true);

        const canvas = this.$refs.canvasEditor.digitalCanvas;

        const frames =
          +screenId === this.pageSelected.id
            ? cloneDeep(this.frames)
            : cloneDeep(this.getSheets[screenId].frames);

        const framesList = this.getRequiredFramesData(frames, pages);

        if (+screenId !== +this.pageSelected.id) {
          return this.saveSheetFrames(screenId, framesList);
        }

        const currentId = this.currentFrameId;
        const ids = Object.keys(this.listObjects);

        this.setFrames({ framesList: [] });

        const currentFrame = framesList.find(f => +f.id === +currentId);

        const {
          id,
          frame: { objects }
        } = currentFrame || framesList[0];

        this.deleteObjects({ ids });

        this.addObjecs({
          objects: objects.map(obj => ({ id: obj.id, newObject: obj }))
        });

        this.setFrames({ framesList });

        this.setCurrentFrameId({ id });

        resetObjects(canvas);

        this.$refs.canvasEditor.drawObjectsOnCanvas(objects);

        canvas.renderAll();
      });

      this.onToggleModal({ modal: '' });
      this.setToolNameSelected('');
    },

    getRequiredFramesData(currentFrames, requiredFrames) {
      Array.from({
        length: Math.max(...Object.keys(requiredFrames))
      }).forEach((_, index) => {
        const objects = requiredFrames[index + 1] || [];
        if (!currentFrames[index]) {
          const blankFrame = {
            id: getUniqueId(),
            frame: {
              previewImageUrl: '',
              id: 0,
              fromLayout: false,
              frameTitle: '',
              objects,
              isVisited: true
            }
          };

          return currentFrames.push(blankFrame);
        }

        if (isEmpty(objects)) return;

        const background = currentFrames[index].frame.objects.find(
          obj => obj.type === OBJECT_TYPE.BACKGROUND
        );

        if (!isEmpty(background)) objects.unshift(background);

        currentFrames[index].frame.objects = objects;
      });

      return currentFrames;
    },
    /**
     * Cancel apply warning modal
     */
    onCancelApplyPortrait() {
      this.onToggleModal({ modal: MODAL_TYPES.PORTRAIT_FLOW });
      this.setToolNameSelected(TOOL_NAME.PORTRAIT);
    }
  }
};
