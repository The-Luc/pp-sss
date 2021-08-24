import { fabric } from 'fabric';

import SizeWrapper from '@/components/SizeWrapper';
import AddBoxInstruction from '@/components/AddBoxInstruction';
import Frames from './Frames';
import { imageBorderModifier, useDigitalOverrides } from '@/plugins/fabric';
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
  MAX_SUPPLEMENTAL_FRAMES,
  MIN_IMAGE_SIZE,
  PASTE,
  THUMBNAIL_IMAGE_CONFIG,
  VIDEO_SPEED_UP_TIME,
  CANVAS_EVENT_TYPE,
  EVENT_TYPE,
  WINDOW_EVENT_TYPE,
  CROP_CONTROL,
  IMAGE_LOCAL
} from '@/common/constants';
import {
  addPrintClipArts,
  addPrintShapes,
  applyShadowToObject,
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
  updateSpecificProp,
  handleGetSvgData,
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
  handleMouseOut
} from '@/common/fabricObjects';
import { createImage } from '@/common/fabricObjects';
import { mapGetters, mapActions, mapMutations } from 'vuex';

import {
  useDrawLayout,
  useInfoBar,
  useLayoutPrompt,
  useFrame,
  useFrameSwitching,
  useModal,
  useMutationDigitalSheet,
  useElementProperties,
  useStyle,
  useToolBar
} from '@/hooks';

import {
  deleteSelectedObjects,
  isEmpty,
  pxToIn,
  resetObjects,
  selectLatestObject,
  setActiveCanvas,
  setBorderHighlight,
  setBorderObject,
  setCanvasUniformScaling,
  isNonElementPropSelected,
  copyPpObject,
  inToPx,
  pastePpObject,
  isDeleteKey,
  isVideoPlaying,
  isValidTargetToCopyPast,
  getUniqueId,
  isContainDebounceProp
} from '@/common/utils';
import { GETTERS as APP_GETTERS, MUTATES } from '@/store/modules/app/const';

