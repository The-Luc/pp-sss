import { mapGetters, mapMutations, mapActions } from 'vuex';
import { fabric } from 'fabric';
import { cloneDeep, uniqueId, merge, debounce } from 'lodash';

import { usePrintOverrides } from '@/plugins/fabric';

import { useDrawLayout, useInfoBar } from '@/hooks';
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
  getMinPositionObject,
  computePastedObjectCoord,
  setBorderObject,
  setCanvasUniformScaling,
  setBorderHighLight,
  setActiveCanvas,
  isNonElementPropSelected,
  copyPpObject
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
  updateBringToFrontPageNumber
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
  FABRIC_OBJECT_TYPE,
  DEFAULT_IMAGE,
  ACTIVE_EDITION
} from '@/common/constants';
import SizeWrapper from '@/components/SizeWrapper';
import PrintCanvasLines from './PrintCanvasLines';
import PageWrapper from './PageWrapper';
import XRuler from './Rulers/XRuler';
import YRuler from './Rulers/YRuler';
import { parsePasteObject } from '@/common/utils/string';
import {
  COPY_OBJECT_KEY,
  PASTE,
  THUMBNAIL_IMAGE_QUALITY
} from '@/common/constants/config';
import { createImage } from '@/common/fabricObjects';
import printService from '@/api/print';
import { useAppCommon } from '@/hooks/common';
import { EVENT_TYPE } from '@/common/constants/eventType';

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
    const { drawLayout } = useDrawLayout();
    const { setInfoBar, zoom } = useInfoBar();

    return { setActiveEdition, drawLayout, setInfoBar, zoom };
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
      rulerSize: { width: '0', height: '0' }
    };
  },
  computed: {
    ...mapGetters({
      book: GETTERS.BOOK_DETAIL,
      pageSelected: PRINT_GETTERS.CURRENT_SHEET,
      sheetLayout: PRINT_GETTERS.SHEET_LAYOUT,
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES,
      toolNameSelected: APP_GETTERS.SELECTED_TOOL_NAME,
      currentBackgrounds: PRINT_GETTERS.BACKGROUNDS,
      propertiesObjectType: APP_GETTERS.PROPERTIES_OBJECT_TYPE,
      object: PRINT_GETTERS.OBJECT_BY_ID,
      currentObjects: PRINT_GETTERS.GET_OBJECTS,
      totalBackground: PRINT_GETTERS.TOTAL_BACKGROUND,
      totalObject: PRINT_GETTERS.TOTAL_OBJECT,
      getProperty: APP_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      getPageInfo: PRINT_GETTERS.GET_PAGE_INFO
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
    isIntro() {
      const { sections } = this.book;
      return this.pageSelected?.id === sections[1].sheets[0].id;
    },
    isSignature() {
      const { sections } = this.book;
      const lastSection = sections[sections.length - 1];
      return (
        this.pageSelected?.id ===
        lastSection.sheets[lastSection.sheets.length - 1].id
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
        if (val?.id !== oldVal?.id) {
          // save the previous canvas on sessionStorage
          printService.saveCanvasState(oldVal.id, this.sheetLayout);

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
    window.addEventListener('copy', this.handleCopy);
    window.addEventListener('paste', this.handlePaste);

    document.body.addEventListener('keyup', this.handleDeleteKey);

    this.setActiveEdition(ACTIVE_EDITION.PRINT);
  },
  beforeDestroy() {
    window.removeEventListener('copy', this.handleCopy);
    window.removeEventListener('paste', this.handlePaste);

    // save the current sheet to sessionStorage
    printService.saveCanvasState(this.pageSelected.id, this.sheetLayout);

    window.printCanvas = null;

    sessionStorage.removeItem(COPY_OBJECT_KEY);

    document.body.removeEventListener('keyup', this.handleDeleteKey);

    this.eventHandling(false);

    this.setInfoBar({ x: 0, y: 0, w: 0, h: 0, zoom: 0 });

    this.setActiveEdition(ACTIVE_EDITION.NONE);
  },
  methods: {
    ...mapActions({
      getDataCanvas: PRINT_ACTIONS.GET_DATA_CANVAS
    }),
    ...mapMutations({
      setBookId: PRINT_MUTATES.SET_BOOK_ID,
      setIsOpenProperties: MUTATES.TOGGLE_MENU_PROPERTIES,
      setToolNameSelected: MUTATES.SET_TOOL_NAME_SELECTED,
      setObjectTypeSelected: MUTATES.SET_OBJECT_TYPE_SELECTED,
      setSelectedObjectId: PRINT_MUTATES.SET_CURRENT_OBJECT_ID,
      setCurrentObject: MUTATES.SET_CURRENT_OBJECT,
      setObjects: PRINT_MUTATES.SET_OBJECTS,
      addNewObject: PRINT_MUTATES.ADD_OBJECT,
      setObjectProp: PRINT_MUTATES.SET_PROP,
      setObjectPropById: PRINT_MUTATES.SET_PROP_BY_ID,
      updateTriggerTextChange: MUTATES.UPDATE_TRIGGER_TEXT_CHANGE,
      addNewBackground: PRINT_MUTATES.SET_BACKGROUNDS,
      updateTriggerBackgroundChange:
        PRINT_MUTATES.UPDATE_TRIGGER_BACKGROUND_CHANGE,
      deleteObjects: PRINT_MUTATES.DELETE_OBJECTS,
      updateTriggerShapeChange: MUTATES.UPDATE_TRIGGER_SHAPE_CHANGE,
      setThumbnail: PRINT_MUTATES.UPDATE_SHEET_THUMBNAIL,
      updateTriggerClipArtChange: MUTATES.UPDATE_TRIGGER_CLIPART_CHANGE,
      reorderObjectIds: PRINT_MUTATES.REORDER_OBJECT_IDS,
      toggleActiveObjects: MUTATES.TOGGLE_ACTIVE_OBJECTS,
      setPropertiesObjectType: MUTATES.SET_PROPERTIES_OBJECT_TYPE,
      setBackgroundProp: PRINT_MUTATES.SET_BACKGROUND_PROP,
      deleteBackground: PRINT_MUTATES.DELETE_BACKGROUND
    }),

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
      const image = await createImage(imageProperties);

      return image;
    },

    /**
     * add text to the store and create fabric object
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
     * Funtion recursive handle create object(s) and add to store through data be copied and return list object(s) processed
     * @param {Array} objects - List object(s) copied
     * @param {Number} sheetId - Current sheet id
     * @param {Object} fabricObject Fabric's data
     * @param {Number} minLeft Min left position of list objects
     * @param {Number} minTop Min top position of list objects
     * @returns {Arrray} List object(s) pasted
     */
    async handlePasteItems(objects, sheetId, fabricObject, minLeft, minTop) {
      return Promise.all(
        objects.map(o => {
          const obj = cloneDeep(o);

          const coord = computePastedObjectCoord(
            obj,
            sheetId,
            fabricObject,
            minLeft,
            minTop,
            this.pageSelected,
            this.countPaste
          );

          const newData = {
            ...obj,
            id: uniqueId(),
            coord
          };

          // add to store
          if (obj.type !== OBJECT_TYPE.BACKGROUND) {
            this.addObjectToStore({
              id: newData.id,
              newObject: newData
            });
          }

          // create fabric object
          if (obj.type === OBJECT_TYPE.IMAGE) {
            return this.createImageFromPpData(newData);
          }

          if (
            obj.type === OBJECT_TYPE.CLIP_ART ||
            obj.type === OBJECT_TYPE.SHAPE
          ) {
            return this.createSvgFromPpData(newData);
          }

          if (obj.type === OBJECT_TYPE.TEXT) {
            return this.createTextFromPpData(newData);
          }
        })
      );
    },

    /**
     * Function handle active selection of object(s) pasted (single | multiplesingle)
     * @param {Array} listPastedObjects - List object(s) pasted
     * @param {Ref} canvas - Print canvas
     */
    setObjectPastetActiveSelection(listPastedObjects, canvas) {
      if (listPastedObjects.length === 1) {
        canvas.setActiveObject(listPastedObjects[0]);
      } else if (listPastedObjects.length > 1) {
        const sel = new fabric.ActiveSelection(listPastedObjects, {
          canvas
        });
        canvas.setActiveObject(sel);
      }
    },
    /**
     * Function clear object(s) copied when user paste data from outside while editing text
     * @param {String} dataOutside Data copy from outside app
     */
    clearObjectCopied(dataOutside) {
      if (!dataOutside) return;

      const activeObj = window.printCanvas.getActiveObject();
      const objectType = activeObj?.get('type');

      if (
        dataOutside &&
        objectType === FABRIC_OBJECT_TYPE.TEXT &&
        activeObj?.isEditing
      ) {
        sessionStorage.removeItem(COPY_OBJECT_KEY);
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

      const objectCopy = sessionStorage.getItem(COPY_OBJECT_KEY);
      const objects = parsePasteObject(objectCopy);

      if (isEmpty(objects)) return;

      let dataCopyOutside = (
        event?.clipboardData || window?.clipboardData
      )?.getData('text');

      this.clearObjectCopied(dataCopyOutside);

      if (dataCopyOutside) {
        this.setProcessingPaste();
        return;
      }
      const { sheetId, fabric } = JSON.parse(objectCopy);

      const canvas = window.printCanvas;
      canvas.discardActiveObject();

      const { minLeft, minTop } = getMinPositionObject(fabric);

      const listPastedObjects = await this.handlePasteItems(
        objects,
        sheetId,
        fabric,
        minLeft,
        minTop
      );

      canvas.add(...listPastedObjects);

      this.setObjectPastetActiveSelection(listPastedObjects, canvas);

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
     * call this function to update the active thumbnail
     */
    getThumbnailUrl: debounce(function() {
      const thumbnailUrl = window.printCanvas.toDataURL({
        quality: THUMBNAIL_IMAGE_QUALITY
      });

      this.setThumbnail({
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
        'object:added': this.getThumbnailUrl,
        'object:removed': this.getThumbnailUrl,

        'object:scaled': ({ target }) => {
          const { width, height } = target;
          const prop = {
            size: {
              width: pxToIn(width),
              height: pxToIn(height)
            }
          };
          this.setObjectProp({ prop });
          this.updateTriggerTextChange();

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
                  this.addImageBox(left, top, width, height);
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
          this.updateTriggerTextChange();

          this.setInfoBar({ w: prop.size.width, h: prop.size.height });
        },
        'object:moved': e => {
          if (!e.target?.objectType) {
            this.handleMultiMoved(e);
          }
        }
      });

      document.body.addEventListener('keyup', this.handleDeleteKey);
      this.eventHandling();
    },
    /**
     * Event handle bring to front page number
     */
    handleBringToFrontPageNumber() {
      this.getThumbnailUrl;
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

      if (event.target === document.body && (key == 8 || key == 46)) {
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

      if (objectType === OBJECT_TYPE.TEXT) {
        this.updateTriggerTextChange();
      }
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
      if (isEmpty(prop)) {
        this.updateTriggerTextChange();

        return;
      }
      const activeObj = window.printCanvas.getActiveObject();

      if (isEmpty(activeObj)) return;

      this.setObjectProp({ prop });

      this.updateTriggerTextChange();

      if (!isEmpty(prop.size)) {
        this.setInfoBar({ w: prop.size.width, h: prop.size.height });
      }

      applyTextBoxProperties(activeObj, prop);

      // update thumbnail
      this.getThumbnailUrl();

      this.setCurrentObject(this.currentObjects?.[activeObj?.id]);
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

      this.addObjectToStore(newImage);

      const image = await createImage(newImage.newObject);
      window.printCanvas.add(image);
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

      this.addNewBackground({
        background: {
          ...newBackground,
          id,
          isLeftPage: isLeft
        }
      });

      addPrintBackground({
        id,
        backgroundProp: newBackground,
        isLeftBackground: isLeft,
        sheetType: this.pageSelected.type,
        canvas: window.printCanvas
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

      const background = window.printCanvas
        .getObjects()
        .find(o => backgroundId === o.id);

      if (isEmpty(background)) return;

      this.setBackgroundProp({ isLeft: isLeftBackground, prop });

      this.updateTriggerBackgroundChange();

      updateElement(background, prop, window.printCanvas);
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

      if (this.totalBackground === 0) {
        this.closeProperties();

        this.setIsOpenProperties({ isOpen: false });

        this.setPropertiesObjectType({ type: '' });
      }
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
      this.changeElementProperties(
        prop,
        OBJECT_TYPE.SHAPE,
        this.updateTriggerShapeChange
      );
    },
    /**
     * Event fire when user change any property of selected clipart
     *
     * @param {Object}  prop  new prop
     */
    changeClipArtProperties(prop) {
      this.changeElementProperties(
        prop,
        OBJECT_TYPE.CLIP_ART,
        this.updateTriggerClipArtChange
      );
    },
    /**
     * Change properties of current element
     *
     * @param {Object}  prop            new prop
     * @param {String}  objectType      object type want to check
     * @param {Object}  updateTriggerFn mutate update trigger function
     */
    changeElementProperties(prop, objectType, updateTriggerFn = null) {
      if (isEmpty(prop)) {
        if (updateTriggerFn !== null) updateTriggerFn();

        return;
      }

      const element = window.printCanvas.getActiveObject();

      if (isEmpty(element) || element.objectType !== objectType) return;

      this.setObjectProp({ prop });

      if (updateTriggerFn !== null) updateTriggerFn();

      if (!isEmpty(prop.size)) {
        this.setInfoBar({ w: prop.size.width, h: prop.size.height });
      }

      if (!isEmpty(prop['shadow'])) {
        applyShadowToObject(element, prop['shadow']);
      }

      updateElement(element, prop, window.printCanvas);

      // update thumbnail
      this.getThumbnailUrl();

      this.setCurrentObject(this.currentObjects?.[element?.id]);
    },
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
        //update thumbnail
        this.getThumbnailUrl();
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
        changeObjectIdsOrder: this.changeObjectIdsOrder
      };

      const textEvents = {
        changeTextProperties: prop => {
          this.getThumbnailUrl();
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

        pageNumber: this.addPageNumber
      };

      const events = {
        ...elementEvents,
        ...textEvents,
        ...backgroundEvents,
        ...shapeEvents,
        ...clipArtEvents,
        ...otherEvents
      };

      Object.keys(events).forEach(eventName => {
        this.$root.$off(eventName);

        if (isOn) this.$root.$on(eventName, events[eventName]);
      });
    },

    /**
     * create and render objects on the canvas
     * @param {Object} objects ppObjects that will be rendered
     */
    async drawObjectsOnCanvas(objects) {
      if (isEmpty(objects)) return;

      const allObjectPrommises = objects.map(objectData => {
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

      const listFabricObjects = await Promise.all(allObjectPrommises);
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
        const { id, left, top, objectType } = item;
        const currentXInch = pxToIn(left + target.left + target.width / 2);
        const currentYInch = pxToIn(top + target.top + target.height / 2);

        const prop = {
          coord: {
            x: currentXInch,
            y: currentYInch
          }
        };

        this.setObjectPropById({ id, prop });

        if (objectType === OBJECT_TYPE.SHAPE) {
          this.updateTriggerShapeChange();
        } else if (objectType === OBJECT_TYPE.CLIP_ART) {
          this.updateTriggerClipArtChange();
        } else if (objectType === OBJECT_TYPE.TEXT) {
          this.updateTriggerTextChange();
        }
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
    }
  }
};
