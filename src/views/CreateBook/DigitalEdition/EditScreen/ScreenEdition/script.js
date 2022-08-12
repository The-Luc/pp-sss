import SizeWrapper from '@/components/SizeWrapper';
import AddBoxInstruction from '@/components/AddBoxInstruction';
import Frames from './Frames';
import TheAnimationOrder from './TheAnimationOrder';
import MappingLayoutCustomChange from '@/containers/Modals/MappingLayoutCustomChange';

import { fabric } from 'fabric';

import {
  imageBorderModifier,
  useOverrides,
  useObjectControlsOverride
} from '@/plugins/fabric';
import {
  ARRANGE_SEND,
  ASSET_TYPE,
  DEFAULT_CLIP_ART,
  DEFAULT_IMAGE,
  DEFAULT_SHAPE,
  MODAL_TYPES,
  OBJECT_TYPE,
  SAVE_STATUS,
  TOOL_NAME,
  DIGITAL_CANVAS_SIZE,
  AUTOSAVE_INTERVAL,
  DEBOUNCE_MUTATION,
  MIN_IMAGE_SIZE,
  PASTE,
  THUMBNAIL_IMAGE_CONFIG,
  VIDEO_SPEED_UP_TIME,
  CANVAS_EVENT_TYPE,
  EVENT_TYPE,
  WINDOW_EVENT_TYPE,
  PROPERTIES_TOOLS,
  APPLY_MODE,
  EDITION,
  PORTRAIT_IMAGE_MASK,
  CUSTOM_CHANGE_MODAL,
  CONTENT_CHANGE_MODAL,
  CONTENT_VIDEO_CHANGE_MODAL,
  CUSTOM_MAPPING_MODAL
} from '@/common/constants';
import {
  addPrintClipArts,
  addPrintShapes,
  applyTextBoxProperties,
  calcScaleElement,
  createTextBox,
  setTextDimensionAfterScaled,
  handleObjectBlur,
  handleScalingText,
  mappingElementProperties,
  startDrawBox,
  updateElement,
  addDigitalBackground,
  deleteObjectById,
  enableTextEditMode,
  addEventListeners,
  applyBorderToImageObject,
  createBackgroundFabricObject,
  fabricToPpObject,
  getTextSizeWithPadding,
  setImageSrc,
  setVideoSrc,
  handleDragEnter,
  handleDragLeave,
  centercrop,
  createMediaOverlay,
  handleMouseMove,
  handleMouseOver,
  handleMouseOut,
  handleObjectSelected,
  handleObjectDeselected,
  calcAnimationOrder,
  createMediaObject,
  createSvgObject,
  createPortraitImageObject,
  createTextBoxObject,
  createImage,
  createClipartObject
} from '@/common/fabricObjects';
import { mapGetters, mapActions, mapMutations } from 'vuex';

import {
  useInfoBar,
  useLayoutPrompt,
  useFrame,
  useFrameSwitching,
  useModal,
  useMutationDigitalSheet,
  useElementProperties,
  useStyle,
  useToolBar,
  useProperties,
  useGetterEditionSection,
  useAnimation,
  useFrameDelay,
  useAppCommon,
  useCustomLayout,
  useMappingSheet,
  useMappingProject,
  useFrameAction,
  useBreakConnections,
  useContentChanges
} from '@/hooks';

import {
  deleteSelectedObjects,
  isEmpty,
  pxToIn,
  resetObjects,
  selectLatestObject,
  setActiveEdition,
  setBorderHighlight,
  setBorderObject,
  setCanvasUniformScaling,
  isNonElementPropSelected,
  copyPpObject,
  pastePpObject,
  isDeleteKey,
  isVideoPlaying,
  isValidTargetToCopyPast,
  getUniqueId,
  isContainDebounceProp,
  animateIn,
  animateOut,
  renderOrderBoxes,
  isPpImageObject,
  getObjectById,
  isAllowSyncLayoutData,
  getDigitalObjectById,
  isSecondaryFormat,
  isPrimaryFormat,
  updateCanvasMapping,
  isPpVideoObject,
  isPpMediaObject,
  isLayoutMappingChecker,
  isAllowSyncCustomData,
  isCustomMappingChecker,
  getBrokenCustomMapping,
  isFbBackground
} from '@/common/utils';
import { GETTERS as APP_GETTERS, MUTATES } from '@/store/modules/app/const';