import {
  ACTIONS as DIGITAL_ACTIONS,
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';

import { cloneDeep, debounce, merge } from 'lodash';
import { useSaveData, useObject } from '../composables';
import { useSavingStatus } from '@/views/CreateBook/composables';
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

const ELEMENTS = {
  [OBJECT_TYPE.TEXT]: 'a text box',
  [OBJECT_TYPE.IMAGE]: 'an image box'
};

export default {
  components: {
    SizeWrapper,
    AddBoxInstruction,
    Frames
  },
  setup() {
    const { drawLayout } = useDrawLayout();
    const { setInfoBar, zoom } = useInfoBar();
    const { openPrompt } = useLayoutPrompt();
    const { handleSwitchFrame } = useFrameSwitching();
    const {
      frames,
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
    const { updateMediaSidebarOpen } = useToolBar();

    return {
      frames,
      currentFrame,
      currentFrameId,
      drawLayout,
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
      updateMediaSidebarOpen
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
      showAddFrame: true,
      countPaste: 1,
      isProcessingPaste: false,
      isCanvasChanged: false,
      autoSaveTimer: null,
      undoRedoCanvas: null
    };
  },
  computed: {
    ...mapGetters({
      pageSelected: DIGITAL_GETTERS.CURRENT_SHEET,
      sheetLayout: DIGITAL_GETTERS.SHEET_LAYOUT,
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES,
      selectedObject: DIGITAL_GETTERS.CURRENT_OBJECT,
      toolNameSelected: APP_GETTERS.SELECTED_TOOL_NAME,
      currentBackgrounds: DIGITAL_GETTERS.BACKGROUNDS,
      propertiesObjectType: APP_GETTERS.PROPERTIES_OBJECT_TYPE,
      object: DIGITAL_GETTERS.OBJECT_BY_ID,
      currentObjects: DIGITAL_GETTERS.GET_OBJECTS,
      totalBackground: DIGITAL_GETTERS.TOTAL_BACKGROUND,
      listObjects: DIGITAL_GETTERS.GET_OBJECTS,
      triggerApplyLayout: DIGITAL_GETTERS.TRIGGER_APPLY_LAYOUT
    })
  },
  watch: {
    pageSelected: {
      deep: true,
      async handler(val, oldVal) {
        if (val?.id === oldVal?.id) return;

        this.saveData(oldVal.id, this.currentFrameId);

        // reset frames, frameIDs, currentFrameId
        this.setFrames({ framesList: [] });
        this.setSelectedObjectId({ id: '' });
        this.setIsOpenProperties({ isOpen: false });
        this.setCurrentObject(null);
        this.updateCanvasSize();

        resetObjects(this.digitalCanvas);

        await this.getDataCanvas();

        this.setCurrentFrameId({ id: this.frames[0].id });

        this.countPaste = 1;

        await this.drawObjectsOnCanvas(this.sheetLayout);
      }
    },
    async currentFrameId(val, oldVal) {
      if (!val) {
        resetObjects(this.digitalCanvas);

        return;
      }

      const isSwitchFrame = this.frames.find(
        f => String(f.id) === String(oldVal)
      );

      if (isSwitchFrame) {
        this.saveData(this.pageSelected.id, oldVal);
      }

      this.setSelectedObjectId({ id: '' });
      this.setCurrentObject(null);

      resetObjects(this.digitalCanvas);

      this.updateObjectsToStore({ objects: this.currentFrame.objects });
      this.handleSwitchFrame(this.currentFrame);

      this.undoRedoCanvas.reset();

      this.updateMediaSidebarOpen({ isOpen: false });

      await this.drawObjectsOnCanvas(this.sheetLayout);
    },
    async triggerApplyLayout() {
      // to render new layout when user replace frame
      this.setSelectedObjectId({ id: '' });
      this.setCurrentObject(null);

      resetObjects(this.digitalCanvas);

      await this.drawObjectsOnCanvas(this.sheetLayout);
    },

    frames: {
      deep: true,
      handler(val, oldVal) {
        if (val.length === oldVal.length) return;

        const supplementalFrames = val.filter(item => !item.frame?.fromLayout);

        this.handleShowAddFrame(supplementalFrames);
      }
    },
    firstFrameThumbnail(val) {
      this.updateSheetThumbnail({
        sheetId: this.pageSelected.id,
        thumbnailUrl: val
      });
    },
    zoom(newVal, oldVal) {
      if (newVal !== oldVal) this.updateCanvasSize();
    }
  },
  beforeDestroy() {
    this.digitalCanvas = null;

    clearInterval(this.autoSaveTimer);

    this.updateDigitalEventListeners(false);
    this.updateWindowEventListeners(false);

    this.setInfoBar({ x: 0, y: 0, zoom: 0 });

    this.undoRedoCanvas.dispose();

    this.updateMediaSidebarOpen({ isOpen: false });
  },
  methods: {
    ...mapActions({
      getDataCanvas: DIGITAL_ACTIONS.GET_DATA_CANVAS
    }),
    ...mapMutations({
      setBookId: DIGITAL_MUTATES.SET_BOOK_ID,
      setIsOpenProperties: MUTATES.TOGGLE_MENU_PROPERTIES,
      setToolNameSelected: MUTATES.SET_TOOL_NAME_SELECTED,
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
      const canvasSize = {
        width: 0,
        height: 0
      };

      if (this.zoom > 0) {
        canvasSize.height = DIGITAL_CANVAS_SIZE.HEIGHT * this.zoom;
        canvasSize.width = DIGITAL_CANVAS_SIZE.WIDTH * this.zoom;
      } else if (this.containerSize.ratio > DIGITAL_CANVAS_SIZE.RATIO) {
        canvasSize.height = this.containerSize.height;
        canvasSize.width = canvasSize.height * DIGITAL_CANVAS_SIZE.RATIO;
      } else {
        canvasSize.width = this.containerSize.width;
        canvasSize.height = canvasSize.width / DIGITAL_CANVAS_SIZE.RATIO;
      }

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
      setActiveCanvas(window.digitalCanvas);
      useDigitalOverrides(fabric.Object.prototype);
      this.updateCanvasSize();
      this.digitalCanvas = window.digitalCanvas;
      this.updateCanvasEventListeners();
      this.updateDigitalEventListeners();
      this.updateWindowEventListeners();

      this.autoSaveTimer = setInterval(this.handleAutosave, AUTOSAVE_INTERVAL);

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
          handler: prop => {
            this.changeTextProperties(prop);
          }
        }
      ];

      const backgroundEvents = [
        {
          name: EVENT_TYPE.DIGITAL_BACKGROUND_ADD,
          handler: this.addBackground
        },
        {
          name: EVENT_TYPE.DIGITAL_BACKGROUND_PROP_CHANGE,
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
        }
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
        [CANVAS_EVENT_TYPE.OBJECT_SCALED]: this.onObjectScaled,
        [CANVAS_EVENT_TYPE.OBJECT_MOVED]: this.onObjectMoved,
        [CANVAS_EVENT_TYPE.MOUSE_DOWN]: this.onMouseDown,
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
        this.setIsOpenProperties({ isOpen: false });

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
      console.log('selection:created');
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

      this.setPropertiesObjectType({ type: objectData.type });

      this.openProperties(objectData.type, id);
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
    onObjectAdded() {
      this.handleCanvasChanged();
    },

    /**
     * Event fire when fabric object has been modified
     */
    onObjectModified() {
      console.log('object:modified');
    },

    /**
     * Event fire when fabric object has been removed
     */
    onObjectRemoved() {
      this.setCurrentObject(null);
      this.handleCanvasChanged();
    },

    /**
     * Event fire when fabric object has been scaled
     * @param target fabric object selected
     */
    onObjectScaled({ target }) {
      const { width, height } = target;
      const prop = {
        size: {
          width: pxToIn(width),
          height: pxToIn(height)
        }
      };
      this.setObjectProp({ prop });

      this.setCurrentObject(this.listObjects?.[target?.id]);
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
    },

    /**
     * Event fire when click on fabric canvas
     */
    onMouseDown(event) {
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
      const { object, data } = createTextBox(x, y, width, height, {});

      const [rect, text] = object._objects;

      const events = {
        rotated: this.handleRotated,
        moved: this.handleMoved,
        scaling: e => handleScalingText(e, text),
        scaled: e => this.handleTextBoxScaled(e, rect, text, data),
        mousedblclick: ({ target }) => this.handleDbClickText(target)
      };

      object.on(events);

      this.addNewObject(data);

      const isConstrain = data.newObject.isConstrain;

      setCanvasUniformScaling(this.digitalCanvas, isConstrain);

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
     * Open text properties modal and set default properties
     *
     * @param {String}  objectType  type of selected object
     */
    openProperties(objectType, id) {
      this.setIsOpenProperties({ isOpen: true, objectId: id });
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
      enableTextEditMode(group, prop => {
        this.changeTextProperties(prop);
      });
    },

    /**
     * Event fire when user change any property of selected text on the Text Properties
     *
     * @param {Object}  style  new style
     */
    changeTextProperties(prop) {
      this.changeElementProperties(prop, OBJECT_TYPE.TEXT);
    },

    /**
     * Fired when objects on canvas are modified, added, or removed
     */
    handleCanvasChanged() {
      return new Promise(resolve => {
        // update thumbnail
        this.getThumbnailUrl();

        // set state change for autosave
        this.isCanvasChanged = true;

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
        moved: this.handleMoved
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

      if (isEmpty(element) || element.objectType !== objectType) return;

      const newProp = await this.updateElementProp(element, prop, objectType);

      this.updateCurrentObject(element, newProp);

      if (isContainDebounceProp(newProp)) {
        this.debounceSetObjectProp(newProp);
      } else {
        this.setObjectProperties(newProp);
      }
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
        return;
      }
    },

    /**
     * Event fire when user click on Image button on Toolbar to add new image on canvas
     */
    async addImageBox(x, y, width, height, options) {
      const id = getUniqueId();

      const size = new BaseSize({
        width: pxToIn(width),
        height: pxToIn(height)
      });

      const coord = new BasePosition({
        x: pxToIn(x),
        y: pxToIn(y)
      });

      const isVideo = options?.type === ASSET_TYPE.VIDEO;

      const mediaProp = {
        id,
        size,
        coord,
        imageUrl: DEFAULT_IMAGE.IMAGE_URL,
        hasImage: !!options?.src,
        originalUrl: options?.src
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

      this.digitalCanvas.add(image?.object);

      selectLatestObject(this.digitalCanvas);
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
     * Event fire when user change any property of selected video
     *
     * @param {Object}  prop  new prop
     */
    changeVideoProperties(prop) {
      if (!isEmpty(prop.volume)) this.changeVideoVolume(prop.volume);

      this.changeElementProperties(prop, OBJECT_TYPE.VIDEO);
    },
    /**
     * Event fire when user click on Clip art button on Toolbar to add new clip art on canvas
     * @param {Array} clipArts - list clip art add on Canvas
     */
    async addClipArt(clipArts) {
      const toBeAddedClipArts = clipArts.map(c => {
        const id = getUniqueId();

        const vector = c.vector;

        const newClipArt = new ClipArtElementObject({
          ...c,
          id,
          vector: require(`../../../../../assets/image/clip-art/${vector}`)
        });

        return {
          id,
          object: newClipArt
        };
      });

      const eventListeners = {
        scaling: this.handleScaling,
        scaled: this.handleScaled,
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
    },
    /**
     * Adding background to canvas & store
     *
     * @param {Object}  background  the object of adding background
     * @param {Boolean} isLeft      is add to the left page or right page
     */
    addBackground({ background }) {
      const id = getUniqueId();

      const newBackground = new BackgroundElementObject({
        ...background,
        id,
        backgroundId: background.id,
        isLeftPage: true
      });

      addDigitalBackground({
        id,
        backgroundProp: newBackground,
        canvas: window.digitalCanvas
      });

      this.addNewBackground({ background: newBackground });
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

      this.setIsOpenProperties({ isOpen: false });

      this.setPropertiesObjectType({ type: '' });
    },
    /**
     * Reset configs properties when close object
     */
    resetConfigTextProperties() {
      if (this.propertiesObjectType !== OBJECT_TYPE.BACKGROUND) {
        this.setIsOpenProperties({ isOpen: false });

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
     * Handle show/hide add frame button
     * @param {Array} frames supplemental frames
     */
    handleShowAddFrame(frames) {
      this.showAddFrame = frames.length < MAX_SUPPLEMENTAL_FRAMES;
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
      const {
        coord,
        size: { height, width }
      } = textProperties;

      const { object, data: objectData } = createTextBox(
        inToPx(coord.x),
        inToPx(coord.y),
        inToPx(width),
        inToPx(height),
        textProperties
      );

      const {
        newObject: {
          shadow,
          coord: { rotation }
        }
      } = objectData;

      updateSpecificProp(object, {
        coord: {
          rotation
        }
      });

      this.handleAddTextEventListeners(object, objectData);

      const objects = object.getObjects();

      objects.forEach(obj => {
        applyShadowToObject(obj, shadow);
      });

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
        moved: this.handleMoved
      };

      const svgObject = {
        id: objectData.id,
        object: objectData
      };

      const svg = await handleGetSvgData({
        svg: svgObject,
        svgUrlAttrName:
          objectData.type === OBJECT_TYPE.CLIP_ART ? 'vector' : 'pathData',
        expectedHeight: objectData.size.height,
        expectedWidth: objectData.size.width
      });

      addEventListeners(svg, eventListeners);

      const {
        dropShadow,
        shadowBlur,
        shadowOffset,
        shadowOpacity,
        shadowAngle,
        shadowColor
      } = svg;

      updateSpecificProp(svg, {
        coord: {
          rotation: objectData.coord.rotation
        }
      });

      applyShadowToObject(svg, {
        dropShadow,
        shadowBlur,
        shadowOffset,
        shadowOpacity,
        shadowAngle,
        shadowColor
      });
      return svg;
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
        mousedblclick: ({ target }) => this.handleDbClickText(target)
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

      if (
        newData.type === OBJECT_TYPE.IMAGE ||
        newData.type === OBJECT_TYPE.VIDEO
      ) {
        return this.createMediaFromPpData(newData);
      }

      if (
        newData.type === OBJECT_TYPE.CLIP_ART ||
        newData.type === OBJECT_TYPE.SHAPE
      ) {
        return this.createSvgFromPpData(newData);
      }

      if (newData.type === OBJECT_TYPE.TEXT) {
        return this.createTextFromPpData(newData);
      }
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

      const mediaObject = await createImage(mediaProperties);
      const media = mediaObject?.object;
      const {
        border,
        hasImage,
        control,
        type,
        imageUrl,
        thumbnailUrl,
        customThumbnailUrl
      } = mediaProperties;

      if (type === OBJECT_TYPE.VIDEO) {
        const url = customThumbnailUrl || thumbnailUrl;

        await setVideoSrc(media, imageUrl, url, this.videoToggleStatus);
      }

      imageBorderModifier(media);
      addEventListeners(media, eventListeners);

      const {
        dropShadow,
        shadowBlur,
        shadowOffset,
        shadowOpacity,
        shadowAngle,
        shadowColor
      } = media;

      applyShadowToObject(media, {
        dropShadow,
        shadowBlur,
        shadowOffset,
        shadowOpacity,
        shadowAngle,
        shadowColor
      });

      applyBorderToImageObject(media, border);

      updateSpecificProp(media, {
        coord: {
          rotation: mediaProperties.coord.rotation
        }
      });

      if (type === OBJECT_TYPE.IMAGE && hasImage && !control) {
        const control = await createMediaOverlay(IMAGE_LOCAL.CONTROL_ICON, {
          width: CROP_CONTROL.WIDTH,
          height: CROP_CONTROL.HEIGHT
        });

        media.set({ control });
      }

      return media;
    },
    /**
     * Delete objects on canvas
     */
    deleteObject() {
      const ids = this.digitalCanvas.getActiveObjects().map(o => o.id);

      this.deleteObjects({ ids });

      deleteSelectedObjects(this.digitalCanvas);
    },

    /**
     * create and render objects on the canvas
     * @param {Object} objects ppObjects that will be rendered
     */
    async drawObjectsOnCanvas(objects) {
      if (isEmpty(objects)) return;

      const allObjectPromises = objects.map(objectData => {
        if (
          objectData.type === OBJECT_TYPE.SHAPE ||
          objectData.type === OBJECT_TYPE.CLIP_ART
        ) {
          return this.createSvgFromPpData(objectData);
        }

        if (objectData.type === OBJECT_TYPE.TEXT) {
          return this.createTextFromPpData(objectData);
        }

        if (
          objectData.type === OBJECT_TYPE.IMAGE ||
          objectData.type === OBJECT_TYPE.VIDEO
        ) {
          return this.createMediaFromPpData(objectData);
        }

        if (objectData.type === OBJECT_TYPE.BACKGROUND) {
          return this.createBackgroundFromPpData(objectData);
        }
      });

      const listFabricObjects = await Promise.all(allObjectPromises);

      this.digitalCanvas.add(...listFabricObjects);
      this.digitalCanvas.requestRenderAll();
    },
    /**
     * create fabric object
     *
     * @param {Object} objectData PpData of the of a background object {id, size, coord,...}
     * @returns {Object} a fabric objec
     */
    async createBackgroundFromPpData(backgroundProp) {
      const image = await createBackgroundFabricObject(
        backgroundProp,
        this.digitalCanvas
      );
      return image;
    },

    /**
     *  fire every 60s by default to save working progress
     */
    async handleAutosave() {
      if (!this.isCanvasChanged) return;

      this.updateSavingStatus({ status: SAVE_STATUS.START });

      await this.saveData(this.pageSelected.id, this.currentFrameId);

      this.updateSavingStatus({ status: SAVE_STATUS.END });

      this.isCanvasChanged = false;
    },

    /**
     * Save sheet and sheet's frame data to storage
     * @param {String | Number} sheetId id of sheet
     * @param {String | Number} frameId id of frame
     */
    async saveData(sheetId, frameId) {
      this.updateFrameObjects({ frameId });
      const data = this.getDataEditScreen(sheetId);
      await this.saveEditScreen(data);
    },
    /**
     * Change fabric properties of current element
     *
     * @param   {Object}  element     selected element
     * @param   {Object}  prop        new prop
     * @param   {String}  objectType  object type of selected element
     *
     * @returns {Object}              property of element after changed
     */
    async updateElementProp(element, prop, objectType) {
      if (objectType === OBJECT_TYPE.TEXT) {
        return this.updateTextElementProp(element, prop);
      }

      if (objectType === OBJECT_TYPE.IMAGE) {
        return this.updateImageElementProp(element, prop);
      }

      if (objectType === OBJECT_TYPE.VIDEO) {
        return await this.updateVideoElementProp(element, prop);
      }

      updateElement(element, prop, window.digitalCanvas);

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

      return prop;
    },

    /**
     * Change fabric properties of current video element
     *
     * @param   {Object}  element selected element
     * @param   {Object}  prop    new prop
     *
     * @returns {Object}          property of element after changed
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

      this.setObjectPropById({ id: activeObject.id, prop });

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

      this.setObjectPropById({ id: activeObject.id, prop });
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
      if (prop.type !== OBJECT_TYPE.VIDEO) return prop;

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
      if (target.objectType === OBJECT_TYPE.IMAGE) {
        if (!target.isHoverControl) return;

        this.$emit('openCropControl');
      }

      if (target.objectType === OBJECT_TYPE.VIDEO) {
        if (!target.isHoverPlayIcon) return;

        this.videoTogglePlay();
      }
    }
  }
};
