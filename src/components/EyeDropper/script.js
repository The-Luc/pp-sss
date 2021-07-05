import { getCanvasColor, handleBodyMouseMove } from '@/common/utils';

export default {
  props: {
    color: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      x: 0,
      y: 0
    };
  },
  mounted() {
    document.body.addEventListener('mousemove', this.handleEyeDropperMove);
    document.body.addEventListener('keyup', this.handleKeyPress);
  },
  beforeDestroy() {
    document.body.removeEventListener('mousemove', this.handleEyeDropperMove);
    document.body.removeEventListener('keyup', this.handleKeyPress);
  },
  methods: {
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

      this.$emit('colorChange', color);
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
     * Callback function emit event key up from user
     * @param {Event} event Event key up
     */
    handleKeyPress(event) {
      this.$emit('keyPress', event);
    }
  }
};
