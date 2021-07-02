import { fabric } from 'fabric';
import Color from 'color';

import { OBJECT_TYPE } from '@/common/constants';
import AddBoxInstruction from '@/components/AddBoxInstruction';
import EyeDropper from '@/components/EyeDropper';

const ELEMENTS = {
  [OBJECT_TYPE.TEXT]: 'a text box',
  [OBJECT_TYPE.IMAGE]: 'an image box'
};

export default {
  components: {
    AddBoxInstruction,
    EyeDropper
  },
  data() {
    return {
      element: '',
      x: 0,
      y: 0,
      visible: false,
      visibleEyeDropper: false,
      color: '#000000'
    };
  },
  methods: {
    positionWithinCanvas: function(clientX, clientY, top, left, width, height) {
      const x = clientX - left;
      const y = clientY - top;
      const visible = x > 0 && y > 0 && width - x > 0 && height - y > 0;
      return {
        x,
        y,
        visible
      };
    }
  },
  mounted() {
    const handleBodyMouseMove = ({ clientX, clientY }) => {
      const canvas = window.printCanvas || window.digitalCanvas;
      if (canvas) {
        const {
          top,
          left,
          width,
          height
        } = canvas.lowerCanvasEl.getBoundingClientRect();
        const { x, y, visible } = this.positionWithinCanvas(
          clientX,
          clientY,
          top,
          left,
          width,
          height
        );
        this.x = x;
        this.y = y;
        return {
          visible,
          canvas
        };
      }
    };

    const handleKeyPress = event => {
      const key = event.keyCode || event.charCode;
      if (key === 27) {
        this.$root.$emit('enscapeInstruction');
      }
    };

    const handleInstructionMove = e => {
      const { visible } = handleBodyMouseMove(e);
      this.visible = visible;
    };

    const handleEyeDropperMove = e => {
      const { visible, canvas } = handleBodyMouseMove(e);
      this.visibleEyeDropper = visible;
      const ctx = canvas.contextContainer;
      const pointer = canvas.getPointer(e);
      const data = ctx.getImageData(
        Math.round(
          (pointer.x + canvas.viewportTransform[4]) *
            fabric.devicePixelRatio *
            canvas.getZoom()
        ),
        Math.round(
          (pointer.y + canvas.viewportTransform[5]) *
            fabric.devicePixelRatio *
            canvas.getZoom()
        ),
        1,
        1
      ).data;
      const color = 'rgb(' + data[0] + ', ' + data[1] + ', ' + data[2] + ')';
      this.color = color;
    };

    this.$root.$on('printInstructionStart', ({ element }) => {
      if (ELEMENTS[element] !== this.element) {
        this.element = ELEMENTS[element] || 'box';
      }
      document.body.addEventListener('mousemove', handleInstructionMove);
      document.body.addEventListener('keyup', handleKeyPress);
    });
    this.$root.$on('printInstructionEnd', () => {
      this.element = '';
      this.visible = false;
      this.x = 0;
      this.y = 0;
      document.body.removeEventListener('mousemove', handleInstructionMove);
      document.body.removeEventListener('keyup', handleKeyPress);
    });

    this.$root.$on('printEyeDropperStart', () => {
      document.body.addEventListener('mousemove', handleEyeDropperMove);
      document.body.addEventListener('keyup', handleKeyPress);
    });

    this.$root.$on('printEyeDropperEnd', eventName => {
      const clr = Color(this.color).hex();
      this.$root.$emit(eventName, clr);
      this.visibleEyeDropper = false;
      this.x = 0;
      this.y = 0;
      document.body.removeEventListener('mousemove', handleEyeDropperMove);
      document.body.removeEventListener('keyup', handleKeyPress);
    });
  }
};
