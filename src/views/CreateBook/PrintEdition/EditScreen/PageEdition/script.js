import { mapGetters, mapMutations } from 'vuex';
import { fabric } from 'fabric';
import { cloneDeep } from 'lodash';

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

import { ImageElement, TextElement } from '@/common/models';
import {
  SHEET_TYPES,
  TEXT_CASE,
  DEFAULT_TEXT,
  FABRIC_OBJECT_TYPE,
  OBJECT_TYPE
} from '@/common/constants';

import SizeWrapper from '@/components/SizeWrapper';
import PageWrapper from './PageWrapper';

let newId = 0;

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
      return this.pageSelected.type === SHEET_TYPES.COVER;
    },
    isHardCover() {
      const { coverOption } = this.book;
      return (
        coverOption === 'Hardcover' &&
        this.pageSelected.type === SHEET_TYPES.COVER
      );
    },
    isSoftCover() {
      const { coverOption } = this.book;
      return (
        coverOption === 'Softcover' &&
        this.pageSelected.type === SHEET_TYPES.COVER
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
          window.printCanvas.discardActiveObject().renderAll();
          const layoutData = val?.printData?.layout;
          const objects = this.getObjectsBySheetId(val.id);
          this.drawLayout(layoutData, objects);
        }
      }
    }
  },
  beforeDestroy() {
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
      updateTriggerChange: BOOK_MUTATES.UPDATE_TRIGGER_OBJECT_CHANGE
    }),
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
    onContainerReady(containerSize) {
      let el = this.$refs.canvas;
      window.printCanvas = new fabric.Canvas(el, {
        backgroundColor: '#ffffff'
      });
      let fabricPrototype = fabric.Object.prototype;
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
    },
    onContainerResized(containerSize) {
      this.updateCanvasSize(containerSize);
    },
    /**
     * Open text properties modal and set default properties
     */
    openProperties() {
      this.setIsOpenProperties({
        isOpen: true
      });

      this.updateTriggerChange();
    },
    /**
     * Close text properties modal
     */
    closeProperties() {
      this.setIsOpenProperties({
        isOpen: false
      });
      this.setObjectTypeSelected({
        type: ''
      });
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
      target.setControlsVisibility({
        mtr: objectType !== OBJECT_TYPE.TEXT
      });
      if (objectType) {
        this.setObjectTypeSelected({ type: objectType });
        this.openProperties();
      }
    },
    /**
     * Event fire when user click on Text button on Toolbar to add new text on canvas
     */
    addText: function(x, y, width, height) {
      newId++;

      const newText = cloneDeep(TextElement);

      this.addNewObject({
        id: newId,
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
        id: newId,
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
      newId++;
      const newImage = cloneDeep(ImageElement);

      this.addNewObject({
        id: newId,
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
          id: newId,
          cornerSize: 11,
          lockUniScaling: false,
          crossOrigin: 'anonymous'
        }
      );
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
