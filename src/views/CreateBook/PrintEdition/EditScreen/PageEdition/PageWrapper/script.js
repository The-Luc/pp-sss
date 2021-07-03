import Color from 'color';

import { OBJECT_TYPE } from '@/common/constants';
import AddBoxInstruction from '@/components/AddBoxInstruction';
import EyeDropper from '@/components/EyeDropper';

import { getCanvasColor, handleBodyMouseMove } from '@/common/utils';

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
  mounted() {
    this.$root.$on('printInstructionStart', this.handlePrintInstructionStart);
    this.$root.$on('printInstructionEnd', this.handlePrintInstructionEnd);

    this.$root.$on('printEyeDropperStart', this.handlePrintEyeDropperStart);
    this.$root.$on('printEyeDropperEnd', this.handlePrintEyeDropperEnd);
  },
  methods: {
    /**
     * Callback function handle when user click text and image icon on Creation Tool to start draw text/image with instruction
     * @param {Object} event Event data
     * @param {String} event.element Current object user want draw (text | image)
     */
    handlePrintInstructionStart({ element }) {
      if (ELEMENTS[element] !== this.element) {
        this.element = ELEMENTS[element] || 'box';
      }

      document.body.addEventListener('mousemove', this.handleInstructionMove);
      document.body.addEventListener('keyup', this.handleKeyPress);
    },
    /**
     * Callback function handle after user drawed text/image with instruction
     */
    handlePrintInstructionEnd() {
      this.element = '';
      this.visible = false;
      this.setCoord(0, 0);

      document.body.removeEventListener(
        'mousemove',
        this.handleInstructionMove
      );

      document.body.removeEventListener('keyup', this.handleKeyPress);
    },
    /**
     * Callback function set coord of mouse while moving
     * @param {Event} event Event mouse move
     * @param {Number} event.clientX Mouse's x position
     * @param {Number} event.clientY Mouse's y position
     */
    handleInstructionMove({ clientX, clientY }) {
      const { visible, x, y } = handleBodyMouseMove({ clientX, clientY });

      this.setCoord(x, y);

      this.visible = visible;
    },
    /**
     * Callback function handle when user click eye dropper icon to start pick color
     */
    handlePrintEyeDropperStart() {
      document.body.addEventListener('mousemove', this.handleEyeDropperMove);
      document.body.addEventListener('keyup', this.handleKeyPress);
    },
    /**
     * Callback function get color after user clicked on object and emit to event name to change to current object property
     * @param {String} eventName Unique event name to know user want to pick color for what maybe text, border, shadow color of object
     */
    handlePrintEyeDropperEnd(callback) {
      const clr = Color(this.color).hex();
      if (callback) {
        callback(clr);
      }

      this.visibleEyeDropper = false;
      this.setCoord(0, 0);

      document.body.removeEventListener('mousemove', this.handleEyeDropperMove);
      document.body.removeEventListener('keyup', this.handleKeyPress);
    },
    /**
     * Callback function set coord of mouse while moving and get color of canvas
     * @param {Event} event Event mouse move
     */
    handleEyeDropperMove(e) {
      const { clientX, clientY } = e;

      const { visible, canvas, x, y } = handleBodyMouseMove({
        clientX,
        clientY
      });

      this.setCoord(x, y);

      this.visibleEyeDropper = visible;

      const color = getCanvasColor(canvas, e);

      this.color = color;
    },
    /**
     * Set coord and y when user move mouse
     * @param {Number} x Current mouse's x position
     * @param {Number} y Current mouse's y position
     */
    setCoord(x, y) {
      this.x = x;
      this.y = y;
    },
    /**
     * Callback function handle user press key from keyboard
     * @param {Event} event Event key up
     */
    handleKeyPress(event) {
      const key = event.keyCode || event.charCode;
      if (key === 27) {
        this.$root.$emit('enscapeInstruction');
      }
    }
  }
};
