import {
  drawObjectsOnCanvas,
  getCoverPagePrintSize,
  getPagePrintSize,
  isEmpty,
  setActiveEdition
} from '@/common/utils';
import { addPrintPageNumber } from '@/common/fabricObjects';
import { useOverrides } from '@/plugins/fabric';
import { fabric } from 'fabric';
import { usePageApi } from './composables';
import {
  PRINT_DPI,
  PDF_DPI,
  EDITION,
  SHEET_TYPE,
  COVER_TYPE
} from '@/common/constants';
import { get } from 'lodash';

export default {
  setup() {
    const { getBook, getSheet } = usePageApi();
    return {
      getBook,
      getSheet
    };
  },
  data() {
    return {
      containerSize: null,
      canvasSize: null,
      pageSize: null,
      canvas: null,
      rulerSize: { width: '0', height: '0' },
      isScroll: { x: false, y: false },
      isCoverPage: null,
      coverOption: null,
      containerCssStyle: {},
      canvasCssStyle: {}
    };
  },
  methods: {
    /**
     * Event triggered once the container that hold the canvas is finished rendering
     * @param {Object} containerSize - the size object
     */
    createCanvas() {
      const el = this.$refs.canvas;
      this.canvas = window.canvas = new fabric.Canvas(el, {
        backgroundColor: '#fff',
        preserveObjectStacking: true
      });
      useOverrides(fabric.Object.prototype);
    },

    /**
     * Auto resize canvas to fit the container size
     */
    updateCanvasSize() {
      const pageSize = this.isCoverPage
        ? getCoverPagePrintSize(this.coverOption, 0)
        : getPagePrintSize();
      const { sheetWidth, sheetHeight, bleedLeft } = pageSize.pixels;

      this.bleedSize = bleedLeft;

      this.canvas.setWidth(sheetWidth * this.zoom);

      this.canvas.setHeight(sheetHeight * this.zoom);

      this.canvas.setZoom(this.zoom);

      // set container size
      const pageFactor = this.isCoverPage ? 0 : bleedLeft;
      const width = (Math.floor(sheetWidth / 2) + pageFactor) * this.zoom;
      const canvasMargin = this.isLeftPage ? 0 : sheetWidth * this.zoom - width;

      this.containerCssStyle = {
        width: width + 'px'
      };
      this.canvasCssStyle = { 'margin-left': -canvasMargin + 'px' };
    },

    /**
     * Dispach event when page loaded
     */
    dispatchLoadedEvent() {
      const event = new CustomEvent('pdf-page-loaded', {
        detail: {
          message: 'PDF Page Loaded',
          time: new Date()
        },
        bubbles: true,
        cancelable: true
      });
      document.body.dispatchEvent(event);
    },
    /**
     * Get scale value
     * @returns scale value
     */
    getScaleValue() {
      const zoom = +get(this.$route, 'query.scale', 1);

      const ratio = PDF_DPI / PRINT_DPI;

      if (!zoom || zoom > 1) return ratio;

      return zoom < 0.01 ? ratio * 0.01 : zoom * ratio;
    },
    addPageNumber(sheet, pageInfoProp) {
      const { spreadInfo, pageNumber } = sheet;

      addPrintPageNumber({
        spreadInfo,
        pageNumber,
        canvas: this.canvas,
        pageInfoProp
      });
    }
  },
  beforeMount() {
    this.zoom = this.getScaleValue();

    sessionStorage.setItem('token', get(this.$route, 'query.token', ''));
  },
  async mounted() {
    // enable to scroll when canvas is bigger screen size
    const bodyEl = document.querySelector('body');
    bodyEl.style.overflow = 'auto';

    this.createCanvas();
    setActiveEdition(this.canvas, EDITION.PRINT);

    try {
      const pageId = get(this.$route, 'params.pageId');
      const bookId = get(this.$route, 'params.bookId');

      if (isEmpty(pageId)) return;

      const {
        sheetType,
        coverOption,
        isLeftPage,
        sheetId,
        pageInfo
      } = await this.getBook(bookId, pageId);

      this.coverOption = COVER_TYPE[coverOption] === COVER_TYPE.HARDCOVER;
      this.isCoverPage = SHEET_TYPE.COVER === sheetType;
      this.isLeftPage = isLeftPage;

      this.updateCanvasSize();

      const sheet = await this.getSheet(sheetId);

      await drawObjectsOnCanvas(sheet.objects, this.canvas);

      this.addPageNumber(sheet, pageInfo);

      this.dispatchLoadedEvent();
    } catch (ex) {
      this.dispatchLoadedEvent();
    }
  }
};
