import { KEY_CODE, OBJECT_TYPE } from '@/common/constants';
import AddBoxInstruction from '@/components/AddBoxInstruction';

import { handleBodyMouseMove } from '@/common/utils';

const ELEMENTS = {
  [OBJECT_TYPE.TEXT]: 'a text box',
  [OBJECT_TYPE.IMAGE]: 'an image box'
};

export default {
  components: {
    AddBoxInstruction
  },
  props: {
    rulerSize: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      element: '',
      x: 0,
      y: 0,
      visible: false
    };
  },
  methods: {
    /**
     * Callback function handle when user click text and image icon on Creation Tool to start draw text/image with instruction
     * @param {Object} event Event data
     * @param {String} event.element Current object user want draw (text | image)
     */
    instructionStart({ element }) {
      if (ELEMENTS[element] !== this.element) {
        this.element = ELEMENTS[element] || 'box';
      }

      document.body.addEventListener('mousemove', this.handleInstructionMove);
      document.body.addEventListener('keyup', this.handleKeyPress);
    },
    /**
     * Callback function handle after user drawed text/image with instruction
     */
    instructionEnd() {
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
      if (key === KEY_CODE.ESCAPE) {
        this.$root.$emit('enscapeInstruction');
      }
    }
  }
};
