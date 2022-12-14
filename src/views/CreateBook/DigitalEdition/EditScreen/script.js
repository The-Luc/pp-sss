import { cloneDeep, debounce } from 'lodash';

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
import TransitionPreview from './Modals/TheTransitionPreview';
import Playback from './Modals/ThePlayback';

import { mapGetters, mapMutations } from 'vuex';

import { MUTATES } from '@/store/modules/app/const';
import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';
import {
  EDITION,
  MODAL_TYPES,
  TOOL_NAME,
  SAVE_STATUS,
  SAVING_DURATION,
  OBJECT_TYPE,
  DEFAULT_VIDEO,
  SHEET_TYPE,
  PROPERTIES_TOOLS,
  EVENT_TYPE,
  PLAYBACK,
  ROLE
} from '@/common/constants';
import {
  useLayoutPrompt,
  usePopoverCreationTool,
  useMutationDigitalSheet,
  useUser,
  useFrame,
  useInfoBar,
  useSheet,
  useProperties,
  useObjectProperties,
  useToolBar,
  useObjects,
  useBackgroundProperties,
  usePortrait,
  useActionDigitalSheet,
  useAppCommon,
  useFrameAction,
  useMediaObjects,
  useFrameOrdering,
  useMappingSheet
} from '@/hooks';

import { useSavingStatus, useThumbnail, usePhotos } from '../../composables';
import { useSaveData, useBookDigitalInfo } from './composables';

import {
  handleChangeMediaSrc,
  getAvailableImages,
  setImageSrc,
  setVideoSrc
} from '@/common/fabricObjects';

import {
  isEmpty,
  getEditionListPath,
  mergeArrayNonEmpty,
  getPageObjects,
  resetObjects,
  isOk,
  mergeArray,
  isVideoPlaying
} from '@/common/utils';

import { FrameDetail } from '@/common/models';

