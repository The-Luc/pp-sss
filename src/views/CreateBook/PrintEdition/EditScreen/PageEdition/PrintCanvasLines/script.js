import { SHEET_TYPE } from '@/common/constants';

export default {
  props: {
    pageSize: {
      type: Object,
      default: null
    },
    canvasSize: {
      type: Object,
      default: null
    },
    sheetType: {
      type: Number,
      default: SHEET_TYPE.NORMAL
    }
  },
  computed: {
    isFrontCover() {
      return this.sheetType === SHEET_TYPE.FRONT_COVER;
    },
    isBackCover() {
      return this.sheetType === SHEET_TYPE.BACK_COVER;
    },
    isHalfSheet() {
      return this.isFrontCover || this.isBackCover;
    },
    canvas() {
      const size = { width: 0, height: 0 };
      if (this.canvasSize) {
        size.width = this.canvasSize.width || 0;
        size.height = this.canvasSize.height || 0;
      }
      return size;
    },
    visible() {
      return this.canvas.width > 0 && this.canvas.height > 0;
    },
    containerStyle() {
      return {
        display: this.visible ? 'block' : 'none',
        width: `${this.canvas.width}px`,
        height: `${this.canvas.height}px`
      };
    },
    spineConfig() {
      const spineCfg = { single: true, width: 0, style: {} };
      if (this.pageSize && this.pageSize.pixels) {
        const { spineWidth, sheetWidth } = this.pageSize.pixels;
        const spineSize = (spineWidth / sheetWidth) * this.canvas.width;
        spineCfg.single = spineSize === 0;
        if (!spineCfg.single) {
          spineCfg.width = spineSize;
          spineCfg.style.width = `${spineSize}px`;
        }
      }
      return spineCfg;
    },
    bleedStyle() {
      const bleed = { x: 0, y: 0 };
      if (this.pageSize && this.pageSize.pixels) {
        const {
          sheetWidth,
          sheetHeight,
          bleedX,
          bleedY
        } = this.pageSize.pixels;
        const { width, height } = this.canvas;
        bleed.x = (bleedX / sheetWidth) * width;
        bleed.y = (bleedY / sheetHeight) * height;
      }
      return {
        'border-width': `${bleed.y}px ${bleed.x}px`
      };
    },
    safeMargin() {
      if (this.pageSize && this.pageSize.pixels) {
        const { safeMargin, sheetWidth } = this.pageSize.pixels;
        return (safeMargin / sheetWidth) * this.canvas.width;
      }
      return 0;
    },
    safeMarginStyle() {
      return {
        width: `calc(50% - ${this.spineConfig.width / 2}px)`,
        'border-width': `${this.safeMargin}px`
      };
    }
  }
};
