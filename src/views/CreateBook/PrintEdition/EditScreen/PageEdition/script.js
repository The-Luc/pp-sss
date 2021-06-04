import { mapGetters, mapMutations } from 'vuex';
import { fabric } from 'fabric';

import { useDrawLayout } from '@/hooks';

import {
  isEmpty,
  styleToFabricStyle,
  fabricStyleToStyle,
  propToFabricProp,
  fabricPropToProp,
  getCoverPagePrintSize,
  getPagePrintSize
} from '@/common/utils';

import { GETTERS as APP_GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS, MUTATES as BOOK_MUTATES } from '@/store/modules/book/const';

import { OBJECT_TYPE, SHEET_TYPES } from '@/common/constants';
import { MUTATES as PROP_MUTATES } from '@/store/modules/property/const';
import PageSizeWrapper from '@/components/PageSizeWrapper';

export default {
  components: {
    PageSizeWrapper
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
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES
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
          let position = '';
          if (val.type === SHEET_TYPES.FRONT_COVER) {
            position = 'right';
          }

          if (val.type === SHEET_TYPES.BACK_COVER) {
            position = 'left';
          }
          const layoutData = val?.printData?.layout;
          this.drawLayout(layoutData, position);
        }
      }
    }
  },
  mounted() {
    // moved to onContainerReady
  },
  beforeDestroy() {
    this.$root.$off('printDeleteElements', () => {
      this.deleteElements();
    });
  },
  methods: {
    ...mapMutations({
      setIsOpenProperties: MUTATES.TOGGLE_MENU_PROPERTIES,
      setObjectTypeSelected: MUTATES.SET_OBJECT_TYPE_SELECTED,
      setTextProperties: BOOK_MUTATES.TEXT_PROPERTIES,
      setTextStyle: PROP_MUTATES.SET_TEXT_STYLE,
      setTextProp: PROP_MUTATES.SET_TEXT_PROPERTY
    }),
    updateCanvasSize(containerSize) {
      const printSize = this.isCover
        ? getCoverPagePrintSize(this.isHardCover, this.book.totalPages)
        : getPagePrintSize();
      const canvasSize = {
        width: 0,
        height: 0
      };
      if (containerSize.ratio > printSize.inches.ratio) {
        canvasSize.height = containerSize.height;
        canvasSize.width = canvasSize.height * printSize.inches.ratio;
      } else {
        canvasSize.width = containerSize.width;
        canvasSize.height = canvasSize.width / printSize.inches.ratio;
      }
      window.printCanvas.setWidth(canvasSize.width);
      window.printCanvas.setHeight(canvasSize.height);
    },
    onContainerReady(containerSize) {
      let el = this.$refs.canvas;
      window.printCanvas = new fabric.Canvas(el);
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

      this.$root.$on('printChangeTextStyle', style => {
        this.changeObjectStyle(style);
      });

      this.$root.$on('printChangeTextProp', prop => {
        this.changeObjectProperties(prop);
      });
    },
    onContainerResized(containerSize) {
      this.updateCanvasSize(containerSize);
    },
    /**
     * Open text properties modal and set default properties
     */
    openProperties() {
      const obj = window.printCanvas.getActiveObject();
      const bold = obj.fontWeight && obj.fontWeight === 'bold';
      const fontStyle = obj.fontStyle && obj.fontStyle === 'italic';
      const underLine = obj.underline && obj.underline === true;
      const { fontFamily, fontSize, textAlign } = obj;
      this.setTextProperties({
        bold,
        fontStyle,
        underLine,
        fontFamily,
        fontSize,
        textAlign
      });
      this.setIsOpenProperties({
        isOpen: true
      });
      this.setObjectTypeSelected({
        type: OBJECT_TYPE.TEXT
      });
    },
    /**
     * Close text properties modal
     */
    closeProperties() {
      this.setIsOpenProperties({
        isOpen: false
      });
      this.setObjectTypeSelected({
        type: OBJECT_TYPE.TEXT
      });
    },
    /**
     * Event fired when an object of canvas is selected
     *
     * @param {Object}  target  the selected object
     */
    objectSelected: function({ target }) {
      // currently only code for text
      this.textSelected(target);

      this.openProperties();
    },
    /**
     * Event fired when text object of canvas is selected
     *
     * @param {Object}  target  the selected text
     */
    textSelected: function(target) {
      const {
        fontFamily,
        originalFontSize,
        fontWeight,
        fontStyle,
        underline,
        fill,
        styleId
      } = target;

      const style = fabricStyleToStyle({
        fontFamily,
        originalFontSize,
        fontWeight,
        fontStyle,
        underline,
        fill
      });

      this.setTextStyle(style);

      const prop = fabricPropToProp({
        styleId: isEmpty(styleId) ? 'default' : styleId
      });

      this.setTextProp(prop);
    },
    /**
     * Event fire when user click on Text button on Toolbar to add new text on canvas
     */
    addText: function() {
      const text = new fabric.Textbox('Text', {
        lockUniScaling: false,
        fontSize: (window.printCanvas.width / 1205) * 60,
        originalFontSize: 60,
        fontFamily: 'arial',
        fill: '#000000',
        fontWeight: '',
        fontStyle: '',
        originX: 'left',
        originY: 'top',
        left: 51,
        top: 282,
        textAlign: '',
        styleId: 'default'
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
    changeObjectStyle: function(style) {
      if (isEmpty(style)) return;

      const activeObj = window.printCanvas.getActiveObject();

      if (isEmpty(activeObj)) return;

      const fabricStyle = styleToFabricStyle(style);

      Object.keys(fabricStyle).forEach(k => {
        const value = fabricStyle[k];

        if (k === 'originalFontSize') {
          activeObj.set('fontSize', (window.printCanvas.width / 1205) * value);
        }

        activeObj.set(k, value);
      });

      window.printCanvas.renderAll();

      this.setTextStyle(style);
    },
    /**
     * Event fire when user change any property of selected text
     *
     * @param {Object}  prop  new prop data
     */
    changeObjectProperties: function(prop) {
      if (isEmpty(prop)) return;

      const activeObj = window.printCanvas.getActiveObject();

      if (isEmpty(activeObj)) return;

      const fabricProp = propToFabricProp(prop);

      Object.keys(fabricProp).forEach(k => {
        activeObj.set(k, fabricProp[k]);
      });

      this.setTextProp(prop);
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
