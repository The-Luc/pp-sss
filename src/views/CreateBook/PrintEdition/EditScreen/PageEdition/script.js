import { mapGetters, mapMutations, mapActions } from 'vuex';
import { fabric } from 'fabric';
import { cloneDeep, uniqueId, merge, debounce } from 'lodash';

import { usePrintOverrides } from '@/plugins/fabric';

import { useDrawLayout } from '@/hooks';
import { startDrawBox } from '@/common/fabricObjects/drawingBox';
import {
  isEmpty,
  getCoverPagePrintSize,
  getPagePrintSize,
  toFabricImageProp,
  selectLatestObject,
  deleteSelectedObjects,
  getRectDashes,
  scaleSize,
  isHalfSheet,
  isHalfLeft,
  pxToIn,
  inToPx,
  isJsonString
} from '@/common/utils';

import {
  createTextBox,
  applyTextBoxProperties,
  addPrintBackground,
  updatePrintBackground,
  getAdjustedObjectDimension,
  addPrintShapes,
  addPrintClipArts
} from '@/common/fabricObjects';

import { updateElement } from '@/common/fabricObjects/common';

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
  CORNER_SIZE,
  DEFAULT_SHAPE,
  COVER_TYPE
} from '@/common/constants';
import SizeWrapper from '@/components/SizeWrapper';
import PrintCanvasLines from './PrintCanvasLines';
import PageWrapper from './PageWrapper';
import XRuler from './Rulers/XRuler';
import YRuler from './Rulers/YRuler';
import { isFabricObject } from '@/common/utils/string';
import { COPY_OBJECT_KEY } from '@/common/constants/config';