import { COPY_OBJECT_KEY } from '@/common/constants/config';
import { updateInProjectApi } from '@/api/savePrint';

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
    TransitionPreview,
    PortraitFlow,
    Playback
  },
  setup() {
    const { setLoadingState, generalInfo } = useAppCommon();

    const { pageSelected, updateVisited } = useLayoutPrompt(EDITION.DIGITAL);
    const { setToolNameSelected } = usePopoverCreationTool();
    const {
      setCurrentSheetId,
      updateSheetThumbnail
    } = useMutationDigitalSheet();
    const { currentUser, authenticate } = useUser();
    const {
      currentFrameId,
      updateFrameObjects,
      setFrames,
      setCurrentFrameId,
      frames,
      clearAllFrames
    } = useFrame();
    const { updateFrameOrder } = useFrameOrdering();
    const {
      saveEditScreen,
      getDataEditScreen,
      saveSheetFrames
    } = useSaveData();
    const { updateSavingStatus } = useSavingStatus();
    const { getBookDigitalInfo } = useBookDigitalInfo();
    const { setInfoBar } = useInfoBar();
    const { getMedia, getInProjectAssets, updateSheetMedia } = usePhotos();
    const { currentSheet, getSheets } = useSheet();
    const {
      getAllScreenPlaybackData,
      getCurrentScreenPlaybackData,
      getFramePlaybackData
    } = useActionDigitalSheet();
    const { setPropertyById, setPropOfMultipleObjects } = useProperties();
    const { listObjects } = useObjectProperties();
    const {
      isMediaSidebarOpen,
      updateMediaSidebarOpen,
      disabledToolbarItems,
      setPropertiesType
    } = useToolBar();
    const { createFrames, updateFrameApi, getSheetFrames } = useFrameAction();
    const { addObjecs, deleteObjects } = useObjects();

    const { backgroundsProps } = useBackgroundProperties();

    const {
      saveSelectedPortraitFolders,
      createPortraitSheet,
      getPortraitFolders,
      getAndRemovePortraitSheet,
      setSheetPortraitConfig
    } = usePortrait();
    const { uploadBase64Image, generateMultiThumbnails } = useThumbnail();
    const { mediaObjectIds } = useMediaObjects();
    const { removeElementMapingOfFrames } = useMappingSheet();

    return {
      pageSelected,
      updateVisited,
      setToolNameSelected,
      setCurrentSheetId,
      updateSheetThumbnail,
      currentUser,
      authenticate,
      currentFrameId,
      updateFrameObjects,
      saveEditScreen,
      getDataEditScreen,
      updateSavingStatus,
      getBookDigitalInfo,
      setInfoBar,
      getMedia,
      updateSheetMedia,
      setPropertyById,
      setPropOfMultipleObjects,
      listObjects,
      isMediaSidebarOpen,
      updateMediaSidebarOpen,
      disabledToolbarItems,
      currentSheet,
      frames,
      clearAllFrames,
      addObjecs,
      deleteObjects,
      setFrames,
      setCurrentFrameId,
      getSheets,
      saveSheetFrames,
      backgroundsProps,
      saveSelectedPortraitFolders,
      createPortraitSheet,
      setSheetPortraitConfig,
      getAndRemovePortraitSheet,
      getPortraitFolders,
      getAllScreenPlaybackData,
      getCurrentScreenPlaybackData,
      getFramePlaybackData,
      setPropertiesType,
      setLoadingState,
      generalInfo,
      createFrames,
      updateFrameOrder,
      updateFrameApi,
      getSheetFrames,
      generateMultiThumbnails,
      uploadBase64Image,
      mediaObjectIds,
      getInProjectAssets,
      removeElementMapingOfFrames
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
      canvasSize: { w: 800, h: 450 },
      sheetMedia: [],
      isShowMappingWelcome: false,
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
        },
        [MODAL_TYPES.PLAYBACK]: {
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
    isAdmin() {
      return this.currentUser.role === ROLE.ADMIN;
    },
    disabledItems() {
      const transition =
        this.frames.length > 1 ? '' : PROPERTIES_TOOLS.TRANSITION.name;
      const portrait =
        this.currentSheet.type === SHEET_TYPE.COVER || !this.isAdmin
          ? TOOL_NAME.PORTRAIT
          : '';

      return mergeArrayNonEmpty(this.disabledToolbarItems, [
        transition,
        portrait
      ]);
    }
  },
  watch: {
    pageSelected: {
      deep: true,
      async handler(newVal, oldVal) {
        if (newVal.id && newVal?.id !== oldVal?.id) {
          if (!isEmpty(this.defaultThemeId)) {
            this.setIsPromptLayout(newVal);
          }
          await this.handlePortraitMapping(newVal.id);
        }
      }
    },
    isMediaSidebarOpen: {
      async handler(val) {
        if (val) this.sheetMedia = await this.getMedia();
      }
    },
    mediaObjectIds: {
      async handler(val, oldVal) {
        if (
          JSON.stringify(val) === JSON.stringify(oldVal) ||
          !val ||
          !this.isMediaSidebarOpen
        )
          return;

        this.getMediaAssets();
      }
    }
  },
  async beforeRouteEnter(to, _, next) {
    next(async vm => {
      const bookId = to.params?.bookId;
      const sheetId = to.params?.sheetId;

      const authenticateResult = await vm.authenticate(bookId, sheetId);

      const editionMainUrl = getEditionListPath(bookId, EDITION.DIGITAL);

      if (!isOk(authenticateResult)) {
        vm.$router.replace(editionMainUrl);

        return;
      }

      await vm.getBookDigitalInfo(bookId);

      vm.setCurrentSheetId({ id: parseInt(sheetId) });

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

      await this.$refs.canvasEditor.saveData(this.currentFrameId);

      this.updateSavingStatus({ status: SAVE_STATUS.END });

      setTimeout(() => {
        this.$router.push(
          getEditionListPath(this.generalInfo.bookId, EDITION.DIGITAL)
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

      this.setLoadingState({ value: true });

      const props = await Promise.all(promises);

      this.setPropOfMultipleObjects({ data: props });
      this.$refs.canvasEditor.mappingHandleImageContentChange({ data: props });

      this.$refs.canvasEditor.getThumbnailUrl();

      setTimeout(() => {
        canvas.renderAll();

        this.setLoadingState({ value: false });
      }, 250);
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
     * @param   {Array}  newMedia  selected media
     */
    async handleSelectedMedia(newMedia) {
      const mergedMedia = mergeArray([...newMedia].reverse(), this.sheetMedia);

      const { media, isSuccess } = await this.updateSheetMedia(
        mergedMedia,
        true
      );

      if (isSuccess) this.sheetMedia = media;
    },

    /**
     * Handle remove photo from sheet
     * @param {Object} removedMedia photo will be removed
     */
    async onRemovePhoto(removedMedia) {
      const newMedia = this.sheetMedia.filter(m => m.id !== removedMedia.id);

      const { media, isSuccess } = await this.updateSheetMedia(newMedia, true);
      if (isSuccess) this.sheetMedia = media;
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

      const pointer = this.$refs.canvasEditor.digitalCanvas.getPointer(event.e);

      this.dragItem = null;

      const isImage = target?.objectType === OBJECT_TYPE.IMAGE;
      const isVideo = target?.objectType === OBJECT_TYPE.VIDEO;

      if (!target || (!isImage && !isVideo)) {
        const x = pointer.x - offsetX * 3;
        const y = pointer.y - offsetY * 3;

        this.$refs.canvasEditor.addImageBox(x, y, imgWidth, imgHeight, {
          src: mediaUrl || imageUrl,
          id: imageId,
          type,
          thumbUrl
        });

        return;
      }

      this.setLoadingState({ value: true });

      // pause the video if playing
      isVideo && isVideoPlaying(target) && target.pause();

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

      if (mediaUrl) {
        prop.volume = DEFAULT_VIDEO.VOLUME;
        prop.endTime = prop.duration;
        prop.startTime = 0;
      }

      const imgProp = { id: target.id, prop };
      this.setPropertyById(imgProp);
      this.$refs.canvasEditor.mappingHandleImageContentChange(imgProp);

      this.$refs.canvasEditor.getThumbnailUrl();

      this.$refs.canvasEditor.digitalCanvas.setActiveObject(target);

      setTimeout(() => {
        this.$refs.canvasEditor.digitalCanvas.renderAll();

        this.setLoadingState({ value: false });
      }, 250);
    },

    /**
     * Handle after crop image
     * @param {String} value Result image url after croppeed
     */
    async onCrop(value, cropInfo) {
      const url = await this.uploadBase64Image(value);

      if (!url) return this.onCancel();

      const prop = await setImageSrc(this.selectedImage, url);
      prop.cropInfo = cropInfo;
      prop.fromPortrait = false;
      this.selectedImage.set({ cropInfo, fromPortrait: false });
      this.setPropertyById({ id: this.selectedImage.id, prop });
      this.$refs.canvasEditor.handleCanvasChanged();
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
      this.onToggleModal({
        modal: MODAL_TYPES.PORTRAIT_FLOW,
        isToggle: false,
        isOpen: false
      });
      this.onToggleModal({
        modal: TOOL_NAME.PORTRAIT,
        isToggle: false,
        isOpen: false
      });
      this.setToolNameSelected('');
    },
    /**
     * Selected portrait folders
     *
     * @param {Array}  folders  portrait folders
     */
    onSelectPortraitFolders(folders) {
      this.modal[MODAL_TYPES.PORTRAIT_FLOW].data = { folders };

      this.onToggleModal({ modal: TOOL_NAME.PORTRAIT });
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
        },
        {
          name: EVENT_TYPE.PLAYBACK,
          handler: this.playback
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
     * Get playback data
     *
     * @param   {Number}          playType  selected playback type
     * @param   {Number | String} frameId   id of selected frame
     * @returns {Promise<Array>}                     data
     */
    async getPlayback(playType, frameId) {
      if (playType === PLAYBACK.ALL) {
        return this.getAllScreenPlaybackData();
      }

      if (playType === PLAYBACK.SCREEN) {
        return this.getCurrentScreenPlaybackData();
      }

      return this.getFramePlaybackData(frameId);
    },
    /**
     * Open Playback modal with data
     *
     * @param {Number}          playType  selected playback type
     * @param {Number | String} frameId   id of selected frame
     */
    async playback({ playType, frameId }) {
      this.setPropertiesType({ type: '' });

      const data = await this.getPlayback(playType, frameId);

      if (isEmpty(data)) return;

      this.modal[MODAL_TYPES.PLAYBACK].data = { playbackData: data };

      this.onToggleModal({ modal: MODAL_TYPES.PLAYBACK });
    },
    /**
     * Toggle modal
     *
     * @param {String}  modal     name of modal
     * @param {Boolean} isToggle  is toggle modal or not
     * @param {Boolean} isOpen    if not toggle, open or hide modal
     */
    onToggleModal({ modal, isToggle = true, isOpen = true }) {
      if (modal === TOOL_NAME.PORTRAIT && isOpen) {
        // user hit the portrait button on tool menu
        this.isShowMappingWelcome = false; // to hide the portrait mapping modal
      }

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
      // reset auto save timer
      this.$refs.canvasEditor.setAutosaveTimer();
      this.setLoadingState({ value: true, isFreeze: true });

      const { flowMultiSettings } = settings;
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

      const screenWillUpdate = [];
      let currentCanvasObjects = [];

      const framePromise = Object.keys(requiredScreens).map(
        async (screenId, screenIndex) => {
          const requiredFrames = requiredScreens[screenId];

          if (isEmpty(requiredFrames)) return;

          const requiredFolders =
            Object.values(flowMultiSettings.screen)?.[screenIndex]?.length || 1;
          const folders = settings.folders.splice(0, requiredFolders);
          const pages = getPageObjects(settings, requiredFrames, true, folders);

          const canvas = this.$refs.canvasEditor.digitalCanvas;

          const frames =
            screenId === this.pageSelected.id
              ? this.frames
              : await this.getSheetFrames(screenId);

          const framesList = await this.getRequiredFramesData(
            cloneDeep(frames),
            pages,
            screenId
          );

          if (+screenId !== +this.pageSelected.id) {
            const thumbOfOldFrame = frames[0].previewImageUrl;
            const thumbOfNewFram = framesList[0].previewImageUrl;
            const previewImageUrl =
              thumbOfOldFrame !== thumbOfNewFram ? thumbOfNewFram : '';
            screenWillUpdate.push({ sheetId: screenId, previewImageUrl });

            return;
          }

          const currentId = this.currentFrameId;
          const ids = Object.keys(this.listObjects);
          const { background } = cloneDeep(this.backgroundsProps);

          this.clearAllFrames();

          const currentFrame = framesList.find(f => +f.id === +currentId);

          const { id, objects } = currentFrame || framesList[0];

          this.deleteObjects({ ids });

          const filteredObjects = objects.filter(
            obj => obj.type !== OBJECT_TYPE.BACKGROUND
          );

          this.addObjecs({
            objects: filteredObjects.map(obj => ({
              id: obj.id,
              newObject: obj
            }))
          });

          this.setFrames({ framesList });

          this.setCurrentFrameId({ id });

          resetObjects(canvas);

          if (!isEmpty(background)) filteredObjects.unshift(background);
          currentCanvasObjects = filteredObjects;
        }
      );
      await Promise.all(framePromise);

      // update to vuex store
      screenWillUpdate.forEach(({ sheetId, previewImageUrl }) => {
        this.updateVisited({ sheetId });
        previewImageUrl &&
          this.updateSheetThumbnail({ sheetId, thumbnailUrl: previewImageUrl });
      });

      this.onToggleModal({ modal: '' });
      this.setToolNameSelected('');

      await this.updatePortraitRelated(screenWillUpdate);

      this.$refs.canvasEditor.renderPortraits(currentCanvasObjects);
      this.setLoadingState({ value: false, isFreeze: false });
    },
    /**
     * To handle api related to portrait:
     * - Save selected portrait to book
     * - create portrait sheet mapping config
     *
     * @param {{sheetId: string, previewImageUrl: string}[]} screenWillUpdate
     * @returns
     */
    async updatePortraitRelated(screenWillUpdate) {
      const selectedFolderIds = this.modal[
        MODAL_TYPES.PORTRAIT_FLOW
      ].data.folders.map(item => item.id);

      this.saveSelectedPortraitFolders(
        this.generalInfo.bookId,
        selectedFolderIds
      );

      // if the portrait modal is opened by mapping functionality (isShowMappingWelcome =  true);
      // we do not need to create portrait mapping
      if (this.isShowMappingWelcome) return;

      // In digital, the first sheet is always the current sheet
      // Create portrait mapping setting on the current sheet
      this.createPortraitSheet(this.pageSelected.id, selectedFolderIds);

      const sheetIds = [
        this.pageSelected.id,
        ...screenWillUpdate.map(({ sheetId }) => sheetId)
      ];

      await Promise.all(sheetIds.map(this.setSheetPortraitConfig));
    },
    /**
     * Get require frame data
     *
     * @param   {Array}   currentFrames   current frames data
     * @param   {Object}  requiredFrames  require frames
     * @returns {Promise<Array>}                   frame data
     */
    async getRequiredFramesData(currentFrames, requiredFrames, screenId) {
      const createdFrames = [];
      const updatedFrames = [];
      const modifiedFrameIdx = [];

      Array.from({
        length: Math.max(...Object.keys(requiredFrames))
      }).forEach((_, index) => {
        const objects = requiredFrames[index + 1] || [];
        const orderIds = [objects.map(obj => obj.id)];

        if (!currentFrames[index]) {
          const blankFrame = new FrameDetail({
            fromLayout: false,
            objects,
            isVisited: true,
            playInIds: orderIds,
            playOutIds: orderIds
          });
          createdFrames.push(blankFrame);
          modifiedFrameIdx.push(index);

          return currentFrames.push(blankFrame);
        }

        if (isEmpty(objects)) return;

        const background = currentFrames[index].objects.find(
          obj => obj.type === OBJECT_TYPE.BACKGROUND
        );

        if (!isEmpty(background)) objects.unshift(background);

        currentFrames[index] = {
          ...currentFrames[index],
          objects,
          playInIds: orderIds,
          playOutIds: orderIds,
          isVisited: true
        };

        updatedFrames.push(currentFrames[index]);
        modifiedFrameIdx.push(index);
      });

      const imageUrls = await this.generateMultiThumbnails(
        modifiedFrameIdx.map(idx => currentFrames[idx].objects),
        true
      );

      // update url into frames
      modifiedFrameIdx.forEach(
        (frameIdx, idx) =>
          (currentFrames[frameIdx].previewImageUrl = imageUrls[idx])
      );

      // update frames
      await Promise.all(
        updatedFrames.map(frame => this.updateFrameApi(frame.id, frame))
      );

      const bookId = this.generalInfo.bookId;
      const inProjectAssetsOfFrames = await Promise.all(
        updatedFrames.map(frame => this.getInProjectAssets(bookId, frame.id))
      );

      // remove all in-project assets of the page
      await Promise.all(
        updatedFrames.map((frame, idx) => {
          const inProjectVariables = {
            bookId: +bookId,
            projectId: frame.id,
            removeAssetIds: inProjectAssetsOfFrames[idx].apiPageAssetIds
          };
          return updateInProjectApi(inProjectVariables, true);
        })
      );

      // create frame on DB and adding frame ids back to `createdFrames`
      await this.createFrames(screenId, createdFrames);

      // update frame orders
      const frameIds = currentFrames.map(f => parseInt(f.id));
      await this.updateFrameOrder(screenId, frameIds);

      // remove element mapping connection
      const mappingFrameIds = [
        ...updatedFrames.map(f => f.id),
        ...createdFrames.map(f => f.id)
      ];
      await this.removeElementMapingOfFrames(screenId, mappingFrameIds);

      return currentFrames;
    },

    /**
     * Handle get media assets
     */
    getMediaAssets: debounce(
      async function() {
        this.sheetMedia = await this.getMedia();
      },
      500,
      { leading: true, trailing: false }
    ),
    /**
     * To get portrait sheet mapping and
     * open portrait modal
     *
     * @param {String} sheetId
     */
    async handlePortraitMapping(sheetId) {
      this.isShowMappingWelcome = false;
      const portraitFolderIds = await this.getAndRemovePortraitSheet(sheetId);

      if (isEmpty(portraitFolderIds)) return;

      const portraitFolders = await this.getPortraitFolders({
        bookId: this.generalInfo.bookId
      });
      const folders = portraitFolders.filter(folder =>
        portraitFolderIds.includes(folder.id)
      );

      if (isEmpty(folders)) return;

      // set folders
      this.modal[MODAL_TYPES.PORTRAIT_FLOW].data = { folders };
      this.isShowMappingWelcome = true;
      this.onToggleModal({ modal: MODAL_TYPES.PORTRAIT_FLOW });
    }
  }
};
