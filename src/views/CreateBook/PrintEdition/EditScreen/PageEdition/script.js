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
  selectLatestObject,
  deleteSelectedObjects,
  getRectDashes,
  scaleSize,
  isHalfSheet,
  isHalfLeft,
  pxToIn,
  inToPx,
  resetObjects
} from '@/common/utils';

import {
  createTextBox,
  applyTextBoxProperties,
  addPrintBackground,
  updatePrintBackground,
  addPrintShapes,
  addPrintClipArts
} from '@/common/fabricObjects';

import { addPrintSvgs, updateElement } from '@/common/fabricObjects/common';

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
  COVER_TYPE
} from '@/common/constants';
import SizeWrapper from '@/components/SizeWrapper';
import PrintCanvasLines from './PrintCanvasLines';
import PageWrapper from './PageWrapper';
import XRuler from './Rulers/XRuler';
import YRuler from './Rulers/YRuler';
import { parsePasteObject } from '@/common/utils/string';
import { COPY_OBJECT_KEY } from '@/common/constants/config';
import { createImage } from '@/common/fabricObjects/image';

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
    this.setBookId({ bookId: this.$route.params.bookId });

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
      rectObj: null,
      objectList: [],
      isProcessingPaste: false,
      countPaste: 1
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
      toolNameSelected: APP_GETTERS.SELECTED_TOOL_NAME,
      currentBackgrounds: PRINT_GETTERS.BACKGROUNDS,
      propertiesObjectType: APP_GETTERS.PROPERTIES_OBJECT_TYPE,
      object: PRINT_GETTERS.OBJECT_BY_ID,
      currentObjects: PRINT_GETTERS.GET_OBJECTS
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
          await this.getDataCanvas();
          this.countPaste = 1;
          this.setSelectedObjectId({ id: '' });
          this.updateCanvasSize();
          resetObjects(window.printCanvas);
          this.drawLayout(this.sheetLayout);
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
      getDataPageEdit: PRINT_ACTIONS.GET_DATA_EDIT,
      getDataCanvas: PRINT_ACTIONS.GET_DATA_CANVAS
    }),
    ...mapMutations({
      setBookId: PRINT_MUTATES.SET_BOOK_ID,
      setIsOpenProperties: MUTATES.TOGGLE_MENU_PROPERTIES,
      setToolNameSelected: MUTATES.SET_TOOL_NAME_SELECTED,
      toggleColorPicker: MUTATES.TOGGLE_COLOR_PICKER,
      setObjectTypeSelected: MUTATES.SET_OBJECT_TYPE_SELECTED,
      setSelectedObjectId: PRINT_MUTATES.SET_CURRENT_OBJECT_ID,
      setObjects: PRINT_MUTATES.SET_OBJECTS,
      addNewObject: PRINT_MUTATES.ADD_OBJECT,
      setObjectProp: PRINT_MUTATES.SET_PROP,
      updateTriggerTextChange: PRINT_MUTATES.UPDATE_TRIGGER_TEXT_CHANGE,
      addNewBackground: PRINT_MUTATES.SET_BACKGROUNDS,
      updateTriggerBackgroundChange:
        PRINT_MUTATES.UPDATE_TRIGGER_BACKGROUND_CHANGE,
      deleteObjects: PRINT_MUTATES.DELETE_OBJECTS,
      updateTriggerShapeChange: PRINT_MUTATES.UPDATE_TRIGGER_SHAPE_CHANGE,
      setThumbnail: PRINT_MUTATES.UPDATE_SHEET_THUMBNAIL,
      updateTriggerClipArtChange: PRINT_MUTATES.UPDATE_TRIGGER_CLIPART_CHANGE,
      reorderObjectIds: PRINT_MUTATES.REORDER_OBJECT_IDS,
      toggleActiveObjects: MUTATES.TOGGLE_ACTIVE_OBJECTS,
      setPropertiesObjectType: MUTATES.SET_PROPERTIES_OBJECT_TYPE
    }),
    async handlePasteItems(objects, processedItems = [], sheetId) {
      if (objects.length === 0) {
        return processedItems;
      }
      const objectsClone = cloneDeep(objects);
      const { data } = objectsClone.splice(0, 1)[0];
      if (data.type === OBJECT_TYPE.IMAGE) {
        const id = uniqueId();
        const image = await createImage({
          ...data,
          id,
          coord: {
            ...data.coord,
            x: data.coord.x + 0.5 * this.countPaste,
            y: data.coord.y + 0.5 * this.countPaste
          }
        });
        const objectToStore = {
          id,
          newObject: {
            ...data,
            id,
            coord: {
              ...data.coord,
              x: data.coord.x + 0.5 * this.countPaste,
              y: data.coord.y + 0.5 * this.countPaste
            }
          }
        };
        this.addImageToStore(objectToStore);
        return await this.handlePasteItems(objectsClone, [
          ...processedItems,
          image
        ]);
      }

      if (data.type === OBJECT_TYPE.SHAPE) {
        const id = uniqueId();
        const distance = sheetId === this.pageSelected.id ? 0.5 : 0;
        const ojbectData = {
          id,
          object: {
            ...data,
            coord: {
              ...data.coord,
              x: data.coord.x + distance * this.countPaste,
              y: data.coord.y + distance * this.countPaste
            }
          }
        };
        const eventListeners = {
          scaling: this.handleShapeScaling,
          scaled: this.handleShapeScaled,
          rotated: this.handleRotated,
          moved: this.handleShapeMoved
        };
        const svg = await addPrintSvgs(
          [ojbectData],
          'pathData',
          data.size.height,
          window.printCanvas,
          isHalfSheet(this.pageSelected),
          isHalfLeft(this.pageSelected),
          eventListeners,
          true
        );
        const objectToStore = {
          id,
          newObject: {
            ...data,
            id,
            coord: {
              ...data.coord,
              x: data.coord.x + distance * this.countPaste,
              y: data.coord.y + distance * this.countPaste
            }
          }
        };
        this.addShapesToStore(objectToStore);
        return await this.handlePasteItems(objectsClone, [
          ...processedItems,
          svg[0]
        ]);
      }

      // if (data.type === OBJECT_TYPE.TEXT) {
      //   const id = uniqueId();
      //   const textProperties = {
      //     ...data,
      //     id
      //   };
      //   const { object, data: objectData } = await createTextBox(
      //     0,
      //     0,
      //     0,
      //     0,
      //     textProperties
      //   );
      //   return await this.handlePasteItems(objectsClone, [
      //     ...processedItems,
      //     object
      //   ]);
      // }
    },
    /**
     * Function handle to get object(s) be copied from clipboard when user press Ctrl + V (Windows), Command + V (macOS), or from action menu
     */
    async handlePaste() {
      if (this.isProcessingPaste) return;
      this.isProcessingPaste = true;
      const clipText = sessionStorage.getItem(COPY_OBJECT_KEY);
      const objects = parsePasteObject(clipText);
      if (!isEmpty(objects)) {
        const { sheetId } = JSON.parse(clipText);
        const canvas = window.printCanvas;
        canvas.discardActiveObject();
        const listPastedObjects = await this.handlePasteItems(
          objects,
          [],
          sheetId
        );
        window.printCanvas.add(...listPastedObjects);

        if (listPastedObjects.length === 1) {
          window.printCanvas.setActiveObject(listPastedObjects[0]);
        } else if (listPastedObjects.length > 1) {
          const sel = new fabric.ActiveSelection(listPastedObjects, {
            canvas: window.printCanvas
          });
          window.printCanvas.setActiveObject(sel);
        }
        this.countPaste += 1;
        if (sheetId !== this.pageSelected.id) {
          this.handleCopy();
        }
      }
      setTimeout(() => {
        this.isProcessingPaste = false;
      }, 500);
    },
    /**
     * Function handle to set object(s) to clipboard when user press Ctrl + C (Windows), Command + C (macOS), or from action menu
     */
    handleCopy() {
      const activeObj = window.printCanvas.getActiveObject();
      if (activeObj) {
        this.countPaste = 1;
        const test = cloneDeep(activeObj);
        let objects = [test];
        if (test._objects) {
          objects = [...test._objects];
          test._restoreObjectsState();
        }
        const jsonData = objects.map(obj => ({
          data: {
            ...this.currentObjects[obj.id],
            id: null
          },
          fabric: obj.toJSON(['objectType'])
        }));
        const cacheData = {
          sheetId: this.pageSelected.id,
          [COPY_OBJECT_KEY]: jsonData
        };
        sessionStorage.setItem(COPY_OBJECT_KEY, JSON.stringify(cacheData));
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
      this.drawLayout(this.sheetLayout);
      window.printCanvas.setZoom(currentZoom);
    },

    /**
     * call this function to update the active thumbnail
     */
    getThumbnailUrl: debounce(function() {
      const thumbnailUrl = window.printCanvas.toDataURL();

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

      usePrintOverrides(fabric.Object.prototype);
      this.updateCanvasSize();
      window.printCanvas.on({
        'selection:updated': this.objectSelected,
        'selection:cleared': this.closeProperties,
        'selection:created': this.objectSelected,
        'object:modified': this.getThumbnailUrl,
        'object:added': this.getThumbnailUrl,
        'object:removed': this.getThumbnailUrl,
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

        if (this.propertiesObjectType === OBJECT_TYPE.BACKGROUND) {
          this.setIsOpenProperties({ isOpen: false });

          this.setPropertiesObjectType({ type: '' });
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

      this.$root.$on('changeObjectIdsOrder', actionName => {
        this.changeObjectIdsOrder(actionName);
      });

      this.$root.$on('printChangeClipArtProperties', prop => {
        this.changeClipArtProperties(prop);
      });

      this.$root.$on('printCopyObj', this.handleCopy);
      this.$root.$on('printPasteObj', this.handlePaste);
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
        this.toggleColorPicker({ isOpen: false });
      }

      if (this.propertiesObjectType !== OBJECT_TYPE.BACKGROUND) {
        this.setIsOpenProperties({ isOpen: false });

        this.setPropertiesObjectType({ type: '' });
      }

      this.setObjectTypeSelected({ type: '' });

      this.toggleActiveObjects(false);

      this.setSelectedObjectId({ id: '' });
      // if (this.toolNameSelected === TOOL_NAME.ACTIONS) {
      //   this.setToolNameSelected({ name: '' });
      // }
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
      group.set({
        borderColor: this.sheetLayout?.id ? 'white' : '#bcbec0'
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

      this.setPropertiesObjectType({ type: objectType });

      this.openProperties(objectType);
    },
    /**
     * Event fire when user click on Text button on Toolbar to add new text on canvas
     */
    addText(x, y, width, height) {
      const { object, data } = createTextBox(x, y, width, height, {});
      object.on('rotated', this.handleRotated);
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

      this.setObjectProp({ prop });

      this.updateTriggerTextChange();

      applyTextBoxProperties(activeObj, prop);

      // update thumbnail
      this.getThumbnailUrl();
    },
    addImageToStore(newImage) {
      this.addNewObject(newImage);
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
          }
        }
      });

      this.addImageToStore(newImage);

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
    addShapesToStore(newShape) {
      this.addNewObject(newShape);
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
        this.addShapesToStore(newShape);
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

      updateElement(element, prop, window.printCanvas);

      // update thumbnail
      this.getThumbnailUrl();
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

      const numBackground = this.currentBackgrounds.length;

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