export default {
  components: {
    PageWrapper,
    SizeWrapper,
    PrintCanvasLines,
    XRuler,
    YRuler
  },
  setup() {
    const { drawLayout } = useDrawLayout();

    return { drawLayout };
  },
  created() {
    this.getDataPageEdit();
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
      rectObj: null
    };
  },
  computed: {
    ...mapGetters({
      book: GETTERS.BOOK_DETAIL,
      pageSelected: PRINT_GETTERS.CURRENT_SHEET,
      sheetLayout: PRINT_GETTERS.SHEET_LAYOUT,
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES,
      isOpenColorPicker: APP_GETTERS.IS_OPEN_COLOR_PICKER,
      selectedObject: PRINT_GETTERS.CURRENT_OBJECT,
      toolNameSelected: APP_GETTERS.SELECTED_TOOL_NAME
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
      handler(val, oldVal) {
        if (val?.id !== oldVal?.id) {
          this.setSelectedObjectId({ id: '' });
          this.updateCanvasSize();
          window.printCanvas
            .discardActiveObject()
            .remove(...window.printCanvas.getObjects())
            .renderAll();
          this.updateCanvasSize();
          const sheetPrintData = this.sheetLayout(val.id);
          this.drawLayout(sheetPrintData);
        }
      }
    }
  },
  mounted() {
    window.addEventListener('copy', this.handleCopy);
    window.addEventListener('paste', this.handlePaste);
  },
  beforeDestroy() {
    document.body.removeEventListener('keyup', this.handleDeleteKey);
    window.removeEventListener('copy', this.handleCopy);
    window.removeEventListener('paste', this.handlePaste);
    window.printCanvas = null;
  },
  methods: {
    ...mapActions({
      getDataPageEdit: PRINT_ACTIONS.GET_DATA_EDIT
    }),
    ...mapMutations({
      setBookId: PRINT_MUTATES.SET_BOOK_ID,
      setIsOpenProperties: MUTATES.TOGGLE_MENU_PROPERTIES,
      setToolNameSelected: MUTATES.SET_TOOL_NAME_SELECTED,
      toggleColorPicker: MUTATES.TOGGLE_COLOR_PICKER,
      setObjectTypeSelected: MUTATES.SET_OBJECT_TYPE_SELECTED,
      setSelectedObjectId: PRINT_MUTATES.SET_CURRENT_OBJECT_ID,
      addNewObject: PRINT_MUTATES.ADD_OBJECT,
      setObjectProp: PRINT_MUTATES.SET_PROP,
      setObjectPropById: PRINT_MUTATES.SET_PROP_BY_ID,
      setPropOfMutiObjects: PRINT_MUTATES.SET_PROP_OF_MULIPLE_OBJECTS,
      updateTriggerTextChange: PRINT_MUTATES.UPDATE_TRIGGER_TEXT_CHANGE,
      addNewBackground: PRINT_MUTATES.SET_BACKGROUNDS,
      updateTriggerBackgroundChange:
        PRINT_MUTATES.UPDATE_TRIGGER_BACKGROUND_CHANGE,
      deleteObjects: PRINT_MUTATES.DELETE_OBJECTS,
      updateTriggerShapeChange: PRINT_MUTATES.UPDATE_TRIGGER_SHAPE_CHANGE,
      setThumbnail: PRINT_MUTATES.UPDATE_SHEET_THUMBNAIL,
      updateTriggerClipArtChange: PRINT_MUTATES.UPDATE_TRIGGER_CLIPART_CHANGE,
      toggleActiveObjects: MUTATES.TOGGLE_ACTIVE_OBJECTS
    }),
    /**
     * Function handle to get object(s) be copied from clipboard when user press Ctrl + V (Windows), Command + V (macOS), or from action menu
     */
    handlePaste() {
      navigator.clipboard.readText().then(clipText => {
        const isJson = isJsonString(clipText);
        if (isJson) {
          const isValid = isFabricObject(clipText);
          if (isValid) {
            const data = JSON.parse(clipText);
            console.log('handlePaste', data);
          }
        }
      });
    },
    /**
     * Function handle to set object(s) to clipboard when user press Ctrl + C (Windows), Command + C (macOS), or from action menu
     */
    handleCopy() {
      const activeObj = window.printCanvas.getActiveObject();
      if (activeObj) {
        const cacheData = {
          [COPY_OBJECT_KEY]: {
            activeObj
          }
        };
        navigator.clipboard.writeText(JSON.stringify(cacheData));
      }
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
      const { ratio: printRatio, sheetWidth } = this.printSize.pixels;
      if (this.containerSize.ratio > printRatio) {
        canvasSize.height = this.containerSize.height;
        canvasSize.width = canvasSize.height * printRatio;
      } else {
        canvasSize.width = this.containerSize.width;
        canvasSize.height = canvasSize.width / printRatio;
      }
      const currentZoom = canvasSize.width / sheetWidth;
      this.canvasSize = { ...canvasSize, zoom: currentZoom };
      window.printCanvas.setWidth(canvasSize.width);
      window.printCanvas.setHeight(canvasSize.height);
      const sheetPrintData = this.sheetLayout(this.pageSelected?.id);
      this.drawLayout(sheetPrintData);
      window.printCanvas.setZoom(currentZoom);
    },
    getThumbnailUrl: debounce(function() {
      const thumbnailUrl = window.printCanvas.toDataURL();
      this.setThumbnail({
        sheetId: this.pageSelected?.id,
        thumbnailUrl
      });
    }, 1000),
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

      usePrintOverrides(fabric.Object.prototype);
      this.updateCanvasSize();
      window.printCanvas.on({
        'selection:updated': this.objectSelected,
        'selection:cleared': this.closeProperties,
        'selection:created': this.objectSelected,
        'object:modified': () => {
          if (window.printCanvas) {
            this.getThumbnailUrl();
          }
        },
        'object:scaled': ({ target }) => {
          const { width, height } = target;
          const propAdjust = {
            size: {
              width,
              height
            }
          };
          this.setObjectProp({ id: target.id, property: propAdjust });
          this.updateTriggerTextChange();
        },
        'mouse:down': e => {
          if (this.awaitingAdd) {
            this.$root.$emit('printInstructionEnd');
            window.printCanvas.discardActiveObject().renderAll();
            this.setToolNameSelected({ name: '' });
            startDrawBox(window.printCanvas, e).then(
              ({ left, top, width, height }) => {
                if (this.awaitingAdd === OBJECT_TYPE.TEXT) {
                  left += width / 2;
                  top += height / 2;
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
        'object:added': ({ target }) => {
          if (
            target.objectType &&
            target.objectType !== OBJECT_TYPE.BACKGROUND
          ) {
            this.$root.$emit('updateZIndexToStore');
          }
        }
      });

      this.$root.$on('printSwitchTool', toolName => {
        const isDiscard =
          toolName &&
          toolName !== TOOL_NAME.DELETE &&
          toolName !== TOOL_NAME.ACTIONS;
        if (isDiscard) {
          window.printCanvas.discardActiveObject().renderAll();
        }
        this.$root.$emit('printInstructionEnd');
        this.awaitingAdd = '';
      });

      this.$root.$on('printAddElement', element => {
        this.$root.$emit('printInstructionEnd');
        this.awaitingAdd = element;
        this.$root.$emit('printInstructionStart', { element });
      });

      this.$root.$on('enscapeInstruction', () => {
        this.awaitingAdd = '';
        this.$root.$emit('printInstructionEnd');
        this.setToolNameSelected({ name: '' });
      });

      this.$root.$on('printAddClipArt', clipArts => {
        this.addClipArt(clipArts);
      });

      this.$root.$on('printDeleteElements', () => {
        this.removeObject();
      });

      this.$root.$on('printChangeTextProperties', prop => {
        this.getThumbnailUrl();
        this.changeTextProperties(prop);
      });

      this.$root.$on('printAddBackground', ({ background, isLeft }) => {
        this.addBackground({ background, isLeft });
      });

      this.$root.$on('printChangeBackgroundProperties', prop => {
        this.changeBackgroundProperties(prop);
      });

      this.$root.$on('printAddShapes', shapes => {
        this.addShapes(shapes);
      });

      this.$root.$on('printChangeShapeProperties', prop => {
        this.changeShapeProperties(prop);
      });

      this.$root.$on('updateZIndexToStore', () => {
        this.updateZIndexToStore();
      });

      this.$root.$on('printChangeClipArtProperties', prop => {
        this.changeClipArtProperties(prop);
      });

      this.$root.$on('printCopyObj', () => {
        this.handleCopy();
      });

      document.body.addEventListener('keyup', this.handleDeleteKey);
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
    openProperties(objectType) {
      this.setIsOpenProperties({ isOpen: true });

      if (objectType === OBJECT_TYPE.TEXT) {
        this.updateTriggerTextChange();
      }
    },
    /**
     * Reset configs text properties when close object
     */
    resetConfigTextProperties() {
      if (this.isOpenColorPicker) {
        this.toggleColorPicker({
          isOpen: false
        });
      }

      this.setIsOpenProperties({
        isOpen: false
      });

      this.setObjectTypeSelected({
        type: ''
      });

      this.toggleActiveObjects(false);

      this.setSelectedObjectId({ id: '' });
      if (this.toolNameSelected === TOOL_NAME.ACTIONS) {
        this.setToolNameSelected({ name: '' });
      }
    },
    /**
     * Close text properties modal
     */
    closeProperties() {
      this.groupSelected = null;
      this.resetConfigTextProperties();
    },
    /**
     * Get border data from store and set to Rect object
     */
    setBorderObject(rectObj, objectData) {
      const { strokeWidth, stroke, strokeLineCap } = objectData.border;
      const strokeDashArrayVal = getRectDashes(
        rectObj.width,
        rectObj.height,
        strokeLineCap,
        strokeWidth
      );
      rectObj.set({
        strokeWidth: scaleSize(strokeWidth),
        stroke,
        strokeLineCap,
        strokeDashArray: strokeDashArrayVal
      });
      setTimeout(() => {
        rectObj.canvas.renderAll();
      });
    },
    /**
     * Set border color when selected group object
     *
     * @param {Element}  group  Group object
     */
    setBorderHighLight(group) {
      const layout = this.sheetLayout(this.pageSelected?.id);
      group.set({
        borderColor: layout?.id ? 'white' : '#bcbec0'
      });
    },
    /**
     * Set canvas uniform scaling (constrain proportions)
     *
     * @param {Boolean}  isConstrain  the selected object
     */
    setCanvasUniformScaling(isConstrain) {
      window.printCanvas.set({
        uniformScaling: isConstrain
      });
    },
    /**
     * Event fired when an object of canvas is selected
     *
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
      this.setBorderHighLight(target);

      const objectData = this.selectedObject;

      if (targetType === 'group' && target.objectType === OBJECT_TYPE.TEXT) {
        const rectObj = target.getObjects(OBJECT_TYPE.RECT)[0];

        this.setBorderObject(rectObj, objectData);
      }

      const objectType = objectData?.type;
      const isSelectMultiObject = !objectType;

      if (isSelectMultiObject) {
        this.setCanvasUniformScaling(true);
      } else {
        this.setCanvasUniformScaling(objectData.isConstrain);
      }

      if (isEmpty(objectType)) return;

      this.setObjectTypeSelected({ type: objectType });

      this.openProperties(objectType);
    },
    /**
     * Event fire when user click on Text button on Toolbar to add new text on canvas
     */
    addText(x, y, width, height) {
      const { object, data } = createTextBox(
        x,
        y,
        width,
        height,
        {},
        this.pageSelected.id
      );
      object.on('rotated', this.handleRotated);
      this.addNewObject(data);
      const isConstrain = data.newObject.isConstrain;
      this.setCanvasUniformScaling(isConstrain);
      window.printCanvas.add(object);
      this.getThumbnailUrl();

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

      applyTextBoxProperties(activeObj, prop);
    },
    /**
     * Event fire when user click on Image button on Toolbar to add new image on canvas
     */
    addImageBox(x, y, width, height) {
      const newImage = cloneDeep(ImageElement);
      const id = uniqueId();
      this.addNewObject({
        id,
        newObject: {
          ...newImage,
          id,
          coord: {
            ...newImage.coord,
            x,
            y
          }
        }
      });
      const fabricProp = toFabricImageProp(newImage);
      new fabric.Image.fromURL(
        require('../../../../../assets/image/content-placeholder.jpg'),
        image => {
          const {
            width: adjustedWidth,
            height: adjustedHeight
          } = getAdjustedObjectDimension(image, width, height);

          image.set({
            left: x,
            top: y
          });

          image.scaleX = adjustedWidth / image.width;
          image.scaleY = adjustedHeight / image.height;

          window.printCanvas.add(image);

          selectLatestObject(window.printCanvas);
        },
        {
          ...fabricProp,
          id,
          cornerSize: CORNER_SIZE,
          lockUniScaling: false,
          crossOrigin: 'anonymous'
        }
      );
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

      merge(newBackground, background);

      newBackground.isLeft = isLeft;

      this.addNewBackground({ background: newBackground });

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
     * @param {Object}  prop  new prop
     */
    changeBackgroundProperties(prop) {
      if (isEmpty(prop)) {
        this.updateTriggerBackgroundChange();

        return;
      }

      const background = window.printCanvas.getActiveObject();

      if (isEmpty(background)) return;

      //this.setObjectProp({ id: this.selectedObjectId, property: prop });

      this.updateTriggerBackgroundChange();

      updatePrintBackground(background, prop, window.printCanvas);
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

        merge(newClipArt, c);

        return {
          id: uniqueId(),
          object: {
            ...newClipArt,
            vector: require(`../../../../../assets/image/clip-art/${newClipArt.vector}`)
          }
        };
      });

      const eventListeners = {
        //scaling: this.handleShapeScaling,
        //scaled: this.handleShapeScaled,
        rotated: this.handleRotated
        //moved: this.handleShapeMoved
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

        const { top, left } = fabricObject;

        this.addNewObject({
          id: s.id,
          newObject: {
            ...s.object,
            coord: {
              x: pxToIn(left),
              y: pxToIn(top)
            }
          }
        });
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
     * @param {Object} e - Shape element
     */
    handleShapeScaling(e) {
      const target = e.transform?.target;
      if (isEmpty(target)) return;
      let { scaleX, scaleY, width, height } = target;
      const currentWidthInch = pxToIn(width * scaleX);
      const currentHeightInch = pxToIn(height * scaleY);
      const minScale = inToPx(DEFAULT_SHAPE.MIN_SIZE) / width;
      if (currentWidthInch < DEFAULT_SHAPE.MIN_SIZE) {
        scaleX = minScale;
      }

      if (currentHeightInch < DEFAULT_SHAPE.MIN_SIZE) {
        scaleY = minScale;
      }
      target.set({
        scaleX,
        scaleY
      });
    },
    /**
     * Callback function for handle scaled to update shape's dimension
     * @param {Object} e - Shape element
     */
    handleShapeScaled(e) {
      const target = e.transform?.target;
      if (isEmpty(target)) return;
      const currentWidthInch = pxToIn(target.width * target.scaleX);
      const currentHeightInch = pxToIn(target.height * target.scaleY);
      const currentXInch = pxToIn(target.left);
      const currentYInch = pxToIn(target.top);
      this.changeShapeProperties({
        size: {
          width:
            currentWidthInch < DEFAULT_SHAPE.MIN_SIZE
              ? DEFAULT_SHAPE.MIN_SIZE
              : currentWidthInch,
          height:
            currentHeightInch < DEFAULT_SHAPE.MIN_SIZE
              ? DEFAULT_SHAPE.MIN_SIZE
              : currentHeightInch
        },
        coord: {
          x: currentXInch,
          y: currentYInch
        }
      });
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
        scaling: this.handleShapeScaling,
        scaled: this.handleShapeScaled,
        rotated: this.handleRotated,
        moved: this.handleShapeMoved
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

        this.addNewObject({
          id: s.id,
          newObject: {
            ...s.object,
            coord: {
              x: pxToIn(left),
              y: pxToIn(top)
            }
          }
        });
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
     * update z-index of objecs on canvas to:
     *   + objects in the store (print/objects Z-index)
     *   + objects on fabric canvas
     */
    updateZIndexToStore() {
      const allObjects = window.printCanvas.getObjects();
      // z-index is equvalent to the index of object in allObjects array
      const data = [];
      allObjects.forEach((o, index) => {
        if (o.objectType && o.objectType != OBJECT_TYPE.BACKGROUND)
          data.push({ id: o.id, prop: { zIndex: index } });
        // update on fabric object
        o.zIndex = index;
      });

      // call mutation to update to store
      this.setPropOfMutiObjects(data);
    },

    /**
     * Event fire when user change any property of selected shape
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

      updateElement(element, prop, window.printCanvas);
    },
    /**
     * Callback function for handle moved to update shape's dimension
     * @param {Object} e - Shape element
     */
    handleShapeMoved(e) {
      const target = e.transform?.target;
      if (isEmpty(target)) return;
      const currentXInch = pxToIn(target.left);
      const currentYInch = pxToIn(target.top);
      this.changeShapeProperties({
        coord: {
          x: currentXInch,
          y: currentYInch
        }
      });
    }
  }
};
