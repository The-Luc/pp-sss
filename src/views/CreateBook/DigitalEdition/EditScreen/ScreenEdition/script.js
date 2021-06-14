import { fabric } from 'fabric';

import { DIGITAL_CANVAS_SIZE } from '@/common/constants/canvas';
import SizeWrapper from '@/components/SizeWrapper';
import { CORNER_SIZE } from '@/common/constants';

export default {
  components: {
    SizeWrapper
  },
  methods: {
    updateCanvasSize(containerSize) {
      const canvasSize = {
        width: 0,
        height: 0
      };
      if (containerSize.ratio > DIGITAL_CANVAS_SIZE.RATIO) {
        canvasSize.height = containerSize.height;
        canvasSize.width = canvasSize.height * DIGITAL_CANVAS_SIZE.RATIO;
      } else {
        canvasSize.width = containerSize.width;
        canvasSize.height = canvasSize.width / DIGITAL_CANVAS_SIZE.RATIO;
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
      fabricPrototype.cornerSize = CORNER_SIZE;
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
