import { fabric } from 'fabric';

import { getPagePrintSize } from '@/common/utils';
import SizeWrapper from '@/components/SizeWrapper';

export default {
  components: {
    SizeWrapper
  },
  methods: {
    updateCanvasSize(containerSize) {
      const pageSize = getPagePrintSize();
      const canvasSize = {
        width: 0,
        height: 0
      };
      if (containerSize.ratio > pageSize.inches.ratio) {
        canvasSize.height = containerSize.height;
        canvasSize.width = canvasSize.height * pageSize.inches.ratio;
      } else {
        canvasSize.width = containerSize.width;
        canvasSize.height = canvasSize.width / pageSize.inches.ratio;
      }
      window.digitalCanvas.setWidth(canvasSize.width);
      window.digitalCanvas.setHeight(canvasSize.height);
    },
    onContainerReady(containerSize) {
      let el = this.$refs.digitalCanvas;
      window.digitalCanvas = new fabric.Canvas(el);
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
    },
    onContainerResized(containerSize) {
      this.updateCanvasSize(containerSize);
    }
  },
  beforeDestroy() {
    window.digitalCanvas = null;
  }
};
