import { mapGetters, mapMutations } from 'vuex';
import { fabric } from 'fabric';
import { cloneDeep } from 'lodash';

import { useDrawLayout } from '@/hooks';

import {
  isEmpty,
  toFabricTextProp,
  getCoverPagePrintSize,
  getPagePrintSize,
  scaleSize
} from '@/common/utils';

import { GETTERS as APP_GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS, MUTATES as BOOK_MUTATES } from '@/store/modules/book/const';

import { TextElement } from '@/common/models';
import { SHEET_TYPES, TEXT_CASE, DEFAULT_TEXT } from '@/common/constants';

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
          const layoutData = val?.printData?.layout;
          const objects = this.getObjectsBySheetId(val.id);
          this.drawLayout(layoutData, objects);
        }
      }
    }
  },
  beforeDestroy() {
    this.$root.$off('printDeleteElements', () => {
      this.deleteElements();
    });
    window.printCanvas = null;
  },
  methods: {
    ...mapMutations({
      setIsOpenProperties: MUTATES.TOGGLE_MENU_PROPERTIES,
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
      fabricPrototype.setControlsVisibility({
        mtr: false
      });
      this.updateCanvasSize(containerSize);
      window.printCanvas.on({
        'selection:updated': this.objectSelected,
        'selection:cleared': this.closeProperties,
        'selection:created': this.objectSelected,
        'object:scaling': e => {
          const w = e.target.width;
          const h = e.target.height;
          const scaleX = e.target.scaleX;
          const scaleY = e.target.scaleY;

          e.target.set('scaleX', 1);
          e.target.set('scaleY', 1);
          e.target.set('width', w * scaleX);
          e.target.set('height', h * scaleY);
        }
      });

      this.$root.$on('printAddText', () => {
        this.addText();
      });

      this.$root.$on('printDeleteElements', () => {
        this.deleteElements();
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

      this.setSelectedObjectId({ id: '' });
    },
    /**
     * Event fired when an object of canvas is selected
     *
     * @param {Object}  target  the selected object
     */
    objectSelected: function({ target }) {
      const { id } = target;

      this.setSelectedObjectId({ id: id });

      const objectType =
        this.selectedObject(this.selectedObjectId)?.Type || null;

      this.setObjectTypeSelected({ type: objectType });

      this.openProperties();
    },
    /**
     * Event fire when user click on Text button on Toolbar to add new text on canvas
     */
    addText: function() {
      newId++;

      const newText = cloneDeep(TextElement);

      this.addNewObject({
        id: newId,
        newObject: {
          ...newText
        }
      });

      const fabricProp = toFabricTextProp(newText);

      const text = new fabric.Textbox(DEFAULT_TEXT.TEXT, {
        ...fabricProp,
        id: newId,
        lockUniScaling: DEFAULT_TEXT.LOCK_UNI_SCALE,
        originX: scaleSize(DEFAULT_TEXT.ORIGIN.X),
        originY: scaleSize(DEFAULT_TEXT.ORIGIN.Y)
      });

      window.printCanvas.add(text);
      const index = window.printCanvas.getObjects().length - 1;
      window.printCanvas.setActiveObject(window.printCanvas.item(index));
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
    },
    /**
     * Event fire when user click on Delete button on Toolbar to delete selected elements on canvas
     */
    deleteElements() {
      const activeObj = window.printCanvas.getActiveObject();
      if (isEmpty(activeObj)) return;
      if (activeObj._objects) {
        activeObj._objects.forEach(object => window.printCanvas.remove(object));
      } else {
        window.printCanvas.remove(activeObj);
      }
      window.printCanvas.discardActiveObject().renderAll();
    }
  }
};
