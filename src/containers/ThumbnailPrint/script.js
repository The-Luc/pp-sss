import { mapGetters } from 'vuex';
import { fabric } from 'fabric';

import {
  LINK_STATUS,
  SHEET_TYPES,
  IMAGE_LOCAL,
  ROUTE_NAME
} from '@/common/constants';
import { useDrawLayout } from '@/hooks';
import { GETTERS } from '@/store/modules/book/const';

export default {
  setup() {
    const { drawLayout } = useDrawLayout();
    return {
      drawLayout
    };
  },
  props: {
    numberPage: {
      type: Object,
      default: () => {
        return {
          numberLeft: 'Back Cover',
          numberRight: 'Front Cover'
        };
      }
    },
    sheet: {
      type: Object,
      required: true
    },
    edit: {
      type: Boolean,
      default: true
    },
    isShowLink: {
      type: Boolean,
      default: true
    },
    toLink: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: false
    },
    fontSize: {
      type: String,
      default: '10px'
    },
    canvasHeight: {
      type: Number,
      default: 80
    }
  },
  data() {
    return {
      objCanvas: null
    };
  },
  computed: {
    ...mapGetters({
      sheetLayout: GETTERS.SHEET_LAYOUT,
      book: GETTERS.BOOK_DETAIL
    }),
    currentLayout() {
      return this.sheetLayout(this.sheet.id);
    }
  },
  watch: {
    currentLayout(val) {
      this.drawThumbnailLayout(val, this.objCanvas);
    }
  },
  created() {
    this.image =
      this.sheet.printData.thumbnailUrl || IMAGE_LOCAL.BACKGROUND_WHITE;
    this.LINK_STATUS = LINK_STATUS;
    this.SHEET_TYPES = SHEET_TYPES;
  },
  mounted() {
    const refs = this.$refs[`thumbnail${this.sheet.id}`];
    const refsContainer = this.$refs.thumbnailContainer;
    const canvas = new fabric.Canvas(refs, {
      width: refsContainer.clientWidth,
      height: this.canvasHeight
    });
    this.objCanvas = canvas;

    if (this.currentLayout?.id) {
      this.drawThumbnailLayout(this.currentLayout, canvas);
    }
    if (this.$route.name === ROUTE_NAME.PRINT) {
      window.addEventListener('resize', this.resizeCanvas);
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeCanvas);
  },
  methods: {
    /**
     * Listen event resize, set canvas width and redraw layout
     */
    resizeCanvas() {
      const refsContainer = this.$refs.thumbnailContainer;
      if (refsContainer?.clientWidth) {
        this.objCanvas.setWidth(refsContainer?.clientWidth);
      }
      if (this.currentLayout?.id) {
        this.drawThumbnailLayout(this.currentLayout, this.objCanvas);
      }
    },
    /**
     * Using fabric to draw left layout in thumnail
     * @param {String} src - Layout url
     * @param {Refs} canvas - Thumbnail refs
     */
    drawLeftLayout(src, canvas) {
      if (!src) {
        canvas.clear().renderAll();
        return;
      }
      fabric.Image.fromURL(require(`@/assets/image/layouts/${src}`), img => {
        img.selectable = false;
        img.scaleX = canvas.width / img.width / 2;
        img.scaleY = canvas.height / img.height;
        canvas.add(img);
      });
    },
    /**
     * Using fabric to draw right layout in thumnail
     * @param {String} src - Layout url
     * @param {Refs} canvas - Thumbnail refs
     */
    drawRightLayout(src, canvas) {
      if (!src) {
        canvas.clear().renderAll();
        return;
      }
      fabric.Image.fromURL(require(`@/assets/image/layouts/${src}`), img => {
        img.selectable = false;
        img.left = canvas.width / 2;
        img.scaleX = canvas.width / img.width / 2;
        img.scaleY = canvas.height / img.height;
        canvas.add(img);
      });
    },
    /**
     * Get layout data to draw
     * @param {Object} layout - Layout data
     * @param {Refs} canvas - Thumbnail refs
     */
    drawThumbnailLayout(layout, canvas) {
      if (layout) {
        let { imageUrlLeft, imageUrlRight } = layout;
        this.drawLeftLayout(imageUrlLeft, canvas);
        this.drawRightLayout(imageUrlRight, canvas);
      }
    }
  }
};
