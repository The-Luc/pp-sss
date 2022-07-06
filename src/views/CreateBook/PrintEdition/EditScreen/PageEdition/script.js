import { mapGetters, mapMutations, mapActions } from 'vuex';
import { fabric } from 'fabric';
import { cloneDeep, merge, debounce } from 'lodash';

import {
  imageBorderModifier,
  useDoubleStroke,
  useOverrides
} from '@/plugins/fabric';

import {
  useInfoBar,
  useMutationPrintSheet,
  useProperties,
  useAppCommon,
  useStyle,
  useToolBar,
  useCustomLayout,
  useFrameAction,
  useMappingSheet,
  useModal,
  useMappingProject,
  useContentChanges
} from '@/hooks';
import { startDrawBox } from '@/common/fabricObjects/drawingBox';

import {
  isEmpty,
  getCoverPagePrintSize,
  getPagePrintSize,
  selectLatestObject,
  deleteSelectedObjects,
  isHalfSheet,
  isHalfLeft,
  pxToIn,
  resetObjects,
  inToPx,
  setBorderObject,
  setCanvasUniformScaling,
  setBorderHighlight,
  setActiveEdition,
  isNonElementPropSelected,
  copyPpObject,
  pastePpObject,
  isDeleteKey,
  isValidTargetToCopyPast,
  getUniqueId,
  isContainDebounceProp,
  isFbImageObject,
  isPpImageObject,
  getDigitalObjectById,
  isAllowSyncLayoutData,
  isSecondaryFormat,
  updateCanvasMapping,
  isLayoutMappingChecker,
  getBrokenCustomMapping,
  isCustomMappingChecker,
  isAllowSyncCustomData
} from '@/common/utils';

import {
  createTextBox,
  applyTextBoxProperties,
  addPrintBackground,
  addPrintShapes,
  addPrintClipArts,
  updateElement,
  deleteObjectById,
  applyShadowToObject,
  mappingElementProperties,
  calcScaleElement,
  handleGetSvgData,
  addEventListeners,
  setTextDimensionAfterScaled,
  handleObjectBlur,
  handleScalingText,
  enableTextEditMode,
  createBackgroundFabricObject,
  updateSpecificProp,
  addPrintPageNumber,
  updateBringToFrontPageNumber,
  applyBorderToImageObject,
  setImageSrc,
  centercrop,
  handleDragEnter,
  handleDragLeave,
  fabricToPpObject,
  getTextSizeWithPadding,
  createMediaOverlay,
  handleMouseMove,
  handleMouseOver,
  handleMouseOut,
  createPortraitImage,
  createImage,
  handleGetClipart
} from '@/common/fabricObjects';