import {
  ACTIONS as DIGITAL_ACTIONS,
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';

import { cloneDeep, debounce, merge } from 'lodash';
import { useSaveData, useObject, useVideo } from '../composables';
import { useSavingStatus, usePhotos } from '@/views/CreateBook/composables';
import UndoRedoCanvas from '@/plugins/undoRedoCanvas';
import {
  BackgroundElementObject,
  BasePosition,
  BaseSize,
  ClipArtElementObject,
  ImageElementObject,
  ShapeElementObject,
  VideoElementObject
} from '@/common/models/element';
import {
  CONTROL_TYPE,
  PLAY_IN_STYLES
} from '@/common/constants/animationProperty';
import { getSheetInfoApi } from '@/api/sheet';
import UniqueColor from '@/plugins/UniqueColor';
import { getItem, setItem } from '@/common/storage';

const ELEMENTS = {
  [OBJECT_TYPE.TEXT]: 'a text box',
  [OBJECT_TYPE.IMAGE]: 'an image box'
};

export default {
  components: {
    SizeWrapper,
    AddBoxInstruction,
    Frames,
    TheAnimationOrder,
    MappingLayoutCustomChange
  },
  props: {
    frames: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const { setLoadingState } = useAppCommon();
    const { setInfoBar, zoom } = useInfoBar();
    const { openPrompt } = useLayoutPrompt();
    const { handleSwitchFrame } = useFrameSwitching();
    const {
      currentFrame,
      currentFrameId,
      updateFrameObjects,
      firstFrameThumbnail
    } = useFrame();
    const { toggleModal, modalData } = useModal();
    const { onSaveStyle } = useStyle();
    const { getDataEditScreen, saveEditScreen } = useSaveData();
    const { updateSavingStatus, savingStatus } = useSavingStatus();
    const { updateObjectsToStore } = useObject();
    const { updateSheetThumbnail } = useMutationDigitalSheet();
    const { getProperty } = useElementProperties();
    const { updateMediaSidebarOpen, setPropertiesType } = useToolBar();

    const {
      setPropOfMultipleObjects,
      setObjectPropOfSheetFrames
    } = useProperties();
    const { currentSection } = useGetterEditionSection();
    const {
      updateAnimation,
      playInOrder,
      playOutOrder,
      playInIds,
      playOutIds,
      setPlayInOrder,
      setPlayOutOrder,
      updatePlayInIds,
      updatePlayOutIds,
      updateTriggerAnimation
    } = useAnimation();

    const { setToolNameSelected, propertiesType } = useToolBar();
    const { setFrameDelay } = useFrameDelay();
    const { totalVideoDuration } = useVideo();
    const { getAssetById } = usePhotos();
    const { saveCustomDigitalLayout } = useCustomLayout();
    const {
      storeElementMappings,
      getSheetMappingConfig,
      updateElementMappingByIds,
      createSingleElementMapping
    } = useMappingSheet();
    const { getMappingConfig } = useMappingProject();
    const { getSheetFrames } = useFrameAction();
    const { breakSingleConnection } = useBreakConnections();
    const {
      handleTextContentChange,
      handleImageContentChange
    } = useContentChanges();

    return {
      setLoadingState,
      currentFrame,
      currentFrameId,
      setInfoBar,
      zoom,
      openPrompt,
      handleSwitchFrame,
      toggleModal,
      modalData,
      onSaveStyle,
      getDataEditScreen,
      saveEditScreen,
      updateFrameObjects,
      updateSavingStatus,
      savingStatus,
      updateObjectsToStore,
      updateSheetThumbnail,
      firstFrameThumbnail,
      getProperty,
      updateMediaSidebarOpen,
      setPropOfMultipleObjects,
      setObjectPropOfSheetFrames,
      currentSection,
      updateAnimation,
      playInOrder,
      playOutOrder,
      playInIds,
      playOutIds,
      setPlayInOrder,
      setPlayOutOrder,
      updatePlayInIds,
      updatePlayOutIds,
      setToolNameSelected,
      propertiesType,
      updateTriggerAnimation,
      setPropertiesType,
      setFrameDelay,
      totalVideoDuration,
      getAssetById,
      saveCustomDigitalLayout,
      storeElementMappings,
      getSheetMappingConfig,
      updateElementMappingByIds,
      createSingleElementMapping,
      getMappingConfig,
      getSheetFrames,
      breakSingleConnection,
      handleTextContentChange,
      handleImageContentChange
    };
  },
  data() {
    return {
      containerSize: null,
      canvasSize: null,
      element: '',
      x: 0,
      y: 0,
      visible: false,
      awaitingAdd: '',
      digitalCanvas: null,
      countPaste: 1,
      isProcessingPaste: false,
      isCanvasChanged: false,
      autoSaveTimer: null,
      undoRedoCanvas: null,
      isScroll: { x: false, y: false },
      isAllowUpdateFrameDelay: false,
      isJustEnteringEditor: false, // to prevent save data when entering editor
      printObjects: {}, // used to calculate mapping value (hover icon)
      elementMappings: [],
      isShowCustomChangesConfirm: false, // for editing in mapped layout applied sheet
      isShowMappingContentChange: false, // for editing content of text/image
      isShowCustomMappingModal: false, // for editing object or adding new object on custom mapping mode
      isShowMappingVideoContentChange: false, // for adding video when digital is the primary format
      isRenderingObjects: null,
      sheetMappingConfig: {},
      projectMappingConfig: {}
    };
  },
  computed: {
    ...mapGetters({
      pageSelected: DIGITAL_GETTERS.CURRENT_SHEET,
      sheetLayout: DIGITAL_GETTERS.SHEET_LAYOUT,
      selectedObject: DIGITAL_GETTERS.CURRENT_OBJECT,
      toolNameSelected: APP_GETTERS.SELECTED_TOOL_NAME,
      currentBackgrounds: DIGITAL_GETTERS.BACKGROUNDS,
      propertiesObjectType: APP_GETTERS.PROPERTIES_OBJECT_TYPE,
      object: DIGITAL_GETTERS.OBJECT_BY_ID,
      currentObjects: DIGITAL_GETTERS.GET_OBJECTS,
      totalBackground: DIGITAL_GETTERS.TOTAL_BACKGROUND,
      triggerApplyLayout: DIGITAL_GETTERS.TRIGGER_APPLY_LAYOUT
    })
  },
  watch: {
    pageSelected: {
      deep: true,
      async handler(val, oldVal) {
        if (val?.id === oldVal?.id) return;

        if (!this.isJustEnteringEditor)
          await this.saveData(this.currentFrameId, oldVal.id);

        this.isJustEnteringEditor = false;
        this.isAllowUpdateFrameDelay = false;
        this.stopVideos();

        // reset frames, frameIDs, currentFrameId
        this.setSelectedObjectId({ id: '' });
        this.setPropertiesObjectType({ type: '' });
        this.setCurrentObject(null);
        this.updateCanvasSize();
        this.setAutosaveTimer();

        await this.getDataCanvas();
        // get print objects
        await this.getPrintObjects(this.pageSelected.id);

        this.sheetMappingConfig = await this.getSheetMappingConfig(val.id);

        this.setCurrentFrameId({ id: this.frames[0].id });

        this.countPaste = 1;
        await this.drawLayout();
        this.isAllowUpdateFrameDelay = true;
        this.resetCanvasChanges();
      }
    },
    async currentFrameId(val, oldVal) {
      this.isAllowUpdateFrameDelay = false;

      if (!val) {
        this.stopVideos();
        resetObjects(this.digitalCanvas);

        return;
      }

      const isSwitchFrame = this.frames.find(
        f => String(f.id) === String(oldVal)
      );

      if (isSwitchFrame) await this.saveData(oldVal);

      this.stopVideos();
      this.setSelectedObjectId({ id: '' });
      this.setPropertiesObjectType({ type: '' });
      this.setCurrentObject(null);
      this.setAutosaveTimer();

      this.updatePlayInIds({ playInIds: this.currentFrame.playInIds });
      this.updatePlayOutIds({ playOutIds: this.currentFrame.playOutIds });

      this.updateObjectsToStore({ objects: this.currentFrame.objects });

      this.handleSwitchFrame(this.currentFrame);

      this.undoRedoCanvas.reset();

      this.updateMediaSidebarOpen({ isOpen: false });

      await this.drawLayout();

      this.isAllowUpdateFrameDelay = true;
      this.resetCanvasChanges();
    },
    async triggerApplyLayout() {
      // to render new layout when user replace frame
      this.stopVideos();
      this.setSelectedObjectId({ id: '' });
      this.setCurrentObject(null);

      await this.drawObjectsOnCanvas(this.sheetLayout);
      this.resetCanvasChanges();
    },
    firstFrameThumbnail(val) {
      this.updateSheetThumbnail({
        sheetId: this.pageSelected.id,
        thumbnailUrl: val
      });
    },
    zoom(newVal, oldVal) {
      if (newVal !== oldVal) this.updateCanvasSize();
    },
    propertiesType(val) {
      if (val === PROPERTIES_TOOLS.ANIMATION.name) {
        return this.handleOpenAnimations();
      }

      const objects = this.digitalCanvas.getObjects();

      objects.forEach(obj =>
        obj.set({ selectable: obj.objectType !== OBJECT_TYPE.BACKGROUND })
      );

      this.digitalCanvas.renderAll();
    },
    totalVideoDuration(newVal, oldVal) {
      if (!this.isAllowUpdateFrameDelay) return;

      const duration = this.currentFrame?.delay + newVal - oldVal || 3;
      this.setFrameDelay({ value: duration });
    }
  },
  beforeDestroy() {
    this.digitalCanvas = null;

    this.stopAutosaving();

    // close all modal
    this.toggleModal({ isOpenModal: false });

    this.updateDigitalEventListeners(false);
    this.updateWindowEventListeners(false);

    this.setInfoBar({ x: 0, y: 0, zoom: 0 });

    this.undoRedoCanvas.dispose();

    this.updateMediaSidebarOpen({ isOpen: false });
  },
  destroyed() {
    this.setCurrentFrameId({ id: '' });
  },
  methods: {
    ...mapActions({
      getDataCanvas: DIGITAL_ACTIONS.GET_DATA_CANVAS
    }),
    ...mapMutations({
      setBookId: DIGITAL_MUTATES.SET_BOOK_ID,
      setIsOpenProperties: MUTATES.TOGGLE_MENU_PROPERTIES,
      setObjectTypeSelected: MUTATES.SET_OBJECT_TYPE_SELECTED,
      setSelectedObjectId: DIGITAL_MUTATES.SET_CURRENT_OBJECT_ID,
      setCurrentObject: MUTATES.SET_CURRENT_OBJECT,
      addNewObject: DIGITAL_MUTATES.ADD_OBJECT,
      setObjectProp: DIGITAL_MUTATES.SET_PROP,
      setObjectPropById: DIGITAL_MUTATES.SET_PROP_BY_ID,
      addNewBackground: DIGITAL_MUTATES.SET_BACKGROUND,
      updateTriggerBackgroundChange:
        DIGITAL_MUTATES.UPDATE_TRIGGER_BACKGROUND_CHANGE,
      deleteObjects: DIGITAL_MUTATES.DELETE_OBJECTS,
      setThumbnail: DIGITAL_MUTATES.UPDATE_FRAME_THUMBNAIL,
      reorderObjectIds: DIGITAL_MUTATES.REORDER_OBJECT_IDS,
      toggleActiveObjects: MUTATES.TOGGLE_ACTIVE_OBJECTS,
      setPropertiesObjectType: MUTATES.SET_PROPERTIES_OBJECT_TYPE,
      setBackgroundProp: DIGITAL_MUTATES.SET_BACKGROUND_PROP,
      deleteBackground: DIGITAL_MUTATES.DELETE_BACKGROUND,
      setFrames: DIGITAL_MUTATES.SET_FRAMES,
      setCurrentFrameId: DIGITAL_MUTATES.SET_CURRENT_FRAME_ID
    }),
    updateCanvasSize() {
      const canvasFitSize = { w: 0, h: 0 };
      const canvasMargin = 16;

      const isWidthBigger =
        this.containerSize.ratio > DIGITAL_CANVAS_SIZE.RATIO;

      if (isWidthBigger) {
        canvasFitSize.h = this.containerSize.height - canvasMargin;
        canvasFitSize.w = canvasFitSize.h * DIGITAL_CANVAS_SIZE.RATIO;
      } else {
        canvasFitSize.w = this.containerSize.width - canvasMargin;
        canvasFitSize.h = canvasFitSize.w / DIGITAL_CANVAS_SIZE.RATIO;
      }

      this.$emit('canvasSizeChange', { size: canvasFitSize });

      const { WIDTH: realWidth, HEIGHT: realHeight } = DIGITAL_CANVAS_SIZE;

      const canvasSize = {
        width: this.zoom > 0 ? realWidth * this.zoom : canvasFitSize.w,
        height: this.zoom > 0 ? realHeight * this.zoom : canvasFitSize.h
      };

      this.isScroll = {
        x: canvasSize.width > this.containerSize.width - canvasMargin,
        y: canvasSize.height > this.containerSize.height - canvasMargin
      };

      const zoom =
        this.zoom === 0
          ? canvasSize.width / DIGITAL_CANVAS_SIZE.WIDTH
          : this.zoom;

      this.canvasSize = { ...canvasSize, zoom };

      window.digitalCanvas.setWidth(canvasSize.width);
      window.digitalCanvas.setHeight(canvasSize.height);

      window.digitalCanvas.setZoom(zoom);

      // update frame thumbnail
      this.getThumbnailUrl();
    },

    /**
     * Event fire after component has been mouted
     * @param  {Object} containerSize canvas's dimensions
     */
    onContainerReady(containerSize) {
      this.containerSize = containerSize;
      const el = this.$refs.digitalCanvas;
      window.digitalCanvas = new fabric.Canvas(el, {
        backgroundColor: '#fff',
        preserveObjectStacking: true
      });
      setActiveEdition(window.digitalCanvas, EDITION.DIGITAL);
      useOverrides(fabric.Object.prototype);
      fabric.initFilterBackend();
      this.updateCanvasSize();
      this.digitalCanvas = window.digitalCanvas;
      this.updateCanvasEventListeners();
      this.updateDigitalEventListeners();
      this.updateWindowEventListeners();

      this.isJustEnteringEditor = true;

      this.setAutosaveTimer();
      this.getProjectMappingConfig();

      this.undoRedoCanvas = new UndoRedoCanvas({
        canvas: this.digitalCanvas,
        renderCanvasFn: this.drawObjectsOnCanvas
      });
    },

    /**
     * Event fire after component has been resized
     * @param  {Object} containerSize canvas's dimensions
     */
    onContainerResized(containerSize) {
      this.containerSize = containerSize;
      this.updateCanvasSize();
    },

    /**
     * Handle adding & removing events
     *
     * @param {Boolean} isOn if need to set event
     */
    updateDigitalEventListeners(isOn = true) {
      const elementEvents = [
        {
          name: EVENT_TYPE.DIGITAL_ADD_ELEMENT,
          handler: this.onAddElement
        },
        {
          name: EVENT_TYPE.PREVIEW_ANIMATION,
          handler: this.previewAnimation
        },
        {
          name: EVENT_TYPE.CHANGE_OBJECT_IDS_ORDER,
          handler: this.changeObjectIdsOrder
        },
        {
          name: EVENT_TYPE.SAVE_STYLE,
          handler: this.onSaveStyle
        },
        {
          name: EVENT_TYPE.DELETE_OBJECTS,
          handler: this.deleteObject
        }
      ];

      const textEvents = [
        {
          name: EVENT_TYPE.CHANGE_TEXT_PROPERTIES,
          handler: this.changeTextProperties
        }
      ];

      const backgroundEvents = [
        {
          name: EVENT_TYPE.DIGITAL_BACKGROUND_ADD,
          handler: this.addBackground
        },
        {
          name: EVENT_TYPE.BACKGROUND_PROP_CHANGE,
          handler: this.changeBackgroundProperties
        },
        {
          name: EVENT_TYPE.DIGITAL_BACKGROUND_REMOVE,
          handler: this.removeBackground
        }
      ];

      const shapeEvents = [
        {
          name: EVENT_TYPE.ADD_SHAPES,
          handler: this.addShapes
        },
        {
          name: EVENT_TYPE.CHANGE_SHAPE_PROPERTIES,
          handler: this.changeShapeProperties
        }
      ];

      const clipArtEvents = [
        {
          name: EVENT_TYPE.ADD_CLIPARTS,
          handler: this.addClipArt
        },
        {
          name: EVENT_TYPE.CHANGE_CLIPART_PROPERTIES,
          handler: this.changeClipArtProperties
        }
      ];

      const imageEvents = [
        {
          name: EVENT_TYPE.CHANGE_IMAGE_PROPERTIES,
          handler: this.changeImageProperties
        },
        {
          name: EVENT_TYPE.CHANGE_PORTRAIT_IMAGE_PROPERTIES,
          handler: this.changePortraitImageProperties
        },
        {
          name: EVENT_TYPE.REMOVE_IMAGE,
          handler: this.handleRemoveImage
        },
        {
          name: EVENT_TYPE.CENTERCROP,
          handler: this.handleCentercrop
        }
      ];

      const videoEvents = [
        {
          name: EVENT_TYPE.CHANGE_VIDEO_PROPERTIES,
          handler: this.changeVideoProperties
        },
        {
          name: EVENT_TYPE.VIDEO_TOGGLE_PLAY,
          handler: this.videoTogglePlay
        },
        {
          name: EVENT_TYPE.VIDEO_REWIND,
          handler: this.videoRewind
        },
        {
          name: EVENT_TYPE.VIDEO_KEEP_REWIND,
          handler: this.videoKeepRewind
        },
        {
          name: EVENT_TYPE.VIDEO_STOP_KEEP_REWIND,
          handler: this.videoCancelRewind
        },
        {
          name: EVENT_TYPE.VIDEO_FORWARD,
          handler: this.videoForward
        },
        {
          name: EVENT_TYPE.VIDEO_KEEP_FORWARD,
          handler: this.videoKeepForward
        },
        {
          name: EVENT_TYPE.VIDEO_STOP_KEEP_FORWARD,
          handler: this.videoCancelForward
        }
      ];

      const otherEvents = [
        {
          name: EVENT_TYPE.COPY_OBJ,
          handler: this.handleCopy
        },
        {
          name: EVENT_TYPE.PASTE_OBJ,
          handler: this.handlePaste
        },
        {
          name: EVENT_TYPE.APPLY_ANIMATION,
          handler: this.handleApplyAnimation
        },
        {
          name: EVENT_TYPE.CHANGE_ANIMATION_ORDER,
          handler: this.handleChangeAnimationOrder
        },
        {
          name: EVENT_TYPE.ANIMATION_SELECT,
          handler: this.handleSelectAnimationObject
        },
        { name: EVENT_TYPE.SAVE_LAYOUT, handler: this.handleSaveLayout },
        { name: EVENT_TYPE.APPLY_LAYOUT, handler: this.handleApplyLayout },
        { name: EVENT_TYPE.RESET_MAPPING_TYPE, handler: this.resetMappingType }
      ];

      const events = [
        ...elementEvents,
        ...backgroundEvents,
        ...textEvents,
        ...shapeEvents,
        ...clipArtEvents,
        ...imageEvents,
        ...videoEvents,
        ...otherEvents
      ];

      events.forEach(event => {
        this.$root.$off(event.name, event.handler);

        if (isOn) this.$root.$on(event.name, event.handler);
      });
    },

    /**
     * Update window event listeners
     *
     * @param {Boolean} isOn if need to set event
     */
    updateWindowEventListeners(isOn = true) {
      const events = [
        {
          name: WINDOW_EVENT_TYPE.KEY_UP,
          handler: this.onKeyUp
        },
        {
          name: WINDOW_EVENT_TYPE.COPY,
          handler: this.handleCopy
        },
        {
          name: WINDOW_EVENT_TYPE.PASTE,
          handler: this.handlePaste
        }
      ];

      events.forEach(event => {
        document.body.removeEventListener(event.name, event.handler);

        if (isOn) document.body.addEventListener(event.name, event.handler);
      });
    },

    /**
     * Update fabric canvas's event listeners after component has been mounted
     */
    updateCanvasEventListeners() {
      const events = {
        [CANVAS_EVENT_TYPE.SELECTION_CREATED]: this.onSelectionUpdated,
        [CANVAS_EVENT_TYPE.SELECTION_UPDATED]: this.onSelectionUpdated,
        [CANVAS_EVENT_TYPE.SELECTION_CLEARED]: this.onSelectionCleared,
        [CANVAS_EVENT_TYPE.OBJECT_MODIFIED]: this.onObjectModified,
        [CANVAS_EVENT_TYPE.OBJECT_ADDED]: this.onObjectAdded,
        [CANVAS_EVENT_TYPE.OBJECT_REMOVED]: this.onObjectRemoved,
        [CANVAS_EVENT_TYPE.OBJECT_MOVED]: this.onObjectMoved,
        [CANVAS_EVENT_TYPE.MOUSE_DOWN]: this.onMouseDown,
        [CANVAS_EVENT_TYPE.MOUSE_UP]: this.onMouseUp,
        [CANVAS_EVENT_TYPE.TEXT_CHANGED]: this.onTextChanged,
        [CANVAS_EVENT_TYPE.DROP]: this.$emit.bind(this, 'drop')
      };
      this.digitalCanvas?.on(events);
    },

    onSwitchTool(toolName) {
      const isDiscard =
        toolName &&
        toolName !== TOOL_NAME.DELETE &&
        toolName !== TOOL_NAME.ACTIONS;

      if (isDiscard) {
        this.digitalCanvas?.discardActiveObject();
        this.digitalCanvas?.renderAll();
      }

      if (isNonElementPropSelected(this.propertiesObjectType)) {
        this.setPropertiesObjectType({ type: '' });
      }

      if (this.modalData?.type === MODAL_TYPES.ADD_DIGITAL_FRAME) {
        this.toggleModal({ isOpenModal: false });
      }

      this.endInstruction();
    },

    /**
     * Event fire when click opject type on toolbar
     * @param element element will be added to canvas
     */
    onAddElement(element) {
      this.stopAddingInstruction();
      this.awaitingAdd = element;
      this.startAddingInstruction();
    },

    /**
     * Event fire when selection of fabric canvas has been created
     */
    onSelectionCreated() {
      // TODO: adding code
    },

    /**
     * Event fire when selection of fabric canvas has been updated
     * @param {Object}  target  the selected object
     */
    onSelectionUpdated({ target }) {
      if (this.awaitingAdd) {
        return;
      }

      this.toggleActiveObjects(true);

      target.get('type') === 'activeSelection'
        ? this.multiObjectSelected(target)
        : this.singleObjectSelected(target);
    },
    /**
     * Event fired when multi object of canvas is selected
     *
     * @param {Object}  target  the selected objects
     */
    multiObjectSelected(target) {
      target.set({
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true
      });

      this.setSelectedObjectId({ id: '' });

      this.setCurrentObject({});

      setCanvasUniformScaling(window.digitalCanvas, true);

      this.resetConfigTextProperties();
    },
    /**
     * Event fired when an object of canvas is selected
     *
     * @param {Object}  target  the selected object
     */
    singleObjectSelected(target) {
      const { id } = target;

      const objectData = this.currentObjects?.[id];

      if (isEmpty(objectData)) return;

      this.setSelectedObjectId({ id });

      setBorderHighlight(target, this.sheetLayout);

      this.setCurrentObject(this.getObjectProperties(objectData, target));

      if (
        target.get('type') === 'group' &&
        objectData.type === OBJECT_TYPE.TEXT
      ) {
        const rectObj = target.getObjects(OBJECT_TYPE.RECT)[0];

        setBorderObject(rectObj, objectData);
      }

      setCanvasUniformScaling(window.digitalCanvas, objectData.isConstrain);

      this.setObjectTypeSelected({ type: objectData.type });

      this.setPropertiesObjectType({ type: PROPERTIES_TOOLS.PROPERTIES.name });

      this.setIsOpenProperties({ objectId: id });

      handleObjectSelected(target, {
        playInOrder: this.playInOrder,
        playOutOrder: this.playOutOrder
      });
    },

    /**
     * Event fire when selection of fabric canvas has been cleared
     */
    onSelectionCleared() {
      this.closeProperties();
    },

    /**
     * Event fire when fabric object has been added
     */
    onObjectAdded({ target }) {
      // fake object is added when blur animation running, do not need to update canva when it's added
      if (target.fakeObject) return;

      this.handleCanvasChanged();
    },

    /**
     * Event fire when fabric object has been modified
     */
    onObjectModified() {
      // TODO: adding code
    },

    /**
     * Event fire when fabric object has been removed
     */
    onObjectRemoved({ target }) {
      // fake object is removed when blur animation end, do not need to update canva when it's removed
      if (target.fakeObject) return;

      this.handleCanvasChanged();
      this.setCurrentObject(null);
    },

    /**
     * Event fire when fabric object has been moved
     * @param {Object} e - Event moved of group
     */
    onObjectMoved(e) {
      if (e.target?.objectType) return;
      const { target } = e;

      target?.getObjects()?.forEach(item => {
        const { id, left, top } = item;
        const currentXInch = pxToIn(left + target.left + target.width / 2);
        const currentYInch = pxToIn(top + target.top + target.height / 2);

        const prop = {
          coord: {
            x: currentXInch,
            y: currentYInch
          }
        };

        this.setObjectPropById({ id, prop });
      });

      this.handleCanvasChanged();
    },

    /**
     * Event fire when click on fabric canvas
     */
    onMouseDown(event) {
      if (this.propertiesType === PROPERTIES_TOOLS.ANIMATION.name) {
        this.digitalCanvas.getObjects().forEach(obj => {
          obj.set({
            selectable: obj.objectType !== OBJECT_TYPE.BACKGROUND
          });
        });
      }

      if (this.awaitingAdd) {
        this.stopAddingInstruction();
        this.setToolNameSelected({ name: '' });
        this.digitalCanvas?.discardActiveObject();
        this.digitalCanvas?.renderAll();

        startDrawBox(this.digitalCanvas, event).then(
          ({ left, top, width, height }) => {
            if (this.awaitingAdd === OBJECT_TYPE.TEXT) {
              this.addText(left, top, width, height);
            }
            if (this.awaitingAdd === OBJECT_TYPE.IMAGE) {
              this.addImageBox(
                left,
                top,
                Math.max(width, MIN_IMAGE_SIZE),
                Math.max(height, MIN_IMAGE_SIZE)
              );
            }
            this.awaitingAdd = '';
          }
        );
      }
    },
    /**
     * Event fire when click on fabric canvas
     */
    onMouseUp(event) {
      const target = this.digitalCanvas.getActiveObject();
      if (target?.type === 'activeSelection') {
        this.setPropertiesType({ type: '' });
        return this.setToolNameSelected({ name: '' });
      }
      if (this.propertiesType === PROPERTIES_TOOLS.ANIMATION.name) {
        this.updateTriggerAnimation();
        return this.handleSelectAnimationObject(null, event);
      }
    },

    /**
     * Event fire when click on fabric canvas
     */
    onKeyUp(event) {
      const key = event.keyCode || event.charCode;

      if (event.target === document.body && isDeleteKey(key)) {
        this.deleteObject();
      }
    },

    /**
     * Event fire when user click on Text button on Toolbar to add new text on canvas
     */
    addText(x, y, width, height) {
      this.handleShowCustomChangeModal();

      const { object, data } = createTextBox(x, y, width, height, {});

      const [rect, text] = object._objects;

      const events = {
        rotated: this.handleRotated,
        moved: this.handleMoved,
        scaling: e => handleScalingText(e, text),
        scaled: e => this.handleTextBoxScaled(e, rect, text, data),
        mousedblclick: ({ target }) => this.handleDbClickText(target),
        deselected: handleObjectDeselected.bind(null, rect),
        mouseover: handleMouseOver,
        mouseout: handleMouseOut
      };

      object.on(events);

      this.addNewObject(data);

      const isConstrain = data.newObject.isConstrain;

      setCanvasUniformScaling(this.digitalCanvas, isConstrain);

      // handle show broken custom mapping icon for text
      this.addingObjectsEvent([object]);

      this.digitalCanvas.add(object);

      setTimeout(() => {
        selectLatestObject(this.digitalCanvas);
      });
    },

    /**
     * Event fire when Text object has been changed
     */
    onTextChanged({ target }) {
      const group = target?.group;
      if (!group) return;

      const minWidth = target.getMinWidth();
      const minHeight = target.height;
      const width = Math.max(group.width, target.width);
      const height = Math.max(group.height, target.height);

      const prop = {
        size: {
          width: pxToIn(width),
          height: pxToIn(height)
        },
        minHeight: pxToIn(minHeight),
        minWidth: pxToIn(minWidth),
        text: target.text
      };

      this.setObjectProp({ prop });
      this.setObjectPropById({ id: group.id, prop });
    },

    /**
     * Handle mouse move when waiting for add new element
     */
    handleBodyMouseMove({ clientX, clientY }) {
      if (!this.digitalCanvas) return;
      const {
        top,
        left,
        width,
        height
      } = this.digitalCanvas.lowerCanvasEl?.getBoundingClientRect();

      const x = clientX - left;
      const y = clientY - top;
      const visible = x > 0 && y > 0 && width - x > 0 && height - y > 0;

      this.x = x;
      this.y = y;
      this.visible = visible;
    },

    /**
     * Handle key press when waiting for add new element
     */
    handleKeyPress(event) {
      const key = event.keyCode || event.charCode;
      if (key === 27) {
        this.awaitingAdd = '';
        this.stopAddingInstruction();
        this.setToolNameSelected({ name: '' });
      }
    },

    /**
     * Event fire when waiting for add new element
     */
    startAddingInstruction() {
      if (!this.awaitingAdd) return;
      this.element = ELEMENTS[this.awaitingAdd] || 'box';

      document.body.addEventListener('mousemove', this.handleBodyMouseMove);
      document.body.addEventListener('keyup', this.handleKeyPress);
    },

    /**
     * Event fire when stop add element
     */
    stopAddingInstruction() {
      this.visible = false;
      this.x = 0;
      this.y = 0;
      document.body.removeEventListener('mousemove', this.handleBodyMouseMove);
      document.body.removeEventListener('keyup', this.handleKeyPress);
    },

    /**
     * Set border color when selected group object
     * @param {Element}  group  Group object
     */
    setBorderHighlight(group) {
      group.set({
        borderColor: this.sheetLayout?.id ? 'white' : '#bcbec0'
      });
    },

    /**
     * Event fire when user double click on Text area and allow user edit text as
     * @param {fabric.Object} group - Text Group element
     */
    handleDbClickText(group) {
      this.setPropertiesType({ type: '' });
      enableTextEditMode(group, prop => this.changeTextProperties(prop, group));
    },

    /**
     * Event fire when user change any property of selected text on the Text Properties
     *
     * @param {Object}  style  new style
     */
    changeTextProperties(prop, group) {
      this.changeElementProperties(prop, OBJECT_TYPE.TEXT);

      this.mappingHandleTextContentChange(prop, group);
    },

    /**
     * Fired when objects on canvas are modified, added, or removed
     */
    handleCanvasChanged() {
      return new Promise(resolve => {
        // update thumbnail
        this.getThumbnailUrl();

        // set state change for autosave
        this.canvasDidChanged();

        resolve();
      });
    },

    /**
     * call this function to update the active thumbnail
     */
    getThumbnailUrl: debounce(function() {
      const thumbnailUrl = this.digitalCanvas?.toDataURL({
        quality: THUMBNAIL_IMAGE_CONFIG.QUALITY,
        format: THUMBNAIL_IMAGE_CONFIG.FORMAT,
        multiplier: THUMBNAIL_IMAGE_CONFIG.MULTIPLIER
      });

      this.setThumbnail({
        frameId: this.currentFrameId,
        thumbnailUrl
      });
    }, 250),

    /**
     * Callback function for handle rotated to update
     * @param {Object} e - Shape or Clip art element
     */
    handleRotated(e) {
      const target = e.transform?.target;
      if (isEmpty(target)) return;
      const prop = {
        coord: {
          rotation: target.angle
        }
      };
      const objectType = target.objectType;
      switch (objectType) {
        case OBJECT_TYPE.SHAPE:
          this.changeShapeProperties(prop);
          break;
        case OBJECT_TYPE.CLIP_ART:
          this.changeClipArtProperties(prop);
          break;
        case OBJECT_TYPE.TEXT:
          this.changeTextProperties(prop);
          break;
        case OBJECT_TYPE.VIDEO:
          this.changeVideoProperties(prop);
          break;
        case OBJECT_TYPE.IMAGE:
          this.changeImageProperties(prop);
          break;
        case OBJECT_TYPE.PORTRAIT_IMAGE:
          this.changePortraitImageProperties(prop);
          break;
        default:
          return;
      }
    },
    /**
     * Callback function for handle scaling to set scale for shape base on width and height
     * @param {Object} e - Element Fabric
     */
    handleScaling(e) {
      const target = e.transform?.target;
      if (isEmpty(target)) return;
      let { scaleX, scaleY, width, height } = target;
      const currentWidthInch = pxToIn(width * scaleX);
      const currentHeightInch = pxToIn(height * scaleY);
      const objectType = target.objectType;
      let scale = {};
      switch (objectType) {
        case OBJECT_TYPE.SHAPE:
          scale = calcScaleElement(
            width,
            currentWidthInch,
            currentHeightInch,
            DEFAULT_SHAPE.MIN_SIZE
          );
          break;
        case OBJECT_TYPE.CLIP_ART:
          scale = calcScaleElement(
            width,
            currentWidthInch,
            currentHeightInch,
            DEFAULT_CLIP_ART.MIN_SIZE
          );
          break;
        case OBJECT_TYPE.IMAGE:
        case OBJECT_TYPE.VIDEO:
          scale = calcScaleElement(
            width,
            currentWidthInch,
            currentHeightInch,
            DEFAULT_IMAGE.MIN_SIZE
          );
          break;
        default:
          return;
      }

      target.set({
        scaleX: scale?.x || scaleX,
        scaleY: scale?.y || scaleY
      });
    },
    /**
     * Callback function for handle scaled to update element's dimension
     * @param {Object} e - Element Fabric
     */
    handleScaled(e) {
      const shadow = e.target?.shadow;
      const target = e.transform?.target;
      if (!isEmpty(shadow)) {
        const oldTarget = e.transform;
        const { offsetX, offsetY, blur } = shadow;
        target.set({
          shadow: {
            ...shadow,
            offsetX: (offsetX * oldTarget.scaleX) / target.scaleX,
            offsetY: (offsetY * oldTarget.scaleY) / target.scaleY,
            blur: handleObjectBlur(blur, oldTarget, target)
          }
        });
      }

      if (isEmpty(target)) return;
      const currentWidthInch = pxToIn(target.width * target.scaleX);
      const currentHeightInch = pxToIn(target.height * target.scaleY);
      const currentXInch = pxToIn(target.left);
      const currentYInch = pxToIn(target.top);
      const objectType = target.objectType;
      switch (objectType) {
        case OBJECT_TYPE.SHAPE: {
          const prop = mappingElementProperties(
            currentWidthInch,
            currentHeightInch,
            currentXInch,
            currentYInch,
            DEFAULT_SHAPE.MIN_SIZE
          );
          this.changeShapeProperties(prop);
          break;
        }

        case OBJECT_TYPE.CLIP_ART: {
          const prop = mappingElementProperties(
            currentWidthInch,
            currentHeightInch,
            currentXInch,
            currentYInch,
            DEFAULT_CLIP_ART.MIN_SIZE
          );
          this.changeClipArtProperties(prop);
          break;
        }

        case OBJECT_TYPE.IMAGE: {
          const prop = mappingElementProperties(
            currentWidthInch,
            currentHeightInch,
            currentXInch,
            currentYInch,
            DEFAULT_IMAGE.MIN_SIZE
          );
          this.changeImageProperties(prop);
          break;
        }

        case OBJECT_TYPE.PORTRAIT_IMAGE: {
          const minDimension = Math.min(currentWidthInch, currentHeightInch);
          const radius =
            target.mask === PORTRAIT_IMAGE_MASK.ROUNDED
              ? minDimension / 10
              : minDimension / 2;
          const prop = {
            width: currentWidthInch,
            height: currentHeightInch,
            scaleX: 1,
            scaleY: 1,
            rx: radius,
            ry: radius
          };
          this.changePortraitImageProperties(prop);
          break;
        }

        case OBJECT_TYPE.VIDEO: {
          const prop = mappingElementProperties(
            currentWidthInch,
            currentHeightInch,
            currentXInch,
            currentYInch,
            DEFAULT_IMAGE.MIN_SIZE
          );
          this.changeVideoProperties(prop);
          break;
        }
        default:
          return;
      }
    },

    /**
     * Callback function for handle scaled to update text's dimension
     * @param {Object} e - Text event data
     * @param {Element} rect - Rect object
     * @param {Element} text - Text object
     */
    handleTextBoxScaled(e, rect, text) {
      const target = e.transform?.target;

      if (isEmpty(target)) return;

      const currentXInch = pxToIn(target.left);
      const currentYInch = pxToIn(target.top);

      const prop = {
        coord: {
          x: currentXInch,
          y: currentYInch
        }
      };
      this.changeTextProperties(prop);

      setTextDimensionAfterScaled(target, rect, text);
    },

    /**
     * Callback function for handle moved to update element's dimension
     * @param {Object} e - Element Fabric
     */
    handleMoved(e) {
      const target = e.transform?.target;
      if (isEmpty(target)) return;
      const { left, top } = target;
      const currentXInch = pxToIn(left);
      const currentYInch = pxToIn(top);
      const objectType = target.objectType;

      const prop = {
        coord: {
          x: currentXInch,
          y: currentYInch
        }
      };

      switch (objectType) {
        case OBJECT_TYPE.SHAPE:
          this.changeShapeProperties(prop);
          break;
        case OBJECT_TYPE.CLIP_ART:
          this.changeClipArtProperties(prop);
          break;
        case OBJECT_TYPE.TEXT:
          this.changeTextProperties(prop);
          break;
        case OBJECT_TYPE.IMAGE:
          this.changeImageProperties(prop);
          break;
        case OBJECT_TYPE.VIDEO:
          this.changeVideoProperties(prop);
          break;
        case OBJECT_TYPE.PORTRAIT_IMAGE:
          this.changePortraitImageProperties(prop);
          break;
        default:
          return;
      }
    },
    /**
     * Adding shapes to canvas & store
     *
     * @param {Array} shapes  list of object of adding shapes
     */
    async addShapes(shapes) {
      this.handleShowCustomChangeModal();
      this.setLoadingState({ value: true });

      const toBeAddedShapes = shapes.map(s => {
        const newShape = new ShapeElementObject({
          ...s,
          id: getUniqueId()
        });

        return {
          id: newShape.id,
          object: newShape
        };
      });

      const eventListeners = {
        scaling: this.handleScaling,
        scaled: this.handleScaled,
        rotated: this.handleRotated,
        moved: this.handleMoved,
        mouseover: handleMouseOver,
        mouseout: handleMouseOut
      };

      await addPrintShapes(
        toBeAddedShapes,
        this.digitalCanvas,
        false,
        false,
        eventListeners
      );

      toBeAddedShapes.forEach(s => {
        const fabricObject = this.digitalCanvas
          .getObjects()
          .find(o => o.id === s.id);

        const { top, left } = fabricObject;

        const coord = new BasePosition({
          x: pxToIn(left),
          y: pxToIn(top)
        });

        s.object.update({ coord });

        // handle show broken custom mapping icon for shapes
        this.addingObjectsEvent([fabricObject]);

        this.addNewObject({
          id: s.id,
          newObject: s.object
        });
      });

      if (toBeAddedShapes.length === 1) {
        selectLatestObject(this.digitalCanvas);
      } else {
        this.closeProperties();
      }

      this.setLoadingState({ value: false });
    },
    /**
     * Event fire when user change any property of selected shape
     *
     * @param {Object}  prop  new prop
     */
    changeShapeProperties(prop) {
      this.changeElementProperties(prop, OBJECT_TYPE.SHAPE);
    },
    /**
     * Event fire when user change any property of selected clipart
     *
     * @param {Object}  prop  new prop
     */
    changeClipArtProperties(prop) {
      this.changeElementProperties(prop, OBJECT_TYPE.CLIP_ART);
    },
    /**
     * Change properties of current element
     *
     * @param {Object}  prop        new prop
     * @param {String}  objectType  object type want to check
     */
    async changeElementProperties(prop, objectType) {
      if (isEmpty(prop)) return;

      const element = window.digitalCanvas.getActiveObject();

      if (!isEmpty(prop.fontSize)) {
        const { x, y } = element?.aCoords?.tl || {};
        prop.coord = {
          x: pxToIn(x),
          y: pxToIn(y)
        };
      }

      if (isEmpty(element) || element.objectType !== objectType) return;

      const newProp = await this.updateElementProp(element, prop, objectType);

      this.modifyObjectsEvent(element);

      this.updateCurrentObject(element, newProp);

      if (isContainDebounceProp(newProp)) {
        this.debounceSetObjectProp(newProp);
      } else {
        this.setObjectProperties(newProp);
      }
    },

    /**
     * Handle aniamtion of selected objects
     * @param {Object} config config for animation
     */
    previewAnimation({ config }) {
      const object = this.digitalCanvas.getActiveObject();

      const args = [object, config, this.digitalCanvas];

      const animation =
        config.controlType === CONTROL_TYPE.PLAY_IN ? animateIn : animateOut;

      const animatedMethods = {
        [PLAY_IN_STYLES.BLUR]: animation.blur,
        [PLAY_IN_STYLES.FADE_IN]: animation.fade,
        [PLAY_IN_STYLES.FADE_SCALE]: animation.fadeScale,
        [PLAY_IN_STYLES.FADE_SLIDE_IN]: animation.fadeSlide,
        [PLAY_IN_STYLES.SLIDE_IN]: animation.slide
      };

      animatedMethods[config.style](...args);
    },

    /**
     * get fired when you click 'send' button
     * change the objectIds order and update z-index of object on canvas
     * @param {string} actionName indicated which 'send' button user clicked
     */
    changeObjectIdsOrder(actionName) {
      const selectedObject = this.digitalCanvas.getActiveObject();
      if (!selectedObject) return;

      const fabricObjects = this.digitalCanvas.getObjects();

      const numBackground = this.totalBackground;

      // if there is only one object -> return
      if (fabricObjects.length <= numBackground + 1) return;

      // indexs based on fabric object array
      let currentObjectIndex = fabricObjects.indexOf(selectedObject);
      let maxIndex = fabricObjects.length - 1;

      // calculate the indexs exclude the number of background
      currentObjectIndex -= numBackground;
      maxIndex -= numBackground;

      /**
       * to call the mutation to re-order objectIds in store and
       * to update the order of objects on canvas
       * @param {Number} oldIndex the current index of the selected object
       * @param {Number} newIndex the new index that the current object will be moved to
       */
      const updateZIndex = (oldIndex, newIndex) => {
        // update to store
        this.reorderObjectIds({ oldIndex, newIndex });
        // udpate to fabric objects on canvas
        fabricObjects[oldIndex + numBackground].moveTo(
          newIndex + numBackground
        );

        this.handleCanvasChanged();
      };

      if (actionName === ARRANGE_SEND.BACK && currentObjectIndex === 0) return;
      if (actionName === ARRANGE_SEND.BACK) {
        updateZIndex(currentObjectIndex, 0);
        return;
      }

      if (actionName === ARRANGE_SEND.FRONT && currentObjectIndex === maxIndex)
        return;
      if (actionName === ARRANGE_SEND.FRONT) {
        updateZIndex(currentObjectIndex, maxIndex);
        return;
      }

      if (actionName === ARRANGE_SEND.BACKWARD && currentObjectIndex === 0)
        return;
      if (actionName === ARRANGE_SEND.BACKWARD) {
        updateZIndex(currentObjectIndex, currentObjectIndex - 1);
        return;
      }

      if (
        actionName === ARRANGE_SEND.FORWARD &&
        currentObjectIndex === maxIndex
      )
        return;
      if (actionName === ARRANGE_SEND.FORWARD) {
        updateZIndex(currentObjectIndex, currentObjectIndex + 1);
      }
    },

    /**
     * Event fire when user click on Image button on Toolbar to add new image on canvas
     */
    async addImageBox(x, y, width, height, options) {
      this.handleShowCustomChangeModal();
      const id = getUniqueId();

      const size = new BaseSize({
        width: pxToIn(width),
        height: pxToIn(height)
      });

      const coord = new BasePosition({
        x: pxToIn(x),
        y: pxToIn(y)
      });

      this.setLoadingState({ value: true });

      const isVideo = options?.type === ASSET_TYPE.VIDEO;

      const mediaProp = {
        id,
        size,
        coord,
        imageUrl: DEFAULT_IMAGE.IMAGE_URL,
        hasImage: !!options?.src,
        originalUrl: options?.src,
        imageId: options?.id
      };

      const newMedia = {
        id,
        newObject: isVideo
          ? new VideoElementObject(mediaProp)
          : new ImageElementObject(mediaProp)
      };

      const eventListeners = {
        scaling: this.handleScaling,
        scaled: this.handleScaled,
        rotated: this.handleRotated,
        moved: this.handleMoved,
        dragenter: handleDragEnter,
        dragleave: handleDragLeave,
        drop: handleDragLeave,
        mousemove: handleMouseMove,
        mousedown: this.handleMouseDown,
        mouseover: handleMouseOver,
        mouseout: handleMouseOut
      };

      const image = await createImage(newMedia.newObject);

      useObjectControlsOverride(image.object);

      if (!isEmpty(image.size)) {
        newMedia.newObject.update({ size: image.size });
      }

      if (options?.src) {
        const newProp =
          options.type === ASSET_TYPE.VIDEO
            ? await setVideoSrc(
                image.object,
                options.src,
                options.thumbUrl,
                this.videoToggleStatus
              )
            : await setImageSrc(image.object, options.src);

        newMedia.newObject.update(newProp);
      }

      this.addNewObject(newMedia);

      imageBorderModifier(image.object);

      addEventListeners(image?.object, eventListeners);

      // handle show broken custom mapping icon image
      this.addingObjectsEvent([image?.object]);

      this.digitalCanvas.add(image?.object);

      selectLatestObject(this.digitalCanvas);

      this.setLoadingState({ value: false });
    },
    /**
     * Event fire when user change any property of selected image box
     *
     * @param {Object}  prop  new prop
     */
    changeImageProperties(prop) {
      this.changeElementProperties(prop, OBJECT_TYPE.IMAGE);
    },
    /**
     * Event fire when user change any property of selected portrait image
     *
     * @param {Object}  prop  new prop
     */
    changePortraitImageProperties(prop) {
      this.changeElementProperties(prop, OBJECT_TYPE.PORTRAIT_IMAGE);
    },
    /**
     * Event fire when user change any property of selected video
     *
     * @param {Object}  prop  new prop
     */
    async changeVideoProperties(prop) {
      if (!isEmpty(prop.volume)) this.changeVideoVolume(prop.volume);

      const thumbnailId = prop.customThumbnailId;

      if (!isEmpty(thumbnailId)) {
        const thumbnailAsset = await this.getAssetById(thumbnailId);
        prop.customThumbnailUrl = thumbnailAsset.imageUrl;
      }

      this.changeElementProperties(prop, OBJECT_TYPE.VIDEO);
    },
    /**
     * Event fire when user click on Clip art button on Toolbar to add new clip art on canvas
     * @param {Array} clipArts - list clip art add on Canvas
     */
    async addClipArt(clipArts) {
      this.handleShowCustomChangeModal();
      this.setLoadingState({ value: true });

      const toBeAddedClipArts = clipArts.map(c => {
        const id = getUniqueId();
        const newClipArt = new ClipArtElementObject({
          ...c,
          id
        });

        return {
          id,
          object: newClipArt
        };
      });

      const eventListeners = {
        scaling: this.handleScaling,
        scaled: this.handleScaled,
        mouseover: handleMouseOver,
        mouseout: handleMouseOut,
        rotated: this.handleRotated,
        moved: this.handleMoved
      };

      await addPrintClipArts(
        toBeAddedClipArts,
        this.digitalCanvas,
        false,
        false,
        eventListeners
      );

      toBeAddedClipArts.forEach(s => {
        const fabricObject = this.digitalCanvas
          .getObjects()
          .find(o => o.id === s.id);

        const { height, width, scaleX, scaleY, top, left } = fabricObject;

        const size = new BaseSize({
          width: pxToIn(width * scaleX),
          height: pxToIn(height * scaleY)
        });

        const coord = new BasePosition({
          x: pxToIn(left),
          y: pxToIn(top)
        });

        s.object.update({ coord, size });

        // handle show broken custom mapping icon for clipart
        this.addingObjectsEvent([fabricObject]);

        this.addNewObject({
          id: s.id,
          newObject: s.object
        });
      });

      if (toBeAddedClipArts.length === 1) {
        selectLatestObject(this.digitalCanvas);
      } else {
        this.closeProperties();
      }

      this.setLoadingState({ value: false });
    },
    /**
     * Adding background to canvas & store
     *
     * @param {Object}  background  the object of adding background
     * @param {Boolean} isLeft      is add to the left page or right page
     */
    async addBackground({ background }) {
      this.handleShowCustomChangeModal();
      const id = getUniqueId();

      const newBackground = new BackgroundElementObject({
        ...background,
        id,
        backgroundId: background.id,
        isLeftPage: true
      });

      this.setLoadingState({ value: true });

      await addDigitalBackground({
        id,
        backgroundProp: newBackground,
        canvas: window.digitalCanvas
      });

      this.addNewBackground({ background: newBackground });

      this.setLoadingState({ value: false });
    },
    /**
     * Event fire when user change any property of selected background
     *
     * @param {Object}  prop  new prop
     */
    changeBackgroundProperties({ backgroundId, prop }) {
      // TODO: Background properties will use data on APP STORE
      const background = window.digitalCanvas
        .getObjects()
        .find(o => backgroundId === o.id);

      if (isEmpty(background)) return;

      updateElement(background, prop, window.digitalCanvas);

      this.debounceSetBackgroundProp(prop);
    },
    /**
     * Event fire when user click remove background
     *
     * @param {String|Number} backgroundId  id of background will be removed
     */
    removeBackground({ backgroundId }) {
      deleteObjectById([backgroundId], window.digitalCanvas);

      this.deleteBackground({ isLeft: true });

      this.closeProperties();

      this.setPropertiesObjectType({ type: '' });
    },
    /**
     * Reset configs properties when close object
     */
    resetConfigTextProperties() {
      if (!isNonElementPropSelected(this.propertiesObjectType)) {
        this.setPropertiesObjectType({ type: '' });
      }

      this.setObjectTypeSelected({ type: '' });

      this.setSelectedObjectId({ id: '' });

      this.setCurrentObject(null);
    },
    /**
     * Close properties modal
     */
    closeProperties() {
      this.toggleActiveObjects(false);
      this.resetConfigTextProperties();
    },
    /**
     * Function handle to set object(s) to clipboard when user press Ctrl + C (Windows), Command + C (macOS), or from action menu
     * @param   {Object}  event event's clipboard
     */
    handleCopy(event) {
      if (!isValidTargetToCopyPast()) return;
      copyPpObject(
        event,
        this.currentObjects,
        this.pageSelected,
        window.digitalCanvas
      );
      this.countPaste = 1;
      this.isProcessingPaste = false;
    },
    /**
     * Function handle to get object(s) be copied from clipboard when user press Ctrl + V (Windows), Command + V (macOS), or from action menu
     */
    async handlePaste(event) {
      if (this.isProcessingPaste || !isValidTargetToCopyPast()) return;

      this.setLoadingState({ value: true });

      this.isProcessingPaste = true;

      await pastePpObject(
        event,
        this.pageSelected,
        this.countPaste,
        this.createElementFromPpData,
        this.setProcessingPaste,
        window.digitalCanvas,
        true
      );

      this.countPaste += 1;

      this.setProcessingPaste();

      this.setLoadingState({ value: false });
    },
    /**
     * Set processing paste state when user pasted base on delay time
     */
    setProcessingPaste: debounce(function() {
      this.isProcessingPaste = false;
    }, PASTE.DELAY_TIME),
    /**
     * Add text to the store and create fabric object
     *
     * @param {Object} textProperties PpData of the of a text object {id, size, coord,...}
     * @returns {Object} a fabric object
     */
    createTextFromPpData(textProperties) {
      const { object, objectData } = createTextBoxObject(textProperties);

      this.handleAddTextEventListeners(object, objectData);

      return object;
    },

    /**
     * Add shape/ clipart to the store and create fabric object
     *
     * @param {Object} objectData PpData of the of a shape object {id, size, coord,...}
     * @returns {Object} a fabric object
     */
    async createSvgFromPpData(objectData) {
      const eventListeners = {
        scaling: this.handleScaling,
        scaled: this.handleScaled,
        rotated: this.handleRotated,
        moved: this.handleMoved,
        mouseover: handleMouseOver,
        mouseout: handleMouseOut
      };
      const svg = await createSvgObject(objectData);

      addEventListeners(svg, eventListeners);

      return svg;
    },

    /**
     * Add clipart to the store and create fabric object
     *
     * @param {Object} objectData PpData of the of a clipart object {id, size, coord,...}
     * @returns {Object} a fabric object
     */
    async createClipartFromPpData(objectData) {
      const eventListeners = {
        scaling: this.handleScaling,
        scaled: this.handleScaled,
        rotated: this.handleRotated,
        moved: this.handleMoved,
        mouseover: handleMouseOver,
        mouseout: handleMouseOut
      };
      const clipart = await createClipartObject(objectData);

      addEventListeners(clipart, eventListeners);

      return clipart;
    },
    /**
     * Function handle add text event listeners
     * @param {Element} group - Group object contains rect and text object
     * @param {Object} data - Object's data
     */
    handleAddTextEventListeners(group, data) {
      const [rect, text] = group._objects;

      group.on({
        rotated: this.handleRotated,
        moved: this.handleMoved,
        scaling: e => handleScalingText(e, text),
        scaled: e => this.handleTextBoxScaled(e, rect, text, data),
        mousedblclick: ({ target }) => this.handleDbClickText(target),
        deselected: handleObjectDeselected.bind(null, rect),
        mouseover: handleMouseOver,
        mouseout: handleMouseOut
      });
    },
    /**
     * Add element to the store and create fabric object
     *
     * @param {Object} newData PpData of the of a element {id, size, coord,...}
     * @returns {Object} a fabric object
     */
    async createElementFromPpData(newData) {
      if (newData.type !== OBJECT_TYPE.BACKGROUND) {
        this.addNewObject({
          id: newData.id,
          newObject: newData
        });
      }

      return this.drawObject(newData);
    },
    /**
     * Handle create video/image object from pp data;
     * @param {Object} mediaProperties - video/image prop to create
     * @returns
     */
    async createMediaFromPpData(mediaProperties) {
      const eventListeners = {
        scaling: this.handleScaling,
        scaled: this.handleScaled,
        rotated: this.handleRotated,
        moved: this.handleMoved,
        dragenter: handleDragEnter,
        dragleave: handleDragLeave,
        drop: handleDragLeave,
        mousemove: handleMouseMove,
        mousedown: this.handleMouseDown,
        mouseover: handleMouseOver,
        mouseout: handleMouseOut
      };
      const media = await createMediaObject(
        mediaProperties,
        this.videoToggleStatus
      );

      addEventListeners(media, eventListeners);

      return media;
    },
    /**
     * create fabric object
     *
     * @param {Object} properties PpData of the of a background object {id, size, coord,...}
     * @returns {Object} a fabric objec
     */
    async createPortraitImageFromPpData(properties) {
      const eventListeners = {
        scaling: this.handleScaling,
        scaled: this.handleScaled,
        rotated: this.handleRotated,
        moved: this.handleMoved,
        mouseover: handleMouseOver,
        mouseout: handleMouseOut
      };

      const image = await createPortraitImageObject(properties);

      addEventListeners(image, eventListeners);

      return image;
    },
    /**
     * Delete objects on canvas
     */
    deleteObject() {
      const fbObjects = this.digitalCanvas.getActiveObjects();
      const ids = fbObjects.map(o => o.id);

      // call this function before deleting objects on canvas
      this.customMappingDeleteObjects(fbObjects);

      this.deleteObjects({ ids });

      deleteSelectedObjects(this.digitalCanvas);

      const props = calcAnimationOrder(this.digitalCanvas);
      this.setPropOfMultipleObjects({ data: props });
    },

    /**
     * create and render objects on the canvas
     * @param {Object} objects ppObjects that will be rendered
     */
    async drawObjectsOnCanvas(objects) {
      resetObjects(this.digitalCanvas);

      if (isEmpty(objects)) return;

      this.setLoadingState({ value: true });

      const allObjectPromises = objects.map(objectData => {
        return this.drawObject(objectData);
      });

      const listStatus = await Promise.allSettled(allObjectPromises);

      const listFabricObjects = [];

      listStatus.forEach(item => {
        item.value && listFabricObjects.push(item.value);
      });

      await this.updateMappingIcon(listFabricObjects);

      resetObjects(this.digitalCanvas);
      this.digitalCanvas.add(...listFabricObjects);
      this.digitalCanvas.requestRenderAll();

      this.setLoadingState({ value: false });
    },
    /**
     * To update value and color of map icon on object (text & image) when hover
     */
    async updateMappingIcon(fbObjects) {
      if (isLayoutMappingChecker(this.sheetMappingConfig)) {
        // handle case layout mapping
        await this.iconLayoutMapping(fbObjects);
        return;
      }

      // handle case custom mapping
      if (isCustomMappingChecker(this.sheetMappingConfig))
        this.iconCustomMapping(fbObjects);
    },

    /**
     * To check if disable icon mapping should show or not
     * if an object has id differ from ids of print objects => object was create in Digital
     * so display broken icon
     *
     * @param {Array} fbObjects fabric objects
     */
    iconCustomMapping(fbObjects) {
      const isSupplemental = !this.currentFrame.fromLayout;
      if (!isCustomMappingChecker(this.sheetMappingConfig) || isSupplemental)
        return;

      const printIds = Object.keys(this.printObjects);
      const isSecondary = isSecondaryFormat(this.projectMappingConfig, true);

      fbObjects.forEach(o => {
        const isNotInPrintObject = !printIds.includes(o.id) && isSecondary;
        const mapping = this.elementMappings.find(
          el => el.digitalElementId === o.id
        );
        const isBroken = mapping?.mapped === false;

        // the broken icons shown
        if (isBroken || isNotInPrintObject)
          o.mappingInfo = getBrokenCustomMapping(o);
      });
    },

    /**
     * To update value and color of map icon on object (text & image) when hover
     */
    async iconLayoutMapping(fbObjects) {
      const ppObjectByIdsOfAllFrames = isEmpty(this.elementMappings)
        ? {}
        : await this.getDigitalObjects();

      // create a object for faster and easier to access later.
      const fbObjectsById = {};
      fbObjects.forEach(o => (fbObjectsById[o.id] = o));

      let imageCouter = 1;
      let textCounter = 1;

      this.elementMappings.forEach(el => {
        const objectId = el.digitalElementId;

        const fbElement = fbObjectsById[objectId];
        const ppElement = ppObjectByIdsOfAllFrames[objectId];

        if (!ppElement) {
          if (!el.printElementId) return;

          const printObject = this.printObjects[el.printElementId];
          const isImageObj = isPpImageObject(printObject);

          isImageObj ? imageCouter++ : textCounter++;
          return;
        }

        const isMedia =
          isPpImageObject(ppElement) || isPpVideoObject(ppElement);
        const value = isMedia ? imageCouter++ : textCounter++;
        const color = UniqueColor.generateColor(value - 1, isMedia);

        if (!fbElement) return;
        fbElement.mappingInfo = { color, value, id: el.id, mapped: el.mapped };
      });
    },
    /**
     * create fabric object
     *
     * @param {Object} objectData PpData of the of a background object {id, size, coord,...}
     * @returns {Object} a fabric objec
     */
    async createBackgroundFromPpData(backgroundProp) {
      return createBackgroundFabricObject(backgroundProp, this.digitalCanvas);
    },

    /**
     *  fire every 60s by default to save working progress
     */
    async handleAutosave() {
      if (!this.isCanvasChanged) return;

      this.updateSavingStatus({ status: SAVE_STATUS.START });
      this.setLoadingState({ value: false, isFreeze: true });

      await this.saveData(this.currentFrameId);

      this.setLoadingState({ value: false, isFreeze: false });
      this.updateSavingStatus({ status: SAVE_STATUS.END });
    },

    /**
     * Save sheet and sheet's frame data to storage
     * @param {String | Number} frameId id of frame
     * @param {String | Number} sheetId id of sheet - difine when user switch screen
     */
    async saveData(frameId, sheetId) {
      const curSheetId = sheetId || this.pageSelected.id;
      this.setAutosaveTimer();

      this.updateFrameObjects({ frameId });
      const data = this.getDataEditScreen(frameId);

      data.sheetId = curSheetId;
      // update elementMappings if any objects deleted
      if (!isEmpty(this.elementMappings)) {
        const frames = await this.getSheetFrames(curSheetId);

        const currFrame = data.frame;

        const activeFrames = [
          ...frames.filter(f => f.id !== currFrame.id),
          { objects: currFrame.objects }
        ];

        const objectIds = activeFrames
          .map(frame => frame.objects.map(o => o.id))
          .flat();

        const elementMappingIds = [];

        this.elementMappings.forEach(el => {
          if (el.digitalElementId && !objectIds.includes(el.digitalElementId)) {
            elementMappingIds.push(el.id);
          }
        });

        if (!isEmpty(elementMappingIds)) {
          // update elementMapping
          await this.updateElementMappingByIds(elementMappingIds, true);

          this.elementMappings.forEach(el => {
            if (elementMappingIds.includes(el.digitalElementId))
              el.digitalElementId = '';
          });
        }
      }
      await this.saveEditScreen(
        data,
        this.elementMappings,
        this.isCanvasChanged
      );

      this.resetCanvasChanges();
    },
    /**
     * Change fabric properties of current element
     *
     * @param   {Object}  element     selected element
     * @param   {Object}  prop        new prop
     * @param   {String}  objectType  object type of selected element
     *
     * @returns {Promise<Object>}              property of element after changed
     */
    async updateElementProp(element, prop, objectType) {
      if (objectType === OBJECT_TYPE.TEXT) {
        return this.updateTextElementProp(element, prop);
      }

      if (objectType === OBJECT_TYPE.IMAGE) {
        return this.updateImageElementProp(element, prop);
      }

      if (objectType === OBJECT_TYPE.PORTRAIT_IMAGE) {
        return this.updatePortraitImageElementProp(element, prop);
      }

      if (objectType === OBJECT_TYPE.VIDEO) {
        return this.updateVideoElementProp(element, prop);
      }

      updateElement(element, prop, window.digitalCanvas);

      const newProp = fabricToPpObject(element);
      merge(prop, newProp);

      return prop;
    },
    /**
     * Change fabric properties of current text element
     *
     * @param   {Object}  element selected element
     * @param   {Object}  prop    new prop
     *
     * @returns {Object}          property of element after changed
     */
    updateTextElementProp(element, prop) {
      applyTextBoxProperties(element, prop);

      const newProp = fabricToPpObject(element);

      const text = element?._objects?.[1];

      if (text) {
        const { minBoundingWidth, minBoundingHeight } = getTextSizeWithPadding(
          text
        );

        newProp.minWidth = pxToIn(minBoundingWidth);
        newProp.minHeight = pxToIn(minBoundingHeight);
      }

      merge(prop, newProp);

      return prop;
    },
    /**
     * Change fabric properties of current image element
     *
     * @param   {Object}  element selected element
     * @param   {Object}  prop    new prop
     *
     * @returns {Object}          property of element after changed
     */
    updateImageElementProp(element, prop) {
      const { border } = prop;

      if (!isEmpty(border)) {
        applyBorderToImageObject(element, border);
      }

      updateElement(element, prop, window.digitalCanvas);

      const newProp = fabricToPpObject(element);
      merge(prop, newProp);

      return prop;
    },

    /**
     * Change fabric properties of current image element
     *
     * @param   {Object}  element selected element
     * @param   {Object}  prop    new prop
     *
     * @returns {Object}          property of element after changed
     */
    updatePortraitImageElementProp(element, prop) {
      const { border, size } = prop;

      if (!isEmpty(border)) {
        applyBorderToImageObject(element, border);
      }

      if (!isEmpty(size)) {
        const { width } = size;
        const radius =
          element.mask === PORTRAIT_IMAGE_MASK.ROUNDED ? width / 10 : width / 2;
        prop.rx = radius;
        prop.ry = radius;
        prop.scaleX = 1;
        prop.scaleY = 1;
      }

      updateElement(element, prop, window.digitalCanvas);

      const newProp = fabricToPpObject(element);
      merge(prop, newProp);

      return prop;
    },

    /**
     * Change fabric properties of current video element
     *
     * @param   {Object}  element selected element
     * @param   {Object}  prop    new prop
     *
     * @returns {Promise<Object>}          property of element after changed
     */
    async updateVideoElementProp(element, prop) {
      const { border, customThumbnailUrl, thumbnailUrl } = prop;

      if (!isEmpty(border)) {
        applyBorderToImageObject(element, border);
      }

      const url = customThumbnailUrl || thumbnailUrl;
      if (!isEmpty(url)) {
        const thumbnail = await createMediaOverlay(url);

        element.set({ thumbnail, dirty: true });
      }

      updateElement(element, prop, window.digitalCanvas);

      const newProp = fabricToPpObject(element);
      merge(prop, newProp);

      return prop;
    },
    /**
     * Update current object by mutate the store
     *
     * @param {Object}  element selected object
     * @param {Object}  newProp new prop
     */
    updateCurrentObject(element, newProp) {
      return new Promise(resole => {
        if (isEmpty(this.currentObjects)) {
          resole();

          return;
        }

        const prop = cloneDeep(this.currentObjects[element.id]);

        merge(prop, newProp);

        this.setCurrentObject(this.getObjectProperties(prop, element));

        resole();
      });
    },
    /**
     * Set properties of selected object
     *
     * @param {Object}  prop  new prop
     */
    setObjectProperties(prop) {
      this.setObjectProp({ prop });

      this.handleCanvasChanged();
    },
    /**
     * Set properties of selected object
     * Use with debounce
     *
     * @param {Object}  prop  new prop
     */
    debounceSetObjectProp: debounce(function(prop) {
      this.setObjectProperties(prop);
    }, DEBOUNCE_MUTATION),
    /**
     * Set properties of selected background then trigger the change
     * Use with debounce
     *
     * @param {Object}  prop  new prop
     */
    debounceSetBackgroundProp: debounce(function(prop) {
      this.setBackgroundProp({ prop });

      this.handleCanvasChanged();

      this.updateTriggerBackgroundChange();
    }, DEBOUNCE_MUTATION),
    /**
     * Undo user action
     */
    undo() {
      this.undoRedoCanvas.undo();
    },
    /**
     * Redo user action
     */
    redo() {
      this.undoRedoCanvas.redo();
    },
    /**
     * End instruction
     */
    endInstruction() {
      this.stopAddingInstruction();

      this.awaitingAdd = '';
    },

    /**
     * Handle reset image
     */
    async handleRemoveImage() {
      const activeObject = this.digitalCanvas.getActiveObject();

      const prop = await setImageSrc(activeObject, null);
      activeObject.canvas.renderAll();

      const imgProp = { id: activeObject.id, prop };
      this.setObjectPropById(imgProp);
      await this.mappingHandleImageContentChange(imgProp);

      this.setCurrentObject(this.currentObjects[activeObject.id]);

      this.getThumbnailUrl();
    },
    /**
     * Handle centercrop
     */
    handleCentercrop() {
      const activeObject = this.digitalCanvas.getActiveObject();

      const prop = centercrop(activeObject);
      activeObject.canvas.renderAll();

      const imgProp = { id: activeObject.id, prop };
      this.setObjectPropById(imgProp);
    },
    /**
     * Play / pause current video
     */
    videoTogglePlay() {
      const video = this.digitalCanvas.getActiveObject();

      if (isEmpty(video) || isEmpty(this.currentObjects)) return;

      const isPlaying = isVideoPlaying(video);

      isPlaying ? video.pause() : video.play();

      this.setCurrentObject({
        ...this.currentObjects[video.id],
        isPlaying: !isPlaying
      });
    },
    /**
     * Update status of video on properties menu
     *
     * @param {String | Number} id        id of finishing play video
     * @param {Boolean}         isPlaying is video playing
     */
    videoToggleStatus(id, isPlaying = false) {
      const currentObjectId = this.getProperty('id');

      if (currentObjectId !== id) return;

      const prop = cloneDeep(this.currentObjects?.[id]);

      this.setCurrentObject({ ...prop, isPlaying });
    },
    /**
     * Rewind current video
     */
    videoRewind() {
      const video = this.digitalCanvas.getActiveObject();

      if (isEmpty(video)) return;

      video.seek(-VIDEO_SPEED_UP_TIME);
    },
    /**
     * Keep rewind current video
     */
    videoKeepRewind() {
      const video = this.digitalCanvas.getActiveObject();

      if (isEmpty(video)) return;

      video.rewind();
    },
    /**
     * Cancel keep rewind current video
     */
    videoCancelRewind() {
      const video = this.digitalCanvas.getActiveObject();

      if (isEmpty(video)) return;

      video.rewind(false);
    },
    /**
     * Froward current video
     */
    videoForward() {
      const video = this.digitalCanvas.getActiveObject();

      if (isEmpty(video)) return;

      video.seek(VIDEO_SPEED_UP_TIME);
    },
    /**
     * Keep forward current video
     */
    videoKeepForward() {
      const video = this.digitalCanvas.getActiveObject();

      if (isEmpty(video)) return;

      video.forward();
    },
    /**
     * Cancel keep forward current video
     */
    videoCancelForward() {
      const video = this.digitalCanvas.getActiveObject();

      if (isEmpty(video)) return;

      video.forward(false);
    },
    /**
     * Get properties with video specific value
     *
     * @param   {Object}  prop  current object properties
     * @param   {Object}  video video element
     * @returns {Object}        new properties
     */
    getObjectProperties(prop, video) {
      if (
        prop?.type !== OBJECT_TYPE.VIDEO &&
        prop?.objectType !== OBJECT_TYPE.VIDEO
      )
        return prop;

      const isPlaying = isVideoPlaying(video);

      return { ...prop, isPlaying };
    },
    /**
     * Get properties with video specific value
     *
     * @param {Number}  volume  new volumne
     */
    changeVideoVolume(volume) {
      const video = this.digitalCanvas.getActiveObject();

      if (isEmpty(video)) return;

      video.changeVolume(volume / 100);
    },
    /**
     * Handle click on fabric object
     * @param {Object} event - Event when click object
     */
    handleMouseDown(event) {
      const target = event.target;

      if (!target.selectable) return;

      if (target.objectType === OBJECT_TYPE.IMAGE) {
        if (!target.isHoverControl) return;

        this.$emit('openCropControl');
      }

      if (target.objectType === OBJECT_TYPE.VIDEO) {
        if (!target.isHoverPlayIcon) return;

        this.videoTogglePlay();
      }
    },

    /**
     * Handle apply animation
     * @param {String} storeType store type to apply animation
     * @param {Object} animationIn config for play in animation
     * @param {Object} animationOut config for play out animation
     */
    async handleApplyAnimation({
      objectType,
      storeType,
      animationIn,
      animationOut
    }) {
      const animationType = isEmpty(animationIn)
        ? 'animationOut'
        : 'animationIn';

      const animationConfig = isEmpty(animationIn) ? animationOut : animationIn;

      const prop = { [animationType]: animationConfig };

      const isBackground = objectType === OBJECT_TYPE.BACKGROUND;

      if (storeType === APPLY_MODE.SELF) {
        return isBackground
          ? this.setBackgroundProp({ prop })
          : this.setObjectProp({ prop });
      }

      if (storeType === APPLY_MODE.FRAME) {
        this.setPropMultiObjectsBaseOnType(objectType, prop);
        return;
      }

      const storeTypeId = {
        [APPLY_MODE.SECTION]: this.pageSelected.sectionId,
        [APPLY_MODE.BOOK]: this.$route.params.bookId
      };

      const animationProp = {
        objectType,
        storeType,
        animationType,
        id: storeTypeId[storeType],
        setting: animationConfig
      };

      // call api to save animation to DB
      await this.updateAnimation(animationProp);

      this.setPropMultiObjectsBaseOnType(objectType, prop);
      this.setObjectPropOfSheetFrames({ prop: animationProp });
    },

    /**
     * Set prop for multi objects based on their type
     * @param {String} objectType Type of object
     * @param {Object} prop Prop will be set to objects
     */
    setPropMultiObjectsBaseOnType(objectType, prop) {
      const objects = Object.values(this.currentObjects);
      const props = objects
        .filter(obj => obj.type === objectType)
        .map(obj => ({ id: obj.id, prop }));

      this.setPropOfMultipleObjects({ data: props });
    },

    /**
     * Handle change animation order
     * @param {Number} playInOrder object's play in order
     * @param {Number} playOutOrder object's play out order
     */
    handleChangeAnimationOrder({ playInOrder, playOutOrder }) {
      if (!isNaN(playInOrder)) {
        this.setPlayInOrder(playInOrder);
      }

      if (!isNaN(playOutOrder)) {
        this.setPlayOutOrder(playOutOrder);
      }

      const target = this.digitalCanvas.getActiveObject();

      handleObjectSelected(target, {
        playInOrder: this.playInOrder,
        playOutOrder: this.playOutOrder
      });
    },

    /**
     * Handle open animation properties
     * @param {Object} event mouse event when click to canvas
     */
    handleOpenAnimations(event, selectedId) {
      if (event?.target && event.target.objectType !== OBJECT_TYPE.BACKGROUND) {
        const canvasObjects = this.digitalCanvas.getObjects();

        canvasObjects.forEach(object => {
          object.set({
            selectable: object.objectType !== OBJECT_TYPE.BACKGROUND
          });
          object.setControlsVisibility({ mtr: true });
        });

        this.digitalCanvas.setActiveObject(event.target);

        return;
      }

      this.digitalCanvas?.discardActiveObject();
      this.digitalCanvas?.renderAll();

      const objects = cloneDeep(this.currentObjects);

      const playInIds = cloneDeep(this.playInIds);
      const playOutIds = cloneDeep(this.playOutIds);

      playInIds.forEach((ids, index) => {
        ids.forEach(id => {
          if (!isEmpty(objects[id])) {
            objects[id].playIn = index + 1;
          }
        });
      });

      playOutIds.forEach((ids, index) => {
        ids.forEach(id => {
          if (!isEmpty(objects[id])) {
            objects[id].playOut = index + 1;
          }
        });
      });

      renderOrderBoxes(objects, selectedId);
    },

    /**
     * Handle select animation object
     * @param {String} id parallel object's id
     */
    handleSelectAnimationObject(id, event) {
      this.handleOpenAnimations(event, id);

      const objects = this.digitalCanvas.getObjects();
      const ctx = this.digitalCanvas.getContext('2d');

      objects.forEach(object => {
        if (object.id !== id) {
          object.setControlsVisibility({ mtr: true });
          return;
        }

        const playInIndex =
          this.playInIds.findIndex(ids => ids.includes(id)) || 0;
        const playOutIndex =
          this.playOutIds.findIndex(ids => ids.includes(id)) || 0;

        object.setControlsVisibility({
          mtr: false
        });

        object.set({
          playIn: playInIndex + 1,
          playOut: playOutIndex + 1
        });

        object._renderControls.call(object, ctx, {
          hasBorders: true,
          hasControls: true
        });
      });
    },

    async handleSaveLayout(settings) {
      if (settings.ids.includes(this.currentFrameId) && this.isCanvasChanged) {
        await this.saveData(this.currentFrameId);
      }

      this.saveCustomDigitalLayout(settings);
    },
    /**
     * Draw object into canvas
     *
     * @param   {Object}  objectData  object to be draw
     * @returns {Promise}
     */
    drawObject(objectData) {
      const drawObjectMethods = {
        [OBJECT_TYPE.BACKGROUND]: this.createBackgroundFromPpData,
        [OBJECT_TYPE.TEXT]: this.createTextFromPpData,
        [OBJECT_TYPE.SHAPE]: this.createSvgFromPpData,
        [OBJECT_TYPE.CLIP_ART]: this.createClipartFromPpData,
        [OBJECT_TYPE.IMAGE]: this.createMediaFromPpData,
        [OBJECT_TYPE.VIDEO]: this.createMediaFromPpData,
        [OBJECT_TYPE.PORTRAIT_IMAGE]: this.createPortraitImageFromPpData
      };

      return drawObjectMethods[objectData.type](objectData);
    },
    /**
     * To set timer for autosaving
     */
    setAutosaveTimer() {
      this.stopAutosaving();
      this.autoSaveTimer = setInterval(this.handleAutosave, AUTOSAVE_INTERVAL);
    },
    /**
     * To clear the autosaving timer
     */
    stopAutosaving() {
      clearInterval(this.autoSaveTimer);
    },
    /**
     * To pause all the playing videos on canvas
     */
    stopVideos() {
      const videos = this.digitalCanvas
        .getObjects()
        .filter(o => o.objectType === OBJECT_TYPE.VIDEO);
      videos.forEach(v => v.pause());
    },
    /**
     * call api to get object on print editor
     *
     * @param {String} sheetId
     * @returns list of print object by id
     */
    async getPrintObjects(sheetId) {
      if (!sheetId) return;

      const printSheet = await getSheetInfoApi(sheetId);
      this.printObjects = getObjectById(printSheet.objects);
    },
    /**
     * Show warning modal when having custom changes on renderd mapped layout sheet
     */
    async handleShowCustomChangeModal() {
      const isHideMess = getItem(CUSTOM_CHANGE_MODAL) || false;

      const isSupplemental = !this.currentFrame.fromLayout;
      const nonConnections = this.elementMappings.length === 0;
      const isNotAllowSyncLayout = !isAllowSyncLayoutData(
        this.projectMappingConfig,
        this.sheetMappingConfig
      );

      if (
        isHideMess ||
        isNotAllowSyncLayout ||
        isSupplemental ||
        nonConnections ||
        !isSecondaryFormat(this.projectMappingConfig, true)
      )
        return;

      this.isShowCustomChangesConfirm = true;
      this.toggleModal({ isOpenModal: true });
    },

    /**
     * Handle to show custom mapping modal when editing / adding objects
     */
    async handleShowCustomMappingModal() {
      const isHideMess = getItem(CUSTOM_MAPPING_MODAL) || false;
      const isSupplemental = !this.currentFrame.fromLayout;
      const isNotAllowSyncCustom = !isAllowSyncCustomData(
        this.projectMappingConfig,
        this.sheetMappingConfig
      );

      if (
        isHideMess ||
        isNotAllowSyncCustom ||
        isSupplemental ||
        !isSecondaryFormat(this.projectMappingConfig, true)
      )
        return;

      this.isShowCustomMappingModal = true;
      this.toggleModal({
        isOpenModal: true
      });
    },
    /**
     *  To hide the warning modal and save user setting if any
     *
     * @param {Boolean} isHideMess whether user click on the hide message checkbox
     */
    onClickGotItCustomChange(isHideMess) {
      this.isShowCustomChangesConfirm = false;
      this.toggleModal({
        isOpenModal: false
      });

      if (!isHideMess) return;

      setItem(CUSTOM_CHANGE_MODAL, true);
    },
    /**
     *  Mapping content change modal
     *  To hide the warning modal and save user setting if any
     *
     * @param {Boolean} isHideMess whether user click on the hide message checkbox
     */
    onClickGotItContentChange(isHideMess) {
      this.isShowMappingContentChange = false;
      this.toggleModal({
        isOpenModal: false
      });

      if (!isHideMess) return;

      setItem(CONTENT_CHANGE_MODAL, true);
    },
    /**
     *  Mapping content change modal
     *  To hide the warning modal and save user setting if any
     *
     * @param {Boolean} isHideMess whether user click on the hide message checkbox
     */
    onClickGotItVideoContentChange(isHideMess) {
      this.isShowMappingVideoContentChange = false;
      this.toggleModal({
        isOpenModal: false
      });

      if (!isHideMess) return;

      setItem(CONTENT_VIDEO_CHANGE_MODAL, true);
    },
    /**
     *  Custom mapping modal when edit object or adding new objects
     *  To hide the warning modal and save user setting if any
     *
     * @param {Boolean} isHideMess whether user click on the hide message checkbox
     */
    onClickGotItCustomMappingModal(isHideMess) {
      this.isShowCustomMappingModal = false;
      this.toggleModal({
        isOpenModal: false
      });

      if (!isHideMess) return;

      setItem(CUSTOM_MAPPING_MODAL, true);
    },
    /**
     * Draw objects on canvas with mapping icon and their values
     */
    async drawLayout() {
      if (this.isRenderingObjects) return;

      this.isRenderingObjects = true;

      // get sheet element mappings
      this.elementMappings = await this.storeElementMappings(
        this.pageSelected.id
      );

      await this.drawObjectsOnCanvas(this.sheetLayout);

      this.isRenderingObjects = false;
    },
    /**
     * Get digital object for show mapping icon
     */
    async getDigitalObjects() {
      const frames = await this.getSheetFrames(this.pageSelected.id);
      return getDigitalObjectById(frames);
    },
    /**
     * Hanlde break mapping connection when content change, if digital is the 2ndary editor
     * Handle break connection and update UI
     */
    async mappingHandleTextContentChange(prop, group) {
      if (!group) return;

      const res = await this.handleTextContentChange(
        this.elementMappings,
        prop,
        group.id,
        true
      );
      if (!res) return;

      const { isDrawObjects, elementMappings, isShowModal } = res;

      elementMappings && (this.elementMappings = elementMappings);
      if (isCustomMappingChecker(this.sheetMappingConfig)) {
        this.isShowCustomMappingModal = Boolean(isShowModal);
      } else {
        this.isShowMappingContentChange = Boolean(isShowModal);
      }

      // update canvas
      if (isDrawObjects) {
        updateCanvasMapping(group.id, window.digitalCanvas);
      }
    },
    /**
     * Handle break mapping connection when image content change,
     * if print is the 2ndary editor
     */
    async mappingHandleImageContentChange(prop) {
      this.canvasDidChanged();

      const props = prop.data ? prop.data : [prop];

      const mediaIds = [];
      const videoIds = [];

      props.forEach(el => {
        if (isPpMediaObject(el.prop) && el.prop.imageUrl) mediaIds.push(el.id);

        if (isPpVideoObject(el.prop)) videoIds.push(el.id);
      });

      const res = await this.handleImageContentChange(
        this.elementMappings,
        mediaIds,
        true,
        videoIds
      );

      if (!res) return;

      const {
        isDrawObjects,
        elementMappings,
        isShowModal,
        isShowVideoModal,
        changeMappingIds
      } = res;

      elementMappings && (this.elementMappings = elementMappings);
      this.isShowMappingVideoContentChange = Boolean(isShowVideoModal);

      if (isCustomMappingChecker(this.sheetMappingConfig)) {
        this.isShowCustomMappingModal = Boolean(isShowModal);
      } else {
        this.isShowMappingContentChange = Boolean(isShowModal);
      }

      // update canvas
      if (isDrawObjects)
        updateCanvasMapping(changeMappingIds, window.digitalCanvas);
    },
    /**
     * Trigger after save / auto save, apply portrait, layout
     */
    resetCanvasChanges() {
      this.isCanvasChanged = false;
    },
    /**
     * Trigger when any change on canvas
     */
    canvasDidChanged() {
      this.isCanvasChanged = true;
    },
    /**
     * The function is triggered when new objects are added on canvas via creation tool
     *
     * @param {Array} objects fabric array of objects adding on canvas
     */
    addingObjectsEvent(objects) {
      this.iconCustomMapping(objects);
      this.handleShowCustomMappingModal();
    },

    /**
     * The function is triggered when objects are modified
     *
     */
    modifyObjectsEvent(element) {
      const isNonMappedElement = element?.mappingInfo?.mapped === false;
      const isScondary = isSecondaryFormat(this.projectMappingConfig, true);
      const isSupplemental = !this.currentFrame.fromLayout;

      if (
        !isCustomMappingChecker(this.sheetMappingConfig) ||
        isNonMappedElement ||
        !isScondary ||
        isSupplemental
      )
        return;

      this.handleShowCustomMappingModal();

      // break the connection
      element.mappingInfo = getBrokenCustomMapping(element);

      this.digitalCanvas.requestRenderAll();

      const mapping =
        this.elementMappings.find(el => el.digitalElementId === element.id) ||
        {};

      mapping.mapped = false;

      this.breakSingleConnection(mapping?.id);
    },
    /**
     * Get project mappping config
     */
    async getProjectMappingConfig() {
      const bookId = this.$route.params.bookId;
      this.projectMappingConfig = await this.getMappingConfig(bookId);
    },
    async fetchSheetMappingConfig() {
      this.sheetMappingConfig = await this.getSheetMappingConfig(
        this.pageSelected.id
      );
    },
    /**
     * Triggered when user apply digital layout
     */
    async handleApplyLayout() {
      await this.fetchSheetMappingConfig();
      await this.drawLayout();
    },
    /**
     * Trigger when user reset sheet mapping type
     */
    async resetMappingType() {
      await Promise.all([
        this.getProjectMappingConfig(),
        this.fetchSheetMappingConfig()
      ]);
      // get sheet element mappings
      this.elementMappings = await this.storeElementMappings(
        this.pageSelected.id
      );
      await this.drawLayout();
    },
    customMappingDeleteObjects(fbObjects) {
      // handle show modal when is in custom mapping and print is primary
      if (
        !isCustomMappingChecker(this.sheetMappingConfig) ||
        isPrimaryFormat(this.projectMappingConfig, true)
      )
        return;

      // a mapped object could have mappingInfo = undefined (for custom mapping)
      // or mapping.mapped  = true
      // therefore to check whether object is mapped we use mappingInfo.mapped !== false
      this.isShowCustomMappingModal = fbObjects.some(
        o => o?.mappingInfo?.mapped !== false && !isFbBackground(o)
      );

      if (this.isShowCustomMappingModal) {
        this.toggleModal({ isOpenModal: true });
      }
    },
    /**
     * The function is trigger when portrait data has save on Vuex
     * Fetch mapping config because it has changed to `Portrait mapping` and
     * Render object on canvas and update mapping icon
     */
    async renderPortraits(objects) {
      await this.fetchSheetMappingConfig();
      await this.drawObjectsOnCanvas(objects);
    }
  }
};
