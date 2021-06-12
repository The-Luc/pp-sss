import { mapGetters, mapMutations } from 'vuex';
import { fabric } from 'fabric';
import { cloneDeep, uniqueId } from 'lodash';

import { useDrawLayout } from '@/hooks';
import { startDrawBox } from '@/common/fabricObjects/drawingBox';
import {
  isEmpty,
  toFabricTextProp,
  getCoverPagePrintSize,
  getPagePrintSize,
  toFabricImageProp,
  selectLatestObject,
  deleteSelectedObjects
} from '@/common/utils';

import { GETTERS as APP_GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS, MUTATES as BOOK_MUTATES } from '@/store/modules/book/const';

import { ImageElement, TextElement, BackgroundElement } from '@/common/models';
import {
  SHEET_TYPE,
  HALF_SHEET,
  HALF_LEFT,
  TEXT_CASE,
  DEFAULT_TEXT,
  FABRIC_OBJECT_TYPE,
  OBJECT_TYPE,
  DEFAULT_SPACING,
  BACKGROUND_PAGE_TYPE
} from '@/common/constants';
import SizeWrapper from '@/components/SizeWrapper';
import PageWrapper from './PageWrapper';
import { useDrawControls } from '@/plugins/fabric';

export default {
  components: {
    PageWrapper,
    SizeWrapper
  },
  setup() {
    const { drawLayout } = useDrawLayout();
    return { drawLayout };
  },
  data() {
    return {
      awaitingAdd: '',
      origX: 0,
      origY: 0,
      currentRect: null
    };
  },
  computed: {
    ...mapGetters({
      book: GETTERS.BOOK_DETAIL,
      pageSelected: GETTERS.GET_PAGE_SELECTED,
      selectedLayout: GETTERS.SHEET_LAYOUT,
      getObjectsBySheetId: GETTERS.GET_OBJECTS_BY_SHEET_ID,
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES,
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
    ...mapMutations({
      setIsOpenProperties: MUTATES.TOGGLE_MENU_PROPERTIES,
      setToolNameSelected: MUTATES.SET_TOOL_NAME_SELECTED,
      setObjectTypeSelected: MUTATES.SET_OBJECT_TYPE_SELECTED,
      setSelectedObjectId: BOOK_MUTATES.SET_SELECTED_OBJECT_ID,
      addNewObject: BOOK_MUTATES.ADD_OBJECT,
      setObjectProp: BOOK_MUTATES.SET_PROP,
      updateTriggerChange: BOOK_MUTATES.UPDATE_TRIGGER_TEXT_CHANGE,
      addNewBackground: BOOK_MUTATES.ADD_BACKGROUND
    }),
    /**
     * Auto resize canvas to fit the container size
     * @param {Object} containerSize - the size object
     */
    updateCanvasSize(containerSize) {
      const printSize = this.isCover
        ? getCoverPagePrintSize(this.isHardCover, this.book.totalPages)
        : getPagePrintSize();
      const canvasSize = {
        width: 0,
        height: 0
      };
      const { ratio: printRatio, sheetWidth } = printSize.pixels;
      if (containerSize.ratio > printRatio) {
        canvasSize.height = containerSize.height;
        canvasSize.width = canvasSize.height * printRatio;
      } else {
        canvasSize.width = containerSize.width;
        canvasSize.height = canvasSize.width / printRatio;
      }
      const currentZoom = canvasSize.width / sheetWidth;
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
      let el = this.$refs.canvas;
      window.printCanvas = new fabric.Canvas(el, {
        backgroundColor: '#ffffff'
      });
      let fabricPrototype = fabric.Object.prototype;
      useDrawControls(fabricPrototype);
      fabricPrototype.cornerColor = '#fff';
      fabricPrototype.borderColor = '#8C8C8C';
      fabricPrototype.borderSize = 1.25;
      fabricPrototype.cornerSize = 9;
      fabricPrototype.cornerStrokeColor = '#8C8C8C';
      fabricPrototype.transparentCorners = false;
      fabricPrototype.borderScaleFactor = 1.5;

      this.updateCanvasSize(containerSize);
      window.printCanvas.on({
        'selection:updated': this.objectSelected,
        'selection:cleared': this.closeProperties,
        'selection:created': this.objectSelected,
        'object:scaling': e => {
          const objectFabricType = e.target.get('type');
          // Maybe update condition base on requirment
          if (objectFabricType !== FABRIC_OBJECT_TYPE.IMAGE) {
            const w = e.target.width;
            const h = e.target.height;
            const scaleX = e.target.scaleX;
            const scaleY = e.target.scaleY;
            e.target.set('scaleX', 1);
            e.target.set('scaleY', 1);
            e.target.set('width', w * scaleX);
            e.target.set('height', h * scaleY);
          }
        },
        'mouse:down': e => {
          if (this.awaitingAdd) {
            this.$root.$emit('printInstructionEnd');
            window.printCanvas.discardActiveObject().renderAll();
            this.setToolNameSelected({ name: '' });
            startDrawBox(window.printCanvas, e).then(
              ({ left, top, width, height }) => {
                if (this.awaitingAdd === 'TEXT') {
                  this.addText(left, top, width, height);
                }
                if (this.awaitingAdd === 'IMAGE') {
                  this.addImageBox(left, top, width, height);
                }
                this.awaitingAdd = '';
              }
            );
          }
        }
      });

      this.$root.$on('enscapeInstruction', () => {
        this.awaitingAdd = '';
        this.$root.$emit('printInstructionEnd');
        this.setToolNameSelected({ name: '' });
      });

      this.$root.$on('printAddElement', element => {
        this.$root.$emit('printInstructionEnd');
        this.awaitingAdd = element;
        this.$root.$emit('printInstructionStart', { element });
      });

      this.$root.$on('printDeleteElements', () => {
        deleteSelectedObjects(window.printCanvas);
      });

      this.$root.$on('printChangeTextProperties', prop => {
        this.changeTextProperties(prop);
      });

      this.$root.$on('printAddBackground', ({ background, isLeft }) => {
        this.addBackground({ background, isLeft });
      });

      document.body.addEventListener('keyup', this.handleDeleteKey);
    },
    /**
     * Event handle when container is resized by user action
     * @param {Object} containerSize - the size object
     */
    onContainerResized(containerSize) {
      this.updateCanvasSize(containerSize);
    },
    /**
     * Event handler for when user press key at body scope
     * @param {KeyBoardEvent} event - the KeyBoardEvent object
     */
    handleDeleteKey(event) {
      const key = event.keyCode || event.charCode;
      if (event.target === document.body && (key == 8 || key == 46)) {
        deleteSelectedObjects(window.printCanvas);
      }
    },
    /**
     * Open text properties modal and set default properties
     */
    openProperties(isRequireTrigger = false) {
      this.setIsOpenProperties({ isOpen: true });

      if (isRequireTrigger) this.updateTriggerChange();
    },
    /**
     * Close text properties modal
     */
    closeProperties() {
      this.setIsOpenProperties({ isOpen: false });

      this.setObjectTypeSelected({ type: '' });

      this.setSelectedObjectId({ id: '' });
    },
    /**
     * Event fired when an object of canvas is selected
     *
     * @param {Object}  target  the selected object
     */
    objectSelected: function({ target }) {
      if (this.awaitingAdd) {
        return;
      }

      const { id } = target;

      this.setSelectedObjectId({ id });

      const objectType = this.selectedObject(this.selectedObjectId)?.type;

      if (isEmpty(objectType)) return;

      this.setObjectTypeSelected({ type: objectType });

      this.openProperties(objectType === OBJECT_TYPE.TEXT);
    },
    /**
     * Event fire when user click on Text button on Toolbar to add new text on canvas
     */
    addText: function(x, y, width, height) {
      const newText = cloneDeep(TextElement);
      const id = uniqueId();
      this.addNewObject({
        id,
        type: OBJECT_TYPE.TEXT,
        newObject: {
          ...newText,
          coord: {
            ...newText.coord,
            x,
            y
          },
          property: {
            ...newText.property,
            text: DEFAULT_TEXT.TEXT
          }
        }
      });

      const fabricProp = toFabricTextProp(newText);

      const text = new fabric.Textbox(DEFAULT_TEXT.TEXT, {
        ...fabricProp,
        id,
        lockUniScaling: DEFAULT_TEXT.LOCK_UNI_SCALE,
        left: x,
        top: y,
        width,
        cornerSize: 11
      });

      text.set('height', height);

      window.printCanvas.add(text);

      setTimeout(() => {
        selectLatestObject(window.printCanvas);
      });
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
          image.set({
            left: x,
            top: y
          });
          image.scaleX = width / image.width;
          image.scaleY = height / image.height;

          window.printCanvas.add(image);

          selectLatestObject(window.printCanvas);
        },
        {
          ...fabricProp,
          id,
          cornerSize: 11,
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

      this.addNewBackground({
        id,
        sheetId: this.pageSelected.id,
        isLeft,
        newBackground: {
          ...newBackground,
          ...background
        }
      });

      const { width } = window.printCanvas;
      const zoom = window.printCanvas.getZoom();

      const currentBackgrounds = window.printCanvas
        .getObjects()
        .filter(function(o) {
          return o.objectType === OBJECT_TYPE.BACKGROUND;
        });

      const isAddingFullBackground =
        background.property.pageType === BACKGROUND_PAGE_TYPE.FULL_PAGE.id;

      const isCurrentFullBackground =
        !isEmpty(currentBackgrounds) &&
        currentBackgrounds[0].pageType === BACKGROUND_PAGE_TYPE.FULL_PAGE.id;

      const isHalfSheet = HALF_SHEET.indexOf(this.pageSelected.type) >= 0;
      const isHalfLeft =
        isHalfSheet && HALF_LEFT.indexOf(this.pageSelected.type) >= 0;

      const isAddToLeftFullSheet =
        !isHalfSheet && (isAddingFullBackground || isLeft);

      const isAddToLeft = isHalfLeft || isAddToLeftFullSheet;

      if (isHalfSheet || isAddingFullBackground || isCurrentFullBackground) {
        currentBackgrounds.forEach(bg => window.printCanvas.remove(bg));
      }

      if (!isAddingFullBackground && !isEmpty(currentBackgrounds)) {
        currentBackgrounds.forEach(bg => {
          if (bg.isLeftPage === isAddToLeft) window.printCanvas.remove(bg);
        });
      }

      const scaleX = isAddingFullBackground ? 1 : 2;

      const fabricProp = {
        id,
        left: !isAddToLeft ? width / zoom / 2 : 0,
        scaleX: 1 / zoom / scaleX,
        scaleY: 1 / zoom,
        objectType: background.type,
        pageType: background.property.pageType,
        isLeftPage: isAddToLeft,
        opacity: background.property.opacity,
        hasBorders: false,
        hasControls: false,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockMovementX: true,
        lockMovementY: true
      };

      fabric.Image.fromURL(background.property.imageUrl, img => {
        img.set(fabricProp);

        window.printCanvas.add(img);

        window.printCanvas.sendToBack(img);
      });
    },
    /**
     * Event fire when user change any property of selected text on the Text Properties
     *
     * @param {Object}  style  new style
     */
    changeTextProperties: function(prop) {
      if (isEmpty(prop)) {
        this.updateTriggerChange();

        return;
      }
      const activeObj = window.printCanvas.getActiveObject();

      if (isEmpty(activeObj)) return;

      this.setObjectProp({ id: this.selectedObjectId, property: prop });

      this.updateTriggerChange();

      const fabricProp = toFabricTextProp(prop);

      Object.keys(fabricProp).forEach(k => {
        activeObj.set(k, fabricProp[k]);
      });

      if (prop['fontSize']) {
        const lineSpacing = this.selectedProp({
          id: this.selectedObjectId,
          prop: 'lineSpacing'
        });
        const value =
          lineSpacing === 0 || lineSpacing === null
            ? 1
            : lineSpacing / (DEFAULT_SPACING.VALUE * prop['fontSize']);
        activeObj.set('lineHeight', value);
      }

      if (prop['lineSpacing'] || prop['lineSpacing'] === 0) {
        const fontSize = this.selectedProp({
          id: this.selectedObjectId,
          prop: 'fontSize'
        });
        const value =
          prop['lineSpacing'] === 0
            ? 1
            : prop['lineSpacing'] / (DEFAULT_SPACING.VALUE * fontSize);
        activeObj.set('lineHeight', value);
      }

      if (isEmpty(prop['textCase'])) {
        window.printCanvas.renderAll();

        return;
      }

      const text =
        this.selectedProp({ id: this.selectedObjectId, prop: 'text' }) || '';

      if (isEmpty(text)) {
        window.printCanvas.renderAll();

        return;
      }

      if (prop['textCase'] === TEXT_CASE.NONE) {
        activeObj.set('text', text);
      }

      if (prop['textCase'] === TEXT_CASE.UPPER) {
        activeObj.set('text', text.toUpperCase());
      }

      if (prop['textCase'] === TEXT_CASE.LOWER) {
        activeObj.set('text', text.toLowerCase());
      }

      if (prop['textCase'] === TEXT_CASE.CAPITALIZE) {
        const changedText = text
          .split(' ')
          .map(t => {
            return `${t.charAt(0).toUpperCase()}${t.toLowerCase().slice(1)}`;
          })
          .join(' ');

        activeObj.set('text', changedText);
      }

      window.printCanvas.renderAll();
    }
  }
};