import { GETTERS as APP_GETTERS, MUTATES } from '@/store/modules/app/const';
import {
  ACTIONS as PRINT_ACTIONS,
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';

import {
  TOOL_NAME,
  SHEET_TYPE,
  OBJECT_TYPE,
  ARRANGE_SEND,
  DEFAULT_SHAPE,
  COVER_TYPE,
  DEFAULT_CLIP_ART,
  DEFAULT_IMAGE,
  SAVE_STATUS,
  IMAGE_LOCAL,
  PROPERTIES_TOOLS,
  EDITION,
  PORTRAIT_IMAGE_MASK,
  CUSTOM_CHANGE_MODAL,
  CONTENT_CHANGE_MODAL,
  CUSTOM_MAPPING_MODAL
} from '@/common/constants';
import SizeWrapper from '@/components/SizeWrapper';
import PrintCanvasLines from './PrintCanvasLines';
import PageWrapper from './PageWrapper';
import XRuler from './Rulers/XRuler';
import YRuler from './Rulers/YRuler';
import MappingLayoutCustomChange from '@/containers/Modals/MappingLayoutCustomChange';
import ConfirmAction from '@/containers/Modals/ConfirmAction';
import {
  AUTOSAVE_INTERVAL,
  COPY_OBJECT_KEY,
  CROP_CONTROL,
  DEBOUNCE_MUTATION,
  MIN_IMAGE_SIZE,
  PASTE,
  THUMBNAIL_IMAGE_CONFIG
} from '@/common/constants/config';
import { EVENT_TYPE } from '@/common/constants/eventType';
import { useSaveData } from './composables';
import { useSavingStatus } from '@/views/CreateBook/composables';
import UndoRedoCanvas from '@/plugins/undoRedoCanvas';
import {
  BackgroundElementObject,
  BasePosition,
  BaseSize,
  ClipArtElementObject,
  ImageElementObject,
  ShapeElementObject
} from '@/common/models/element';
import { useBookPrintInfo } from '../composables';
import { usePdfGeneration } from '../../MainScreen/composables';
import UniqueColor from '@/plugins/UniqueColor';
import { getItem, setItem } from '@/common/storage';

export default {
  components: {
    PageWrapper,
    SizeWrapper,
    PrintCanvasLines,
    XRuler,
    YRuler,
    MappingLayoutCustomChange,
    ConfirmAction
  },
  setup() {
    const { printBookInfo: generalInfo } = useBookPrintInfo();
    const { setLoadingState } = useAppCommon();
    const { setInfoBar, zoom } = useInfoBar();
    const { onSaveStyle } = useStyle();
    const { savePrintEditScreen, getDataEditScreen } = useSaveData();
    const {
      setPropertyById: setObjectPropById,
      setProperty: setObjectProp
    } = useProperties();
    const { updateSavingStatus, savingStatus } = useSavingStatus();
    const { updateSheetThumbnail } = useMutationPrintSheet();
    const { updateMediaSidebarOpen, setPropertiesType } = useToolBar();
    const { saveCustomPrintLayout } = useCustomLayout();
    const { generatePdf } = usePdfGeneration();
    const { getSheetFrames } = useFrameAction();
    const {
      storeElementMappings,
      getSheetMappingConfig,
      updateElementMappingByIds,
      createSingleElementMapping
    } = useMappingSheet();
    const { toggleModal } = useModal();
    const { getMappingConfig } = useMappingProject();
    const {
      handleTextContentChange,
      handleImageContentChange
    } = useContentChanges();

    return {
      generalInfo,
      setInfoBar,
      zoom,
      onSaveStyle,
      savePrintEditScreen,
      getDataEditScreen,
      setObjectPropById,
      setObjectProp,
      updateSavingStatus,
      savingStatus,
      updateSheetThumbnail,
      updateMediaSidebarOpen,
      setPropertiesType,
      setLoadingState,
      saveCustomPrintLayout,
      generatePdf,
      getSheetFrames,
      storeElementMappings,
      toggleModal,
      getSheetMappingConfig,
      updateElementMappingByIds,
      createSingleElementMapping,
      getMappingConfig,
      handleTextContentChange,
      handleImageContentChange
    };
  },
  data() {
    return {
      containerSize: null,
      canvasSize: null,
      printSize: null,
      awaitingAdd: '',
      origX: 0,
      origY: 0,
      currentRect: null,
      rectObj: null,
      objectList: [],
      isProcessingPaste: false,
      countPaste: 1,
      rulerSize: { width: '0', height: '0' },
      isCanvasChanged: false,
      autoSaveTimer: null,
      undoRedoCanvas: null,
      printCanvas: null,
      isScroll: { x: false, y: false },
      digitalObjects: {},
      elementMappings: [],
      isShowMappingContentChange: false, // for editing content of text/image
      isShowCustomChangesConfirm: false, // for editing in mapped layout applied sheet
      isShowCustomMappingModal: false, // for editing object or adding new object on custom mapping mode, and print is secondary format
      sheetMappingConfig: {},
      projectMappingConfig: {}
    };
  },
  computed: {
    ...mapGetters({
      pageSelected: PRINT_GETTERS.CURRENT_SHEET,
      sheetLayout: PRINT_GETTERS.SHEET_LAYOUT,
      toolNameSelected: APP_GETTERS.SELECTED_TOOL_NAME,
      currentBackgrounds: PRINT_GETTERS.BACKGROUNDS,
      propertiesObjectType: APP_GETTERS.PROPERTIES_OBJECT_TYPE,
      object: PRINT_GETTERS.OBJECT_BY_ID,
      currentObjects: PRINT_GETTERS.GET_OBJECTS,
      totalBackground: PRINT_GETTERS.TOTAL_BACKGROUND,
      totalObject: PRINT_GETTERS.TOTAL_OBJECT,
      getPageInfo: PRINT_GETTERS.GET_PAGE_INFO,
      getObjectsAndBackground: PRINT_GETTERS.GET_OBJECTS_AND_BACKGROUNDS
    }),
    isCover() {
      return this.pageSelected?.type === SHEET_TYPE.COVER;
    },
    isHardCover() {
      const { coverOption } = this.generalInfo;
      return (
        coverOption === COVER_TYPE.HARDCOVER &&
        this.pageSelected?.type === SHEET_TYPE.COVER
      );
    },
    isSoftCover() {
      const { coverOption } = this.generalInfo;
      return (
        coverOption === COVER_TYPE.SOFTCOVER &&
        this.pageSelected?.type === SHEET_TYPE.COVER
      );
    },
    currentSheetType() {
      return this.pageSelected?.type || -1;
    }
  },
  watch: {
    pageSelected: {
      deep: true,
      async handler(val, oldVal) {
        if (val?.id === oldVal?.id) return;

        await this.saveData(oldVal.id);

        this.updateCanvasSize();
        // get data either from API
        await this.getDataCanvas();

        this.sheetMappingConfig = await this.getSheetMappingConfig(val.id);

        this.undoRedoCanvas.reset();

        this.updateMediaSidebarOpen({ isOpen: false });

        this.countPaste = 1;

        this.setSelectedObjectId({ id: '' });
        this.setPropertiesObjectType({ type: '' });
        this.setCurrentObject(null);

        await this.updateElementMappings();
        await this.drawObjectsOnCanvas(this.sheetLayout);

        this.resetCanvasChanges();
      }
    },
    zoom(newVal, oldVal) {
      if (newVal !== oldVal) this.updateCanvasSize();
    },
    totalObject(newVal, oldVal) {
      if (newVal !== oldVal) updateBringToFrontPageNumber(window.printCanvas);
    }
  },
  async mounted() {
    this.setAutosaveTimer();

    window.addEventListener('copy', this.handleCopy);
    window.addEventListener('paste', this.handlePaste);

    document.body.addEventListener('keyup', this.handleDeleteKey);

    const bookId = this.$route.params.bookId;
    this.projectMappingConfig = await this.getMappingConfig(bookId);
  },
  beforeDestroy() {
    window.removeEventListener('copy', this.handleCopy);
    window.removeEventListener('paste', this.handlePaste);

    window.printCanvas = null;

    clearInterval(this.autoSaveTimer);

    sessionStorage.removeItem(COPY_OBJECT_KEY);

    document.body.removeEventListener('keyup', this.handleDeleteKey);

    this.eventHandling(false);

    this.setInfoBar({ x: 0, y: 0, zoom: 0 });

    this.undoRedoCanvas.dispose();

    this.updateMediaSidebarOpen({ isOpen: false });
  },
  methods: {
    ...mapActions({
      getDataCanvas: PRINT_ACTIONS.GET_DATA_CANVAS
    }),
    ...mapMutations({
      setIsOpenProperties: MUTATES.TOGGLE_MENU_PROPERTIES,
      setToolNameSelected: MUTATES.SET_TOOL_NAME_SELECTED,
      setObjectTypeSelected: MUTATES.SET_OBJECT_TYPE_SELECTED,
      setSelectedObjectId: PRINT_MUTATES.SET_CURRENT_OBJECT_ID,
      setCurrentObject: MUTATES.SET_CURRENT_OBJECT,
      addNewObject: PRINT_MUTATES.ADD_OBJECT,
      addNewBackground: PRINT_MUTATES.SET_BACKGROUND,
      updateTriggerBackgroundChange:
        PRINT_MUTATES.UPDATE_TRIGGER_BACKGROUND_CHANGE,
      deleteObjects: PRINT_MUTATES.DELETE_OBJECTS,
      reorderObjectIds: PRINT_MUTATES.REORDER_OBJECT_IDS,
      toggleActiveObjects: MUTATES.TOGGLE_ACTIVE_OBJECTS,
      setPropertiesObjectType: MUTATES.SET_PROPERTIES_OBJECT_TYPE,
      setBackgroundProp: PRINT_MUTATES.SET_BACKGROUND_PROP,
      deleteBackground: PRINT_MUTATES.DELETE_BACKGROUND
    }),

    async handleAutosave() {
      if (!this.isCanvasChanged) return;

      this.updateSavingStatus({ status: SAVE_STATUS.START });

      await this.saveData(this.pageSelected.id, true);

      this.updateSavingStatus({ status: SAVE_STATUS.END });
    },

    /**
     * To save data of current sheet
     *
     * ONLY generate thumbnails and save objects when isCanvasChanged is true
     *
     * @param {String | Number} sheetId id of sheet need to save data
     * @param {Boolean} isAutosave indicating autosaving or not
     * @returns {Promise} saved data
     *
     */
    async saveData(sheetId, isAutosave) {
      this.setAutosaveTimer();

      const data = this.getDataEditScreen(sheetId);

      // update elementMappings if any objects deleted and isCanvasChanged = TRUE
      if (!isEmpty(this.elementMappings) && this.isCanvasChanged) {
        const objectIds = data.objects.map(o => o.id);
        const elementMappingIds = [];

        this.elementMappings.forEach(el => {
          if (!objectIds.includes(el.printElementId)) {
            elementMappingIds.push(el.id);
          }
        });

        if (!isEmpty(elementMappingIds)) {
          // update elementMapping
          await this.updateElementMappingByIds(elementMappingIds);

          this.elementMappings.forEach(el => {
            if (elementMappingIds.includes(el.printElementId))
              el.printElementId = '';
          });
        }
      }

      await this.savePrintEditScreen(
        data,
        isAutosave,
        this.elementMappings,
        this.isCanvasChanged
      );

      this.resetCanvasChanges();

      return data;
    },

    /**
     * create fabric object
     *
     * @param {Object} objectData PpData of the of a background object {id, size, coord,...}
     * @returns {Object} a fabric objec
     */
    async createBackgroundFromPpData(backgroundProp) {
      return createBackgroundFabricObject(backgroundProp, window.printCanvas);
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
        mouseover: handleMouseOver,
        mouseout: handleMouseOut
      });
    },

    /**
     * add image to the store and create fabric object
     *
     * @param {Object} imageProperties PpData of the of an image object {id, size, coord,...}
     * @returns {Object} a fabric object
     */
    async createImageFromPpData(imageProperties) {
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

      const imageObject = await createImage(imageProperties);
      const image = imageObject?.object;
      const { border, cropInfo } = imageProperties;

      imageBorderModifier(image);
      addEventListeners(image, eventListeners);

      const {
        dropShadow,
        shadowBlur,
        shadowOffset,
        shadowOpacity,
        shadowAngle,
        shadowColor
      } = image;

      applyShadowToObject(image, {
        dropShadow,
        shadowBlur,
        shadowOffset,
        shadowOpacity,
        shadowAngle,
        shadowColor
      });

      applyBorderToImageObject(image, border);

      if (!isEmpty(cropInfo)) {
        image.set({ cropInfo });
      }

      if (imageProperties.hasImage && !imageProperties.control) {
        const control = await createMediaOverlay(IMAGE_LOCAL.CONTROL_ICON, {
          width: CROP_CONTROL.WIDTH,
          height: CROP_CONTROL.HEIGHT
        });

        image.set({ control });
      }

      return image;
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
      const image = await createPortraitImage(properties);

      const { border, shadow } = properties;

      useDoubleStroke(image);

      addEventListeners(image, eventListeners);

      applyShadowToObject(image, shadow);

      applyBorderToImageObject(image, border);

      return image;
    },

    /**
     * create fabric object
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
     * add shape/ clipart to the store and create fabric object
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
     * add clipart to the store and create fabric object
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

      const clipart = await handleGetClipart({
        object: objectData,
        expectedHeight: objectData.size.height,
        expectedWidth: objectData.size.width
      });

      addEventListeners(clipart, eventListeners);

      const {
        dropShadow,
        shadowBlur,
        shadowOffset,
        shadowOpacity,
        shadowAngle,
        shadowColor
      } = clipart;

      applyShadowToObject(clipart, {
        dropShadow,
        shadowBlur,
        shadowOffset,
        shadowOpacity,
        shadowAngle,
        shadowColor
      });
      return clipart;
    },

    /**
     * Add element to the store and create fabric object
     *
     * @param {Object} newData PpData of the of a element {id, size, coord,...}
     * @returns {Object} a fabric object
     */
    createElementFromPpData(newData) {
      if (newData.type !== OBJECT_TYPE.BACKGROUND) {
        this.addObjectToStore({
          id: newData.id,
          newObject: newData
        });
      }

      if (newData.type === OBJECT_TYPE.IMAGE) {
        return this.createImageFromPpData(newData);
      }

      if (newData.type === OBJECT_TYPE.PORTRAIT_IMAGE) {
        return this.createPortraitImageFromPpData(newData);
      }

      if (newData.type === OBJECT_TYPE.CLIP_ART) {
        return this.createClipartFromPpData(newData);
      }

      if (newData.type === OBJECT_TYPE.SHAPE) {
        return this.createSvgFromPpData(newData);
      }

      if (newData.type === OBJECT_TYPE.TEXT) {
        return this.createTextFromPpData(newData);
      }
    },
    /**
     * Set processing paste state when user pasted base on delay time
     */
    setProcessingPaste: debounce(function() {
      this.isProcessingPaste = false;
    }, PASTE.DELAY_TIME),
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
        window.printCanvas,
        false
      );

      this.countPaste += 1;

      this.setProcessingPaste();

      this.setLoadingState({ value: false });
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
        window.printCanvas
      );

      this.countPaste = 1;
      this.isProcessingPaste = false;
    },
    /**
     * Auto resize canvas to fit the container size
     */
    updateCanvasSize() {
      this.printSize = this.isCover
        ? getCoverPagePrintSize(
            this.isHardCover,
            this.generalInfo.numberMaxPages
          )
        : getPagePrintSize();
      const canvasSize = {
        width: 0,
        height: 0
      };
      const {
        ratio: printRatio,
        sheetWidth,
        sheetHeight
      } = this.printSize.pixels;

      if (this.zoom > 0) {
        canvasSize.height = sheetHeight * this.zoom;
        canvasSize.width = sheetWidth * this.zoom;
      } else if (this.containerSize.ratio > printRatio) {
        canvasSize.height = this.containerSize.height;
        canvasSize.width = canvasSize.height * printRatio;
      } else {
        canvasSize.width = this.containerSize.width;
        canvasSize.height = canvasSize.width / printRatio;
      }

      this.isScroll = {
        x: canvasSize.width > this.containerSize.width,
        y: canvasSize.height > this.containerSize.height
      };

      const currentZoom =
        this.zoom === 0 ? canvasSize.width / sheetWidth : this.zoom;

      this.canvasSize = { ...canvasSize, zoom: currentZoom };

      window.printCanvas.setWidth(canvasSize.width);
      window.printCanvas.setHeight(canvasSize.height);

      window.printCanvas.setZoom(currentZoom);

      // update thumbnail
      this.getThumbnailUrl();
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
      const thumbnailUrl = window.printCanvas.toDataURL({
        quality: THUMBNAIL_IMAGE_CONFIG.QUALITY,
        format: THUMBNAIL_IMAGE_CONFIG.FORMAT,
        multiplier: THUMBNAIL_IMAGE_CONFIG.MULTIPLIER
      });

      this.updateSheetThumbnail({
        sheetId: this.pageSelected?.id,
        thumbnailUrl
      });
    }, 250),
    /**
     * Event triggered once the container that hold the canvas is finished rendering
     * @param {Object} containerSize - the size object
     */
    onContainerReady(containerSize) {
      this.containerSize = containerSize;
      let el = this.$refs.canvas;
      this.printCanvas = new fabric.Canvas(el, {
        backgroundColor: '#fff',
        preserveObjectStacking: true
      });
      window.printCanvas = this.printCanvas;
      setActiveEdition(window.printCanvas, EDITION.PRINT);
      useOverrides(fabric.Object.prototype);
      this.updateCanvasSize();
      window.printCanvas.on({
        'selection:updated': this.objectSelected,
        'selection:cleared': this.handleClearSelected,
        'selection:created': this.objectSelected,
        'object:modified': this.handleBringToFrontPageNumber,
        'object:added': this.handleCanvasChanged,
        'object:removed': this.handleCanvasChanged,
        'mouse:down': e => {
          if (this.awaitingAdd) {
            this.$refs.pageWrapper.instructionEnd();
            window.printCanvas.discardActiveObject().renderAll();
            this.setToolNameSelected({ name: '' });
            startDrawBox(window.printCanvas, e).then(
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
        'text:changed': ({ target }) => {
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
        'object:moved': e => {
          if (!e.target?.objectType) {
            this.handleMultiMoved(e);
          }
        },
        drop: this.$emit.bind(this, 'drop')
      });

      document.body.addEventListener('keyup', this.handleDeleteKey);

      this.eventHandling();

      this.undoRedoCanvas = new UndoRedoCanvas({
        canvas: window.printCanvas,
        renderCanvasFn: this.drawObjectsOnCanvas
      });
    },
    /**
     * Event handle bring to front page number
     */
    handleBringToFrontPageNumber() {
      updateBringToFrontPageNumber(window.printCanvas);
    },
    /**
     * Event handle when container is resized by user action
     * @param {Object} containerSize - the size object
     */
    onContainerResized(containerSize) {
      this.containerSize = containerSize;
      this.updateCanvasSize();
    },
    /**
     * Event handler for when user press key at body scope
     * @param {KeyBoardEvent} event - the KeyBoardEvent object
     */
    handleDeleteKey(event) {
      const key = event.keyCode || event.charCode;

      if (event.target === document.body && isDeleteKey(key)) {
        this.removeObject();
      }
    },
    /**
     * Reset configs text properties when close object
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
     * Close text properties modal
     */
    closeProperties() {
      this.toggleActiveObjects(false);
      this.resetConfigTextProperties();
    },
    /**
     * Event fired when an object of canvas is selected
     * @param {Object}  target  the selected object
     */
    objectSelected({ target }) {
      if (this.awaitingAdd || isEmpty(target)) {
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

      setCanvasUniformScaling(window.printCanvas, true);

      this.resetConfigTextProperties();
    },
    /**
     * Event fired when an object of canvas is selected
     *
     * @param {Object}  target  the selected object
     */
    singleObjectSelected(target) {
      const { id } = target;

      const targetType = target.get('type');

      this.setSelectedObjectId({ id });

      setBorderHighlight(target, this.sheetLayout);

      const objectData = this.currentObjects?.[id];

      if (isEmpty(objectData)) return;

      this.setCurrentObject(objectData);

      if (targetType === 'group' && objectData.type === OBJECT_TYPE.TEXT) {
        const rectObj = target.getObjects(OBJECT_TYPE.RECT)[0];

        setBorderObject(rectObj, objectData);
      }

      setCanvasUniformScaling(window.printCanvas, objectData.isConstrain);

      this.setObjectTypeSelected({ type: objectData.type });

      this.setPropertiesObjectType({ type: PROPERTIES_TOOLS.PROPERTIES.name });

      this.setIsOpenProperties({ objectId: id });
    },
    /**
     * Event fire when user double click on Text area and allow user edit text as
     * @param {fabric.Object} group - Text Group element
     */
    handleDbClickText(group) {
      this.setPropertiesType({ type: '' });
      enableTextEditMode(group, prop => {
        this.changeTextProperties(prop, group);
      });
    },
    /**
     * Event fire when user click on Text button on Toolbar to add new text on canvas
     */
    addText(x, y, width, height) {
      this.handleShowCustomChangeModal();
      const { object, data } = createTextBox(x, y, width, height, {});

      this.handleAddTextEventListeners(object, data);

      this.addObjectToStore(data);

      const isConstrain = data.newObject.isConstrain;

      setCanvasUniformScaling(window.printCanvas, isConstrain);

      // handle show broken custom mapping icon for text
      this.addingObjectsEvent([object]);

      window.printCanvas.add(object);

      setTimeout(() => {
        selectLatestObject(window.printCanvas);
      });
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
     * Function trigger mutate to add new object to store
     */
    addObjectToStore(newObject) {
      this.addNewObject(newObject);
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

      const newImage = {
        id,
        newObject: new ImageElementObject({
          id,
          size,
          coord,
          imageUrl: DEFAULT_IMAGE.IMAGE_URL,
          hasImage: !!options?.src,
          originalUrl: options?.src,
          imageId: options?.id
        })
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

      const image = await createImage(newImage.newObject);

      if (!isEmpty(image.size)) {
        newImage.newObject.update({ size: image.size });
      }

      if (options?.src) {
        const newProp = await setImageSrc(image.object, options.src);

        newImage.newObject.update(newProp);
      }

      this.addObjectToStore(newImage);

      imageBorderModifier(image.object);

      addEventListeners(image?.object, eventListeners);

      // handle show broken custom mapping icon for text
      this.addingObjectsEvent([image.object]);

      window.printCanvas.add(image?.object);

      selectLatestObject(window.printCanvas);

      this.setLoadingState({ value: false });
    },
    /**
     * Adding background to canvas & store
     *
     * @param {Object}  background  the object of adding background
     * @param {Boolean} isLeft      is add to the left page or right page
     */
    async addBackground({ background, isLeft = true }) {
      this.handleShowCustomChangeModal('background');
      const id = getUniqueId();

      const newBackground = new BackgroundElementObject({
        ...background,
        id,
        backgroundId: background.id,
        isLeftPage: isLeft
      });

      this.setLoadingState({ value: true });

      await addPrintBackground({
        id,
        backgroundProp: newBackground,
        isLeftBackground: isLeft,
        sheetType: this.pageSelected.type,
        canvas: window.printCanvas
      });

      this.addNewBackground({ background: newBackground });

      this.setLoadingState({ value: false });
    },
    /**
     * Event fire when user change any property of selected background
     *
     * @param {Boolean} isLeftBackground  is selected background is left
     * @param {Object}  prop              new prop
     */
    changeBackgroundProperties({ backgroundId, isLeftBackground, prop }) {
      if (isEmpty(prop)) {
        this.updateTriggerBackgroundChange();

        return;
      }

      // TODO: Background properties will use data on APP STORE
      const background = window.printCanvas
        .getObjects()
        .find(o => backgroundId === o.id);

      if (isEmpty(background)) return;

      updateElement(background, prop, window.printCanvas);

      this.debounceSetBackgroundProp(isLeftBackground, prop);
    },
    /**
     * Event fire when user click remove background
     *
     * @param {String|Number} backgroundId      id of background will be removed
     * @param {Boolean}       isLeftBackground  if background place on left side
     */
    removeBackground({ backgroundId, isLeftBackground }) {
      deleteObjectById([backgroundId], window.printCanvas);

      this.deleteBackground({ isLeft: isLeftBackground });

      if (this.totalBackground > 0) return;

      this.closeProperties();

      this.setPropertiesObjectType({ type: '' });
    },
    removeObject() {
      const ids = window.printCanvas.getActiveObjects().map(o => o.id);

      this.deleteObjects({ ids });

      deleteSelectedObjects(window.printCanvas);
    },
    /**
     * Event fire when user click on Clip art button on Toolbar to add new clip art on canvas
     * @param {Array} clipArts - list clip art add on Canvas
     */
    async addClipArt(clipArts) {
      this.handleShowCustomChangeModal('clipart');
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
        rotated: this.handleRotated,
        moved: this.handleMoved,
        mouseover: handleMouseOver,
        mouseout: handleMouseOut
      };

      await addPrintClipArts(
        toBeAddedClipArts,
        window.printCanvas,
        isHalfSheet(this.pageSelected),
        isHalfLeft(this.pageSelected),
        eventListeners
      );

      toBeAddedClipArts.forEach(s => {
        const fabricObject = window.printCanvas
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

        // handle show broken custom mapping icon for shapes
        this.addingObjectsEvent([fabricObject]);

        this.addObjectToStore({
          id: s.id,
          newObject: s.object
        });
      });

      if (toBeAddedClipArts.length === 1) {
        selectLatestObject(window.printCanvas);
      } else {
        this.closeProperties();
      }

      this.setLoadingState({ value: false });
    },
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
      this.handleShowCustomChangeModal('shape');
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
        window.printCanvas,
        isHalfSheet(this.pageSelected),
        isHalfLeft(this.pageSelected),
        eventListeners
      );

      toBeAddedShapes.forEach(s => {
        const fabricObject = window.printCanvas
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

        this.addObjectToStore({
          id: s.id,
          newObject: s.object
        });
      });

      if (toBeAddedShapes.length === 1) {
        selectLatestObject(window.printCanvas);
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
     * Event fire when user change any property of selected image box
     *
     * @param {Object}  prop  new prop
     */
    changeImageProperties(prop) {
      this.changeElementProperties(prop, OBJECT_TYPE.IMAGE);
    },
    /**
     * Event fire when user change any property of selected image box
     *
     * @param {Object}  prop  new prop
     */
    changePortraitImageProperties(prop) {
      this.changeElementProperties(prop, OBJECT_TYPE.PORTRAIT_IMAGE);
    },
    /**
     * Change properties of current element
     *
     * @param {Object}  prop        new prop
     * @param {String}  objectType  object type want to check
     */
    changeElementProperties(prop, objectType) {
      if (isEmpty(prop)) return;

      const element = window.printCanvas.getActiveObject();

      if (!isEmpty(prop.fontSize)) {
        const { x, y } = element?.aCoords?.tl || {};
        prop.coord = {
          x: pxToIn(x),
          y: pxToIn(y)
        };
      }

      if (isEmpty(element) || element.objectType !== objectType) return;

      const newProp = this.updateElementProp(element, prop, objectType);

      this.modifyObjectsEvent(element);

      this.updateCurrentObject(element.id, newProp);

      if (isContainDebounceProp(newProp)) {
        this.debounceSetObjectProp(newProp);
      } else {
        this.setObjectProperties(newProp);
      }
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

      updateElement(element, prop, window.printCanvas);

      const newProp = fabricToPpObject(element);
      merge(prop, newProp);

      return prop;
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
    updateElementProp(element, prop, objectType) {
      if (objectType === OBJECT_TYPE.TEXT) {
        return this.updateTextElementProp(element, prop);
      }

      if (objectType === OBJECT_TYPE.IMAGE) {
        return this.updateImageElementProp(element, prop);
      }

      if (objectType === OBJECT_TYPE.PORTRAIT_IMAGE) {
        return this.updatePortraitImageElementProp(element, prop);
      }

      updateElement(element, prop, window.printCanvas);

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

      updateElement(element, prop, window.printCanvas);

      const newProp = fabricToPpObject(element);
      merge(prop, newProp);

      return prop;
    },
    /**
     * Update current object by mutate the store
     *
     * @param {String | Number} id  id of selected object
     * @param {Object}  newProp     new prop
     */
    updateCurrentObject(id, newProp) {
      return new Promise(resolve => {
        const prop = cloneDeep(this.currentObjects?.[id]);

        merge(prop, newProp);

        this.setCurrentObject(prop);

        resolve();
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
     * @param {Boolean} isLeft  is selected background left background
     * @param {Object}  prop    new prop
     */
    debounceSetBackgroundProp: debounce(function(isLeft, prop) {
      this.setBackgroundProp({ isLeft, prop });

      this.handleCanvasChanged();

      this.updateTriggerBackgroundChange();
    }, DEBOUNCE_MUTATION),
    /**
     * get fired when you click 'send' button
     * change the objectIds order and update z-index of object on canvas
     * @param {string} actionName indicated which 'send' button user clicked
     */
    changeObjectIdsOrder(actionName) {
      const selectedObject = window.printCanvas.getActiveObject();
      if (!selectedObject) return;

      const fabricObjects = window.printCanvas.getObjects();

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
        case OBJECT_TYPE.PORTRAIT_IMAGE:
          this.changeElementProperties(prop, objectType);
          break;
        default:
          return;
      }
    },
    /**
     * Handling event on this screen
     * @param {Boolean} isOn if need to set event
     */
    eventHandling(isOn = true) {
      const elementEvents = {
        printAddElement: element => {
          this.$refs.pageWrapper.instructionEnd();

          this.awaitingAdd = element;

          this.$refs.pageWrapper.instructionStart({ element });
        },
        printDeleteElements: this.removeObject,
        changeObjectIdsOrder: this.changeObjectIdsOrder,
        [EVENT_TYPE.SAVE_STYLE]: this.onSaveStyle
      };

      const textEvents = {
        changeTextProperties: prop => {
          this.changeTextProperties(prop);
        }
      };

      const backgroundEvents = {
        printAddBackground: this.addBackground,
        [EVENT_TYPE.BACKGROUND_PROP_CHANGE]: this.changeBackgroundProperties,
        printDeleteBackground: this.removeBackground
      };

      const shapeEvents = {
        addShapes: this.addShapes,
        changeShapeProperties: this.changeShapeProperties
      };

      const clipArtEvents = {
        addClipArts: this.addClipArt,
        changeClipArtProperties: this.changeClipArtProperties
      };

      const imageBoxEvents = {
        changeImageProperties: this.changeImageProperties,
        removeImage: this.handleRemoveImage,
        centercrop: this.handleCentercrop,
        autoflow: this.handleAutoflow
      };

      const otherEvents = {
        enscapeInstruction: () => {
          this.awaitingAdd = '';
          this.$refs.pageWrapper.instructionEnd();

          this.setToolNameSelected({ name: '' });
        },

        [EVENT_TYPE.COPY_OBJ]: this.handleCopy,
        [EVENT_TYPE.PASTE_OBJ]: this.handlePaste,
        [EVENT_TYPE.SAVE_LAYOUT]: this.handleSaveLayout,
        [EVENT_TYPE.GENERATE_PDF]: this.handleGeneratePDF,

        pageNumber: this.addPageNumber,
        drawLayout: this.drawLayout
      };

      const events = {
        ...elementEvents,
        ...textEvents,
        ...backgroundEvents,
        ...shapeEvents,
        ...clipArtEvents,
        ...imageBoxEvents,
        ...otherEvents
      };

      Object.keys(events).forEach(eventName => {
        this.$root.$off(eventName);

        if (isOn) this.$root.$on(eventName, events[eventName]);
      });
    },

    /**
     * Create and render objects on the canvas
     *
     * @param {Object} objects ppObjects that will be rendered
     */
    async drawObjectsOnCanvas(objects) {
      resetObjects(window.printCanvas);

      if (isEmpty(objects)) return;

      this.setLoadingState({ value: true });

      const allObjectPromises = objects.map(objectData => {
        if (objectData.type === OBJECT_TYPE.CLIP_ART) {
          return this.createClipartFromPpData(objectData);
        }

        if (objectData.type === OBJECT_TYPE.SHAPE) {
          return this.createSvgFromPpData(objectData);
        }

        if (objectData.type === OBJECT_TYPE.TEXT) {
          return this.createTextFromPpData(objectData);
        }

        if (objectData.type === OBJECT_TYPE.IMAGE) {
          return this.createImageFromPpData(objectData);
        }

        if (objectData.type === OBJECT_TYPE.PORTRAIT_IMAGE) {
          return this.createPortraitImageFromPpData(objectData);
        }

        if (objectData.type === OBJECT_TYPE.BACKGROUND) {
          return this.createBackgroundFromPpData(objectData);
        }
      });

      const listStatus = await Promise.allSettled(allObjectPromises);

      const listFabricObjects = [];

      listStatus.forEach(item => {
        item.value && listFabricObjects.push(item.value);
      });

      // get sheet element mappings
      this.elementMappings = await this.storeElementMappings(
        this.pageSelected.id
      );

      await this.updateMappingIcon(listFabricObjects);

      window.printCanvas.add(...listFabricObjects);
      window.printCanvas.requestRenderAll();

      this.addPageNumber();

      this.setLoadingState({ value: false });
    },

    /**
     * To update value and color of map icon on object (text & image) when hover
     */
    async updateMappingIcon(fbObjects) {
      if (isLayoutMappingChecker(this.sheetMappingConfig)) {
        // handle case layout mapping
        this.iconLayoutMapping(fbObjects);
        return;
      }

      // handle case custom mapping
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
      if (isLayoutMappingChecker(this.sheetMappingConfig)) return;

      const mapIds = this.elementMappings.map(el => el.digitalElementId);

      const isSecondary = isSecondaryFormat(this.projectMappingConfig);
      const digitalIds = Object.keys(this.digitalObjects);

      // the broken icons will show when:
      // -  if an objects are not in digital frames, print is secondary
      // -  object in `elementMappings`
      fbObjects.forEach(o => {
        if (
          mapIds.includes(o.id) ||
          (isSecondary && !digitalIds.includes(o.id))
        )
          o.mappingInfo = getBrokenCustomMapping(o);
      });
    },

    /**
     * To update value and color of map icon on object (text & image) when hover
     */
    iconLayoutMapping(fbObjects) {
      // create a object for faster and easier to access later.
      const fbObjectsById = {};
      fbObjects.forEach(o => (fbObjectsById[o.id] = o));

      let imageCouter = 1;
      let textCounter = 1;

      this.elementMappings.forEach(el => {
        const objectId = el.printElementId;

        const fbElement = fbObjectsById[objectId];

        if (!fbElement) {
          if (!el.digitalElementId) return;

          const digitalObject = this.digitalObjects[el.digitalElementId];
          const isImageObj = isPpImageObject(digitalObject);

          isImageObj ? imageCouter++ : textCounter++;
          return;
        }

        const isImage = isFbImageObject(fbElement);
        const value = isImage ? imageCouter++ : textCounter++;
        const color = UniqueColor.generateColor(value - 1, isImage);

        fbElement.mappingInfo = { color, value, id: el.id, mapped: el.mapped };
      });
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
     * Set position to prop when multi move element
     * @param {Object} e - Event moved of group
     */
    handleMultiMoved(e) {
      const { target } = e;

      target.getObjects().forEach(item => {
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
     * Fire when height of ruler is change
     *
     * @param {String}  height  height of ruler with unit (px)
     */
    onHeightChange(height) {
      this.rulerSize.height = height;
    },
    /**
     * Fire when width of ruler is change
     *
     * @param {String}  width width of ruler with unit (px)
     */
    onWidthChange(width) {
      this.rulerSize.width = width;
    },
    /**
     * Fire when clear selected in canvas
     */
    handleClearSelected() {
      this.closeProperties();
    },
    /**
     * Add Page number in canvas
     */
    addPageNumber() {
      const { pageLeftName, pageRightName } = this.pageSelected;

      addPrintPageNumber({
        spreadInfo: this.pageSelected.spreadInfo,
        pageInfoProp: this.getPageInfo,
        pageNumber: { pageLeftName, pageRightName },
        canvas: window.printCanvas
      });
    },
    async handleSaveLayout(setting) {
      const sheetData = await this.saveData(this.pageSelected.id);
      await this.saveCustomPrintLayout(setting, sheetData);
    },
    async handleGeneratePDF() {
      const bookId = this.generalInfo.id;

      if (this.isCanvasChanged) await this.saveData(this.pageSelected.id);

      this.generatePdf(bookId);
    },
    async drawLayout() {
      await this.updateElementMappings();
      await this.drawObjectsOnCanvas(this.sheetLayout);
    },

    /**
     * Handle reset image
     */
    async handleRemoveImage() {
      const activeObject = window.printCanvas.getActiveObject();
      const prop = await setImageSrc(activeObject, null);
      activeObject.canvas.renderAll();

      const imgProp = { id: activeObject.id, prop };
      this.setObjectPropById(imgProp);

      await this.mappingHandleImageContentChange(imgProp);

      this.setCurrentObject(this.currentObjects[activeObject.id]);
      this.handleCanvasChanged();
    },

    /**
     * Handle centercrop
     */
    handleCentercrop() {
      const activeObject = window.printCanvas.getActiveObject();

      const prop = centercrop(activeObject);
      activeObject.canvas.renderAll();

      this.setObjectPropById({ id: activeObject.id, prop });
      this.canvasDidChanged();
    },
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
     * Switching tool on Creation Tool
     *
     * @param {String}  toolName  name of tool
     */
    switchTool(toolName) {
      const isDiscard =
        toolName &&
        toolName !== TOOL_NAME.DELETE &&
        toolName !== TOOL_NAME.ACTIONS;

      if (isDiscard) {
        window.printCanvas.discardActiveObject().renderAll();
      }

      if (isNonElementPropSelected(this.propertiesObjectType)) {
        this.setPropertiesObjectType({ type: '' });
      }

      this.endInstruction();
    },
    /**
     * End instruction
     */
    endInstruction() {
      this.$refs.pageWrapper.instructionEnd();

      this.awaitingAdd = '';
    },

    /**
     * Handle click on fabric object
     * @param {Object} event - Event when click object
     */
    handleMouseDown(event) {
      const target = event.target;
      if (!target.isHoverControl) return;

      this.$emit('openCropControl');
    },
    /**
     * To set timer for autosaving
     */
    setAutosaveTimer() {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = setInterval(this.handleAutosave, AUTOSAVE_INTERVAL);
    },
    /**
     * Get digital object for show mapping icon
     */
    async getDigitalObjects() {
      const frames = await this.getSheetFrames(this.pageSelected.id);
      return getDigitalObjectById(frames);
    },
    /**
     * Show warning modal when having custom changes on renderd mapped layout sheet
     */
    async handleShowCustomChangeModal() {
      const isHideMess = getItem(CUSTOM_CHANGE_MODAL) || false;

      const nonConnections = this.elementMappings.length === 0;

      if (
        isHideMess ||
        !isAllowSyncLayoutData(
          this.projectMappingConfig,
          this.sheetMappingConfig
        ) ||
        nonConnections ||
        !isSecondaryFormat(this.projectMappingConfig)
      )
        return;

      this.isShowCustomChangesConfirm = true;
      this.toggleModal({
        isOpenModal: true
      });
    },
    /**
     * Handle to show custom mapping modal when editing / adding objects
     */
    async handleShowCustomMappingModal() {
      const isHideMess = getItem(CUSTOM_MAPPING_MODAL) || false;
      const isNotAllowSyncCustom = !isAllowSyncCustomData(
        this.projectMappingConfig,
        this.sheetMappingConfig
      );

      if (
        isHideMess ||
        isNotAllowSyncCustom ||
        !isSecondaryFormat(this.projectMappingConfig)
      )
        return;

      this.isShowCustomMappingModal = true;
      this.toggleModal({
        isOpenModal: true
      });
    },
    /**
     *   Custom adding object on mapped sheet
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
     * Trigger when user switch sheet / apply new layout
     * to update eleementMapping => display mapping icon
     * and get digital objects
     */
    async updateElementMappings() {
      // get sheet element mappings
      this.elementMappings = await this.storeElementMappings(
        this.pageSelected.id
      );

      // get digital object for show mapping icon (when hover)
      this.digitalObjects = isEmpty(this.elementMappings)
        ? {}
        : await this.getDigitalObjects();
    },
    /**
     * Handle break mapping connection when text content change,
     * if print is the 2ndary editor
     */
    async mappingHandleTextContentChange(prop, group) {
      if (!group) return;

      const res = await this.handleTextContentChange(
        this.elementMappings,
        prop,
        group.id
      );

      if (!res) return;

      const { isDrawObjects, elementMappings, isShowModal } = res;

      elementMappings && (this.elementMappings = elementMappings);
      this.isShowMappingContentChange = Boolean(isShowModal);

      // update canvas
      if (isDrawObjects) {
        updateCanvasMapping(group.id, window.printCanvas);
      }
    },
    /**
     * Handle break mapping connection when image content change,
     * if print is the 2ndary editor
     */
    async mappingHandleImageContentChange(prop) {
      this.canvasDidChanged();

      const props = prop.data ? prop.data : [prop];

      const imageIds = props
        .filter(el => isPpImageObject(el.prop) && el.prop.imageUrl)
        .map(el => el.id);

      const res = await this.handleImageContentChange(
        this.elementMappings,
        imageIds
      );

      if (!res) return;

      const {
        isDrawObjects,
        elementMappings,
        isShowModal,
        changeMappingIds
      } = res;

      elementMappings && (this.elementMappings = elementMappings);
      this.isShowMappingContentChange = Boolean(isShowModal);

      // update canvas
      if (isDrawObjects) {
        updateCanvasMapping(changeMappingIds, window.printCanvas);
      }
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
      const isScondary = isSecondaryFormat(this.projectMappingConfig);

      if (
        !isCustomMappingChecker(this.sheetMappingConfig) ||
        isNonMappedElement ||
        !isScondary
      )
        return;

      this.handleShowCustomMappingModal();

      // break the connection
      element.mappingInfo = getBrokenCustomMapping(element);

      this.printCanvas.requestRenderAll();

      this.createSingleElementMapping(
        this.pageSelected.id,
        this.currentFrameId,
        element.id, // print element id
        element.id, // digital element id
        false // mapped
      );
    }
  }
};
