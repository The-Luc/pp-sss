import { mapGetters, mapMutations, mapActions } from 'vuex';
import { fabric } from 'fabric';
import { cloneDeep, uniqueId, merge } from 'lodash';

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
  toFabricClipArtProp,
  getRectDashes,
  scaleSize
} from '@/common/utils';

import {
  createTextBox,
  applyTextBoxProperties,
  addPrintBackground,
  updatePrintBackground,
  getAdjustedObjectDimension,
  addPrintShapes,
  updatePrintShape
} from '@/common/fabricObjects';

import { GETTERS as APP_GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS, MUTATES as BOOK_MUTATES } from '@/store/modules/book/const';
import {
  ACTIONS as PRINT_ACTIONS,
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
  HALF_SHEET,
  HALF_LEFT
} from '@/common/constants';
import SizeWrapper from '@/components/SizeWrapper';
import PrintCanvasLines from './PrintCanvasLines';
import PageWrapper from './PageWrapper';
import { addSingleSvg, addMultiSvg } from '@/common/fabricObjects/common';

export default {
  components: {
    PageWrapper,
    SizeWrapper,
    PrintCanvasLines
  },
  setup() {
    const { drawLayout } = useDrawLayout();

    return { drawLayout };
  },
  created() {
    this.setBookId({ bookId: 1719 });

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
      pageSelected: GETTERS.GET_PAGE_SELECTED,
      selectedLayout: GETTERS.SHEET_LAYOUT,
      getObjectsBySheetId: GETTERS.GET_OBJECTS_BY_SHEET_ID,
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES,
      isOpenColorPicker: APP_GETTERS.IS_OPEN_COLOR_PICKER,
      selectedObjectId: GETTERS.SELECTED_OBJECT_ID,
      selectedObject: GETTERS.OBJECT_BY_ID,
      selectedProp: GETTERS.PROP_OBJECT_BY_ID
    }),
    isCover() {
      return this.pageSelected.type === SHEET_TYPE.COVER;
    },
    isHardCover() {
      const { coverOption } = this.book;
      return (
        coverOption === 'Hardcover' &&
        this.pageSelected.type === SHEET_TYPE.COVER
      );
    },
    isSoftCover() {
      const { coverOption } = this.book;
      return (
        coverOption === 'Softcover' &&
        this.pageSelected.type === SHEET_TYPE.COVER
      );
    },
    isIntro() {
      const { sections } = this.book;
      return this.pageSelected.id === sections[1].sheets[0].id;
    },
    isSignature() {
      const { sections } = this.book;
      const lastSection = sections[sections.length - 1];
      return (
        this.pageSelected.id ===
        lastSection.sheets[lastSection.sheets.length - 1].id
      );
    }
  },
  watch: {
    pageSelected: {
      deep: true,
      handler(val, oldVal) {
        if (val.id !== oldVal.id) {
          this.setSelectedObjectId({ id: '' });
          window.printCanvas
            .discardActiveObject()
            .remove(...window.printCanvas.getObjects())
            .renderAll();
          this.updateCanvasSize();
          const layoutData = val?.printData?.layout;
          const objects = this.getObjectsBySheetId(val.id);
          this.drawLayout(layoutData, objects);
        }
      }
    }
  },
  beforeDestroy() {
    document.body.removeEventListener('keyup', this.handleDeleteKey);
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
      setSelectedObjectId: BOOK_MUTATES.SET_SELECTED_OBJECT_ID,
      addNewObject: BOOK_MUTATES.ADD_OBJECT,
      setObjectProp: BOOK_MUTATES.SET_PROP,
      updateTriggerTextChange: BOOK_MUTATES.UPDATE_TRIGGER_TEXT_CHANGE,
      addNewBackground: BOOK_MUTATES.ADD_PRINT_BACKGROUND,
      updateTriggerBackgroundChange:
        BOOK_MUTATES.UPDATE_TRIGGER_BACKGROUND_CHANGE,
      deleteObject: BOOK_MUTATES.DELETE_PRINT_OBJECT,
      updateTriggerShapeChange: BOOK_MUTATES.UPDATE_TRIGGER_SHAPE_CHANGE
    }),
    /**
     * Auto resize canvas to fit the container size
     */
    updateCanvasSize() {
      this.printSize = this.isCover
        ? getCoverPagePrintSize(this.isHardCover, this.book.totalPages)
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
      const objects = this.getObjectsBySheetId(this.pageSelected.id);
      this.drawLayout(this.pageSelected?.printData?.layout, objects);
      window.printCanvas.setZoom(currentZoom);
    },
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
                  this.addText(left, top, width, height);
                }
                if (this.awaitingAdd === OBJECT_TYPE.IMAGE) {
                  this.addImageBox(left, top, width, height);
                }
                this.awaitingAdd = '';
              }
            );
          }
        }
      });

      this.$root.$on('printSwitchTool', toolName => {
        if (toolName !== TOOL_NAME.DELETE) {
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
      this.setSelectedObjectId({ id: '' });
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
      const layout = this.selectedLayout(this.pageSelected.id);
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
      const { id } = target;
      const targetType = target.get('type');
      this.setSelectedObjectId({ id });
      this.setBorderHighLight(target);
      const objectData = this.selectedObject(this.selectedObjectId);
      if (targetType === 'group' && target.objectType !== OBJECT_TYPE.SHAPE) {
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
      const { object, data } = createTextBox(x, y, width, height);
      this.addNewObject(data);
      const isConstrain = data.newObject.isConstrain;
      this.setCanvasUniformScaling(isConstrain);
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

      this.setObjectProp({ id: this.selectedObjectId, property: prop });

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
    addBackground({ background, isLeft }) {
      const id = uniqueId();

      const newBackground = cloneDeep(BackgroundElement);

      merge(newBackground, background);

      this.addNewBackground({
        id,
        sheetId: this.pageSelected.id,
        isLeft,
        newBackground
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
     * @param {Object}  prop  new prop
     */
    changeBackgroundProperties(prop) {
      if (isEmpty(prop)) {
        this.updateTriggerBackgroundChange();

        return;
      }

      const background = window.printCanvas.getActiveObject();

      if (isEmpty(background)) return;

      this.setObjectProp({ id: this.selectedObjectId, property: prop });

      this.updateTriggerBackgroundChange();

      updatePrintBackground(background, prop, window.printCanvas);
    },
    removeObject() {
      this.deleteObject({
        id: this.selectedObjectId,
        sheetId: this.pageSelected.id
      });

      deleteSelectedObjects(window.printCanvas);
    },
    /**
     * Event fire when user click on Clip art button on Toolbar to add new clip art on canvas
     * @param {Array} clipArts - list clip art add on Canvas
     */
    async addClipArt(clipArts) {
      const { width, height } = window.printCanvas;
      const zoom = window.printCanvas.getZoom();
      const isHalfSheet = HALF_SHEET.indexOf(this.pageSelected.type) >= 0;
      const isLeftSheet = HALF_LEFT.indexOf(this.pageSelected.type) >= 0;
      const svgs = await Promise.all(
        clipArts.map(item => {
          let id = uniqueId();
          let newClipArt = cloneDeep(ClipArtElement);
          this.addNewObject({
            id: id,
            type: OBJECT_TYPE.CLIP_ART,
            newObject: {
              ...newClipArt
            }
          });
          let fabricProp = toFabricClipArtProp(newClipArt);
          return new Promise(resolve => {
            fabric.loadSVGFromURL(
              require(`../../../../../assets/image/clip-art/${item.property.vector}`),
              (objects, options) => {
                let svgData = fabric.util.groupSVGElements(objects, options);
                svgData
                  .set({
                    ...fabricProp,
                    id: id,
                    type: OBJECT_TYPE.CLIP_ART,
                    fill: '#58595b'
                  })
                  .setCoords();
                svgData.scaleToHeight((height / zoom / svgData.height) * 8);
                svgData.scaleToWidth((width / zoom / svgData.width) * 8);
                resolve(svgData);
              }
            );
          });
        })
      );
      svgs.length == 1
        ? addSingleSvg(svgs[0], window.printCanvas, isHalfSheet, isLeftSheet)
        : addMultiSvg(svgs, window.printCanvas, isHalfSheet, isLeftSheet);

      window.printCanvas.renderAll();

      if (clipArts.length !== 1) {
        this.closeProperties();
      } else {
        setTimeout(() => {
          selectLatestObject(window.printCanvas);
        }, 500);
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

      toBeAddedShapes.forEach(s => {
        this.addNewObject({ id: s.id, newObject: s.object });
      });

      const isHalfSheet = HALF_SHEET.indexOf(this.pageSelected.type) >= 0;
      const isLeftSheet = HALF_LEFT.indexOf(this.pageSelected.type) >= 0;

      await addPrintShapes(
        toBeAddedShapes,
        window.printCanvas,
        isHalfSheet,
        isLeftSheet
      );

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
      if (isEmpty(prop)) {
        this.updateTriggerShapeChange();
        return;
      }
      const shape = window.printCanvas.getActiveObject();

      if (isEmpty(shape)) return;

      this.setObjectProp({ id: this.selectedObjectId, property: prop });

      this.updateTriggerShapeChange();

      updatePrintShape(shape, prop, window.printCanvas);
    }
  }
};
