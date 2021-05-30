import { mapGetters, mapMutations } from 'vuex';
import { fabric } from 'fabric';

import { useDrawLayout } from '@/hooks';

import { GETTERS as APP_GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS, MUTATES as BOOK_MUTATES } from '@/store/modules/book/const';
import { OBJECT_TYPE } from '@/common/constants';
export default {
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
    isHardCover() {
      const { coverOption, sections } = this.book;
      return (
        coverOption === 'Hardcover' &&
        this.pageSelected === sections[0].sheets[0].id
      );
    },
    isSoftCover() {
      const { coverOption, sections } = this.book;
      return (
        coverOption === 'Softcover' &&
        this.pageSelected === sections[0].sheets[0].id
      );
    },
    isIntro() {
      const { sections } = this.book;
      return this.pageSelected === sections[1].sheets[0].id;
    },
    isSignature() {
      const { sections } = this.book;
      const lastSection = sections[sections.length - 1];
      return (
        this.pageSelected ===
        lastSection.sheets[lastSection.sheets.length - 1].id
      );
    }
  },
  watch: {
    pageSelected(val) {
      const layoutData = this.selectedLayout(val);
      if (layoutData) {
        this.setLayoutForSheet(layoutData);
      } else {
        this.setLayoutForSheet({});
      }
    }
  },
  methods: {
    ...mapMutations({
      setIsOpenProperties: MUTATES.TOGGLE_MENU_PROPERTIES,
      setObjectTypeSelected: MUTATES.SET_OBJECT_TYPE_SELECTED,
      setTextProperties: BOOK_MUTATES.TEXT_PROPERTIES
    }),
    /**
     * Open text properties modal and set default properties
     */
    openProperties() {
      const obj = window.printCanvas.getActiveObject();
      const bold = obj.fontWeight && obj.fontWeight === 'bold';
      const fontStyle = obj.fontStyle && obj.fontStyle === 'italic';
      const underLine = obj.underline && obj.underline === true;
      const { fontFamily, fontSize } = obj;
      this.setTextProperties({
        bold,
        fontStyle,
        underLine,
        fontFamily,
        fontSize
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
     * Draw layout in print canvas
     * @param {Object} layoutData - Current layout object data
     */
    setLayoutForSheet(layoutData) {
      let { imageUrlLeft, imageUrlRight } = layoutData;
      this.drawLayout(imageUrlLeft, imageUrlRight);
    }
  },
  mounted() {
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
    window.printCanvas.setWidth(1205);
    window.printCanvas.setHeight(768);
    window.printCanvas.on({
      'selection:updated': this.openProperties,
      'selection:cleared': this.closeProperties,
      'selection:created': this.openProperties
    });
  }
};
