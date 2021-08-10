import { mapGetters, mapMutations, mapActions } from 'vuex';
import { fabric } from 'fabric';
import { cloneDeep, uniqueId, merge, debounce } from 'lodash';

import { imageBorderModifier, usePrintOverrides } from '@/plugins/fabric';

import {
  useInfoBar,
  useMenuProperties,
  useMutationPrintSheet,
  useProperties
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
  setBorderHighLight,
  setActiveCanvas,
  isNonElementPropSelected,
  copyPpObject,
  pastePpObject,
  isDeleteKey
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
  handleDragLeave
} from '@/common/fabricObjects';

import { GETTERS as APP_GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS } from '@/store/modules/book/const';
import {
  ACTIONS as PRINT_ACTIONS,
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';

import {
  ImageElement,
  BackgroundElement,
  ClipArtElement,
  ShapeElement
} from '@/common/models';
import {
  TOOL_NAME,
  SHEET_TYPE,
  OBJECT_TYPE,
  ARRANGE_SEND,
  DEFAULT_SHAPE,
  COVER_TYPE,
  DEFAULT_CLIP_ART,
  DEFAULT_IMAGE,
  LAYOUT_PAGE_TYPE,
  SAVE_STATUS
} from '@/common/constants';
import SizeWrapper from '@/components/SizeWrapper';
import PrintCanvasLines from './PrintCanvasLines';
import PageWrapper from './PageWrapper';
import XRuler from './Rulers/XRuler';
import YRuler from './Rulers/YRuler';
import {
  AUTOSAVE_INTERVAL,
  COPY_OBJECT_KEY,
  DEBOUNCE_MUTATION,
  MIN_IMAGE_SIZE,
  PASTE,
  THUMBNAIL_IMAGE_CONFIG
} from '@/common/constants/config';
import { createImage } from '@/common/fabricObjects';
import { useAppCommon } from '@/hooks/common';
import { EVENT_TYPE } from '@/common/constants/eventType';
import { useStyle } from '@/hooks/style';
import { useSaveData } from './composables';
import { useSavingStatus } from '@/views/CreateBook/composables';

export default {
  components: {
    PageWrapper,
    SizeWrapper,
    PrintCanvasLines,
    XRuler,
    YRuler
  },
  setup() {
    const { setActiveEdition } = useAppCommon();
    const { setInfoBar, zoom } = useInfoBar();
    const { onSaveStyle } = useStyle();
    const { savePrintEditScreen, getDataEditScreen } = useSaveData();
    const { isOpenMenuProperties } = useMenuProperties();
    const {
      setPropertyById: setObjectPropById,
      getProperty,
      setProperty: setObjectProp
    } = useProperties();
    const { updateSavingStatus, savingStatus } = useSavingStatus();
    const { updateSheetThumbnail } = useMutationPrintSheet();

    return {
      setActiveEdition,
      setInfoBar,
      zoom,
      onSaveStyle,
      savePrintEditScreen,
      getDataEditScreen,
      setObjectPropById,
      getProperty,
      setObjectProp,
      isOpenMenuProperties,
      updateSavingStatus,
      savingStatus,
      updateSheetThumbnail
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
      autoSaveTimer: null
    };
  },
  computed: {
    ...mapGetters({
      book: GETTERS.BOOK_DETAIL,
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
      const { coverOption } = this.book;
      return (
        coverOption === COVER_TYPE.HARD_OVER &&
        this.pageSelected?.type === SHEET_TYPE.COVER
      );
    },
    isSoftCover() {
      const { coverOption } = this.book;
      return (
        coverOption === COVER_TYPE.SOFT_COVER &&
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

        this.saveData(oldVal.id);

        // get data either from API or sessionStorage
        await this.getDataCanvas();
        this.countPaste = 1;
        this.setSelectedObjectId({ id: '' });
        this.setCurrentObject(null);
        this.updateCanvasSize();
        resetObjects(window.printCanvas);

        await this.drawObjectsOnCanvas(this.sheetLayout);

        this.addPageNumber();
      }
    },
    zoom(newVal, oldVal) {
      if (newVal !== oldVal) this.updateCanvasSize();
    },
    totalObject(newVal, oldVal) {
      if (newVal !== oldVal) updateBringToFrontPageNumber(window.printCanvas);
    }
  },
  mounted() {
    this.autoSaveTimer = setInterval(this.handleAutosave, AUTOSAVE_INTERVAL);

    window.addEventListener('copy', this.handleCopy);
    window.addEventListener('paste', this.handlePaste);

    document.body.addEventListener('keyup', this.handleDeleteKey);
  },
  beforeDestroy() {
    window.removeEventListener('copy', this.handleCopy);
    window.removeEventListener('paste', this.handlePaste);

    window.printCanvas = null;

    clearInterval(this.autoSaveTimer);

    sessionStorage.removeItem(COPY_OBJECT_KEY);

    document.body.removeEventListener('keyup', this.handleDeleteKey);

    this.eventHandling(false);

    this.setInfoBar({ x: 0, y: 0, w: 0, h: 0, zoom: 0 });
  },
  methods: {
    ...mapActions({
      getDataCanvas: PRINT_ACTIONS.GET_DATA_CANVAS,
      saveLayout: PRINT_ACTIONS.SAVE_LAYOUT
    }),
    ...mapMutations({
      setBookId: PRINT_MUTATES.SET_BOOK_ID,
      setIsOpenProperties: MUTATES.TOGGLE_MENU_PROPERTIES,
      setToolNameSelected: MUTATES.SET_TOOL_NAME_SELECTED,
      setObjectTypeSelected: MUTATES.SET_OBJECT_TYPE_SELECTED,
      setSelectedObjectId: PRINT_MUTATES.SET_CURRENT_OBJECT_ID,
      setCurrentObject: MUTATES.SET_CURRENT_OBJECT,
      addNewObject: PRINT_MUTATES.ADD_OBJECT,
      addNewBackground: PRINT_MUTATES.SET_BACKGROUNDS,
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

      await this.saveData(this.pageSelected.id);

      this.updateSavingStatus({ status: SAVE_STATUS.END });

      this.isCanvasChanged = false;
    },
    /**
     *
     * @param {String | Number} sheetId id of sheet need to save data
     */
    async saveData(sheetId) {
      const data = this.getDataEditScreen(sheetId);

      await this.savePrintEditScreen(data);
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
        window.printCanvas
      );
      return image;
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
        moved: this.handleMoved
      };

      const imageObject = await createImage(imageProperties);
      const image = imageObject?.object;
      const { border } = imageProperties;

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

      updateSpecificProp(image, {
        coord: {
          rotation: imageProperties.coord.rotation
        }
      });

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
     * Set processing paste state when user pasted base on delay time
     */
    setProcessingPaste: debounce(function() {
      this.isProcessingPaste = false;
    }, PASTE.DELAY_TIME),
    /**
     * Function handle to get object(s) be copied from clipboard when user press Ctrl + V (Windows), Command + V (macOS), or from action menu
     */
    async handlePaste(event) {
      if (this.isProcessingPaste) return;
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
    },
    /**
     * Function handle to set object(s) to clipboard when user press Ctrl + C (Windows), Command + C (macOS), or from action menu
     * @param   {Object}  event event's clipboard
     */
    handleCopy(event) {
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
        ? getCoverPagePrintSize(this.isHardCover, this.book.numberMaxPages)
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

      const currentZoom =
        this.zoom === 0 ? canvasSize.width / sheetWidth : this.zoom;

      this.canvasSize = { ...canvasSize, zoom: currentZoom };

      window.printCanvas.setWidth(canvasSize.width);
      window.printCanvas.setHeight(canvasSize.height);

      window.printCanvas.setZoom(currentZoom);
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
      window.printCanvas = new fabric.Canvas(el, {
        backgroundColor: '#fff',
        preserveObjectStacking: true
      });
      setActiveCanvas(window.printCanvas);
      usePrintOverrides(fabric.Object.prototype);
      this.updateCanvasSize();
      window.printCanvas.on({
        'selection:updated': this.objectSelected,
        'selection:cleared': this.handleClearSelected,
        'selection:created': this.objectSelected,
        'object:modified': this.handleBringToFrontPageNumber,
        'object:added': this.handleCanvasChanged,
        'object:removed': this.handleCanvasChanged,

        'object:scaled': ({ target }) => {
          const { width, height } = target;
          const prop = {
            size: {
              width: pxToIn(width),
              height: pxToIn(height)
            }
          };
          this.setObjectProp({ prop });

          this.setInfoBar({ w: prop.size.width, h: prop.size.height });
          this.setCurrentObject(this.currentObjects?.[target?.id]);
        },
        'mouse:down': e => {
          if (this.awaitingAdd) {
            this.$root.$emit('printInstructionEnd');
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

          this.setInfoBar({ w: prop.size.width, h: prop.size.height });
        },
        'object:moved': e => {
          if (!e.target?.objectType) {
            this.handleMultiMoved(e);
          }
        },
        drop: ({ target }) =>
          this.$emit('drop', { target, canvas: window.printCanvas })
      });

      document.body.addEventListener('keyup', this.handleDeleteKey);
      this.eventHandling();
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
     * Open text properties modal and set default properties
     *
     * @param {String}  objectType  type of selected object
     */
    openProperties(objectType, id) {
      this.setIsOpenProperties({ isOpen: true, objectId: id });
    },
    /**
     * Reset configs text properties when close object
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
      if (this.awaitingAdd) {
        return;
      }
      this.toggleActiveObjects(true);

      const { id } = target;
      const targetType = target.get('type');
      this.setSelectedObjectId({ id });
      setBorderHighLight(target, this.sheetLayout);

      const objectData = this.currentObjects?.[id];

      this.setCurrentObject(objectData);

      if (targetType === 'group' && target.objectType === OBJECT_TYPE.TEXT) {
        const rectObj = target.getObjects(OBJECT_TYPE.RECT)[0];
        setBorderObject(rectObj, objectData);
      }

      const objectType = objectData?.type;
      const isSelectMultiObject = !objectType;

      this.setInfoBar({
        w: isSelectMultiObject ? 0 : this.getProperty('size')?.width,
        h: isSelectMultiObject ? 0 : this.getProperty('size')?.height
      });

      if (isSelectMultiObject) {
        setCanvasUniformScaling(window.printCanvas, true);

        this.resetConfigTextProperties();
      } else {
        setCanvasUniformScaling(window.printCanvas, objectData.isConstrain);
      }

      if (isEmpty(objectType)) return;

      this.setObjectTypeSelected({ type: objectType });

      this.setPropertiesObjectType({ type: objectType });

      this.openProperties(objectType, id);
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
     * Event fire when user click on Text button on Toolbar to add new text on canvas
     */
    addText(x, y, width, height) {
      const { object, data } = createTextBox(x, y, width, height, {});

      this.handleAddTextEventListeners(object, data);

      this.addObjectToStore(data);

      const isConstrain = data.newObject.isConstrain;

      setCanvasUniformScaling(window.printCanvas, isConstrain);

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
    changeTextProperties(prop) {
      this.changeElementProperties(prop, OBJECT_TYPE.TEXT);
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
    async addImageBox(x, y, width, height) {
      const id = uniqueId();
      const newImage = cloneDeep({
        id,
        newObject: {
          ...ImageElement,
          id,
          size: {
            width: pxToIn(width),
            height: pxToIn(height)
          },
          coord: {
            ...ImageElement.coord,
            x: pxToIn(x),
            y: pxToIn(y)
          },
          imageUrl: DEFAULT_IMAGE.IMAGE_URL
        }
      });
      const eventListeners = {
        scaling: this.handleScaling,
        scaled: this.handleScaled,
        rotated: this.handleRotated,
        moved: this.handleMoved,
        dragenter: handleDragEnter,
        dragleave: handleDragLeave,
        drop: handleDragLeave
      };

      const image = await createImage(newImage.newObject);
      merge(newImage.newObject, { size: image?.size });

      this.addObjectToStore(newImage);

      imageBorderModifier(image.object);

      addEventListeners(image?.object, eventListeners);
      window.printCanvas.add(image?.object);
      selectLatestObject(window.printCanvas);
    },
    /**
     * Adding background to canvas & store
     *
     * @param {Object}  background  the object of adding background
     * @param {Boolean} isLeft      is add to the left page or right page
     */
    addBackground({ background, isLeft = true }) {
      const id = uniqueId();

      const newBackground = cloneDeep(BackgroundElement);

      merge(newBackground, {
        ...background,
        backgroundId: background.id
      });

      addPrintBackground({
        id,
        backgroundProp: newBackground,
        isLeftBackground: isLeft,
        sheetType: this.pageSelected.type,
        canvas: window.printCanvas
      });

      this.addNewBackground({
        background: {
          ...newBackground,
          id,
          isLeftPage: isLeft
        }
      });
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
      this.deleteBackground({ isLeft: isLeftBackground });

      deleteObjectById([backgroundId], window.printCanvas);

      if (this.totalBackground > 0) return;

      this.closeProperties();

      this.setIsOpenProperties({ isOpen: false });

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
      const toBeAddedClipArts = clipArts.map(c => {
        const newClipArt = cloneDeep(ClipArtElement);
        const id = uniqueId();

        merge(newClipArt, c);

        return {
          id,
          object: {
            ...newClipArt,
            vector: require(`../../../../../assets/image/clip-art/${newClipArt.vector}`)
          }
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

        const newClipArt = {
          id: s.id,
          newObject: {
            ...s.object,
            coord: {
              x: pxToIn(left),
              y: pxToIn(top)
            },
            size: {
              width: pxToIn(width * scaleX),
              height: pxToIn(height * scaleY)
            }
          }
        };
        this.addObjectToStore(newClipArt);
      });

      if (toBeAddedClipArts.length === 1) {
        selectLatestObject(window.printCanvas);
      } else {
        this.closeProperties();
      }
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
        const newShape = cloneDeep(ShapeElement);

        merge(newShape, s);

        return {
          id: uniqueId(),
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

        const newShape = {
          id: s.id,
          newObject: {
            ...s.object,
            coord: {
              x: pxToIn(left),
              y: pxToIn(top)
            }
          }
        };
        this.addObjectToStore(newShape);
      });

      if (toBeAddedShapes.length === 1) {
        selectLatestObject(window.printCanvas);
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
     * Event fire when user change any property of selected image box
     *
     * @param {Object}  prop  new prop
     */
    changeImageProperties(prop) {
      const { border } = prop;

      const activeObject = window.printCanvas.getActiveObject();

      if (border) {
        applyBorderToImageObject(activeObject, border);
      }

      this.changeElementProperties(prop, OBJECT_TYPE.IMAGE);
    },
    /**
     * Change properties of current element
     *
     * @param {Object}  prop            new prop
     * @param {String}  objectType      object type want to check
     */
    changeElementProperties(prop, objectType) {
      if (isEmpty(prop)) return;

      const element = window.printCanvas.getActiveObject();

      if (isEmpty(element) || element.objectType !== objectType) return;

      const newProp = this.updateElementProp(element, prop, objectType);

      if (objectType === OBJECT_TYPE.TEXT) {
        this.debounceSetCurrentObject(element.id, newProp);
      } else {
        this.updateCurrentObject(element.id, newProp);
      }

      this.updateInfoBar(newProp);

      if (
        !isEmpty(newProp['shadow']) ||
        !isEmpty(newProp['color']) ||
        !isEmpty(newProp['opacity'])
      ) {
        this.debounceSetObjectProp(newProp);
      } else {
        this.setObjectProperties(newProp);
      }
    },
    /**
     * Change fabric properties of current element
     *
     * @param {Object}  element     selected element
     * @param {Object}  prop        new prop
     * @param {String}  objectType  object type of selected element
     */
    updateElementProp(element, prop, objectType) {
      if (objectType === OBJECT_TYPE.TEXT) {
        applyTextBoxProperties(element, prop);

        // After fixing "one change only triggers one mutation"
        // this will return new prop get from fabric element
        return prop;
      }

      if (objectType === OBJECT_TYPE.IMAGE) {
        const { border } = prop;

        if (!isEmpty(border)) {
          applyBorderToImageObject(element, border);
        }
      }

      updateElement(element, prop, window.printCanvas);

      // After fixing "one change only triggers one mutation"
      // this will return new prop get from fabric element
      return prop;
    },
    /**
     * Update current object by mutate the store
     *
     * @param {String | Number} id  id of selected object
     * @param {Object}  prop        new prop
     */
    updateCurrentObject(id, prop) {
      return new Promise(resole => {
        this.setCurrentObject({
          ...this.currentObjects?.[id],
          ...prop
        });

        resole();
      });
    },
    /**
     * Update width & height info on info bar
     *
     * @param {Object}  prop  new prop
     */
    updateInfoBar(prop) {
      return new Promise(resole => {
        if (!isEmpty(prop.size)) {
          this.setInfoBar({ w: prop.size.width, h: prop.size.height });
        }

        resole();
      });
    },
    // Will be removed after fixing "one change only triggers one mutation"
    setObjectProperties(prop) {
      this.setObjectProp({ prop });

      this.handleCanvasChanged();
    },
    // Will be removed after fixing "one change only triggers one mutation"
    debounceSetCurrentObject: debounce(function(id, prop) {
      this.updateCurrentObject(id, prop);
    }, DEBOUNCE_MUTATION),
    /**
     * Set properties of selected object then trigger the change
     * Use with debounce
     *
     * @param {Object}  prop            new prop
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
        return;
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
          this.$root.$emit('printInstructionEnd');
          this.awaitingAdd = element;
          this.$root.$emit('printInstructionStart', { element });
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
        printChangeBackgroundProperties: this.changeBackgroundProperties,
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
        printSwitchTool: toolName => {
          const isDiscard =
            toolName &&
            toolName !== TOOL_NAME.DELETE &&
            toolName !== TOOL_NAME.ACTIONS;

          if (isDiscard) {
            window.printCanvas.discardActiveObject().renderAll();
          }

          if (isNonElementPropSelected(this.propertiesObjectType)) {
            this.setIsOpenProperties({ isOpen: false });

            this.setPropertiesObjectType({ type: '' });
          }

          this.$root.$emit('printInstructionEnd');

          this.awaitingAdd = '';
        },
        enscapeInstruction: () => {
          this.awaitingAdd = '';
          this.$root.$emit('printInstructionEnd');

          this.setToolNameSelected({ name: '' });
        },

        [EVENT_TYPE.COPY_OBJ]: this.handleCopy,
        [EVENT_TYPE.PASTE_OBJ]: this.handlePaste,
        [EVENT_TYPE.SAVE_LAYOUT]: this.handleSaveLayout,

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

        if (objectData.type === OBJECT_TYPE.IMAGE) {
          return this.createImageFromPpData(objectData);
        }

        if (objectData.type === OBJECT_TYPE.BACKGROUND) {
          return this.createBackgroundFromPpData(objectData);
        }
      });

      const listFabricObjects = await Promise.all(allObjectPromises);
      window.printCanvas.add(...listFabricObjects);
      window.printCanvas.requestRenderAll();
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
      this.setInfoBar({ w: 0, h: 0 });

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
    async handleSaveLayout({ pageSelected, layoutName }) {
      layoutName = layoutName.trim() || 'Untitled';
      const zoom = window.printCanvas.getZoom();
      const width = window.printCanvas.width;

      const positionCenterX = pxToIn(width / zoom / 2);

      const objects = cloneDeep(Object.values(this.currentObjects));
      const backgrounds = cloneDeep(this.currentBackgrounds);

      let ppObjects = [...objects];
      let layout = {
        id: parseInt(uniqueId()) + 100,
        name: layoutName,
        isFavorites: false,
        previewImageUrl: window.printCanvas.toDataURL({
          quality: THUMBNAIL_IMAGE_CONFIG.QUALITY
        }),
        pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
      };

      if (pageSelected === 'left') {
        ppObjects = objects.filter(item => item?.coord?.x < positionCenterX);

        delete backgrounds.right;

        layout = {
          ...layout,
          previewImageUrl: window.printCanvas.toDataURL({
            quality: THUMBNAIL_IMAGE_CONFIG.QUALITY,
            width: width / 2
          }),
          pageType: LAYOUT_PAGE_TYPE.SINGLE_PAGE.id
        };
      }

      if (pageSelected === 'right') {
        ppObjects = objects.filter(item => item?.coord?.x >= positionCenterX);
        for (const item of ppObjects) {
          item.coord.x -= positionCenterX;
        }

        delete backgrounds.left;

        layout = {
          ...layout,
          previewImageUrl: window.printCanvas.toDataURL({
            quality: THUMBNAIL_IMAGE_CONFIG.QUALITY,
            left: width / 2,
            width: width / 2
          }),
          pageType: LAYOUT_PAGE_TYPE.SINGLE_PAGE.id
        };
      }

      const ppBackgrounds = Object.values(backgrounds).filter(
        item => !isEmpty(item)
      );

      layout.objects = [...ppBackgrounds, ...ppObjects];

      await this.saveLayout({ layout });
    },
    async drawLayout() {
      await this.drawObjectsOnCanvas(this.sheetLayout);
    },

    /**
     * Handle reset image
     */
    handleRemoveImage() {
      const activeObject = window.printCanvas.getActiveObject();
      setImageSrc(activeObject, null, prop => {
        this.setObjectPropById({ id: activeObject.id, prop });
        this.setCurrentObject(this.currentObjects[activeObject.id]);
        this.getThumbnailUrl();
      });
    },

    /**
     * Handle centercrop
     */
    handleCentercrop() {
      const activeObject = window.printCanvas.getActiveObject();
      centercrop(activeObject, prop => {
        this.setObjectPropById({ id: activeObject.id, prop });
      });
    }
  }
};
